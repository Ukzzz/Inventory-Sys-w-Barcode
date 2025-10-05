const express = require('express');
const Inventory = require('../models/Inventory');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const bwipjs = require('bwip-js');
const XLSX = require('xlsx');
const moment = require('moment');
const router = express.Router();

// Flash messages middleware
const flashMessages = (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
};

router.use(flashMessages);

// Generate unique barcode
const generateBarcode = async () => {
  let barcode;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 100; // Prevent infinite loop

  while (exists) {
    // Generate a random 12-digit number for Code128 compliance
    barcode = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    
    const existingItem = await Inventory.findOne({ barcode });
    exists = !!existingItem;

    attempts++;
    if (attempts >= maxAttempts) {
      throw new Error('Could not generate a unique barcode after 100 attempts.');
    }
  }
  
  return barcode;
};

// Generate barcode image
const generateBarcodeImage = (barcode) => {
  return new Promise((resolve, reject) => {
    bwipjs.toBuffer({
      bcid: 'code128',
      text: barcode,
      scale: 3,
      height: 10,
      includetext: true,
      textxalign: 'center'
    }, (err, png) => {
      if (err) {
        reject(err);
      } else {
        resolve(png);
      }
    });
  });
};

// All inventory routes require authentication
router.use(requireAuth);

// Inventory list page
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.search) {
      filter.$or = [
        { itemName: { $regex: req.query.search, $options: 'i' } },
        { barcode: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const items = await Inventory.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalItems = await Inventory.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);

    res.render('inventory/list', {
      title: 'Inventory Management',
      items,
      currentPage: page,
      totalPages,
      categories: ['T-Shirt', 'Jacket', 'Cap', 'Trousers','Uniform'],
      filter: req.query,
      user: req.user
    });
  } catch (error) {
    console.error('Inventory list error:', error);
    req.flash('error', 'Error loading inventory');
    res.redirect('/dashboard');
  }
});

// Add new item page
router.get('/add', requireAdmin, (req, res) => {
  res.render('inventory/add', {
    title: 'Add New Item',
    categories: ['T-Shirt', 'Jacket', 'Cap', 'Trousers','Uniform'],
    user: req.user
  });
});

// Add new item post
router.post('/add', requireAdmin, async (req, res) => {
  try {
    const { itemName, category, sizes, quantities, color, price, description } = req.body;
    
    // Parse sizes and quantities arrays
    const sizeArray = Array.isArray(sizes) ? sizes : [sizes];
    const quantityArray = Array.isArray(quantities) ? quantities.map(q => parseInt(q)) : [parseInt(quantities)];
    
    let itemsCreated = 0;
    let itemsUpdated = 0;
    
    // Process each size
    for (let i = 0; i < sizeArray.length; i++) {
      const size = sizeArray[i];
      const qty = quantityArray[i];
      
      // Skip if quantity is 0
      if (qty === 0) continue;
      
      // Check if an identical item already exists
      const existingItem = await Inventory.findOne({ itemName, category, size, color });

      if (existingItem) {
        // If item exists, update its quantity
        existingItem.quantity += qty;
        await existingItem.save();
        itemsUpdated++;
      } else {
        // If item does not exist, create a new one
        const barcode = await generateBarcode();
        const newItem = new Inventory({
          itemName,
          category,
          size,
          color,
          barcode,
          quantity: qty,
          price: parseFloat(price),
          description
        });
        await newItem.save();
        itemsCreated++;
      }
    }

    // Success message
    let message = '';
    if (itemsCreated > 0 && itemsUpdated > 0) {
      message = `Added ${itemsCreated} new size(s) and updated ${itemsUpdated} existing size(s) for ${itemName}`;
    } else if (itemsCreated > 0) {
      message = `Successfully added ${itemsCreated} size(s) for ${itemName}`;
    } else if (itemsUpdated > 0) {
      message = `Updated quantities for ${itemsUpdated} existing size(s) of ${itemName}`;
    } else {
      message = 'No items were added (all quantities were 0)';
    }
    
    req.flash('success', message);
    res.redirect('/inventory');
  } catch (error) {
    console.error('Add item error:', error);
    req.flash('error', 'Error adding item: ' + error.message);
    res.redirect('/inventory/add');
  }
});

// Edit item page
router.get('/edit/:id', requireAdmin, async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Item not found');
      return res.redirect('/inventory');
    }

    res.render('inventory/edit', {
      title: 'Edit Item',
      item,
      categories: ['T-Shirt', 'Jacket', 'Cap', 'Trousers','Uniform'],
      user: req.user
    });
  } catch (error) {
    console.error('Edit item error:', error);
    req.flash('error', 'Error loading item');
    res.redirect('/inventory');
  }
});

// Edit item post
router.post('/edit/:id', requireAdmin, async (req, res) => {
  try {
    const { itemName, category, size, color, quantity, price, description } = req.body;
    
    await Inventory.findByIdAndUpdate(req.params.id, {
      itemName,
      category,
      size,
      color,
      quantity: parseInt(quantity),
      price: parseFloat(price),
      description
    });

    req.flash('success', 'Item updated successfully');
    res.redirect('/inventory');
  } catch (error) {
    console.error('Update item error:', error);
    req.flash('error', 'Error updating item');
    res.redirect(`/inventory/edit/${req.params.id}`);
  }
});

// Delete item
router.post('/delete/:id', requireAdmin, async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    req.flash('success', 'Item deleted successfully');
    res.redirect('/inventory');
  } catch (error) {
    console.error('Delete item error:', error);
    req.flash('error', 'Error deleting item');
    res.redirect('/inventory');
  }
});

// Generate barcode image
router.get('/barcode/:barcode', async (req, res) => {
  try {
    const barcode = req.params.barcode;
    const png = await generateBarcodeImage(barcode);
    
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': png.length
    });
    res.send(png);
  } catch (error) {
    console.error('Barcode generation error:', error);
    res.status(500).send('Error generating barcode');
  }
});

// Get item by barcode (API endpoint)
router.get('/api/barcode/:barcode', async (req, res) => {
  try {
    const item = await Inventory.findOne({ barcode: req.params.barcode });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    res.json({
      success: true,
      item: {
        id: item._id,
        itemName: item.itemName,
        category: item.category,
        size: item.size,
        color: item.color,
        barcode: item.barcode,
        quantity: item.quantity,
        price: item.price,
        description: item.description
      }
    });
  } catch (error) {
    console.error('API barcode error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update stock quantity
router.post('/update-stock/:id', requireAdmin, async (req, res) => {
  try {
    const { quantity } = req.body;
    await Inventory.findByIdAndUpdate(req.params.id, { quantity: parseInt(quantity) });
    
    req.flash('success', 'Stock updated successfully');
    res.redirect('/inventory');
  } catch (error) {
    console.error('Update stock error:', error);
    req.flash('error', 'Error updating stock');
    res.redirect('/inventory');
  }
});

// Export all inventory items to Excel
router.get('/export-all', requireAuth, async (req, res) => {
  try {
    const { category, search } = req.query;
    
    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { itemName: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } }
      ];
    }

    // Get all inventory items
    const items = await Inventory.find(filter).sort({ category: 1, itemName: 1 });

    if (items.length === 0) {
      req.flash('error', 'No inventory items found to export');
      return res.redirect('/inventory');
    }

    // Prepare data for Excel
    const excelData = items.map(item => ({
      'Item Name': item.itemName,
      'Category': item.category,
      'Size': item.size,
      'Color': item.color,
      'Barcode': item.barcode,
      'Current Stock': item.quantity,
      'Unit Price': item.price,
      'Total Value': item.quantity * item.price,
      'Description': item.description || '',
      'Status': item.quantity <= 10 ? 'Low Stock' : item.quantity === 0 ? 'Out of Stock' : 'In Stock',
      'Date Added': moment(item.createdAt).format('YYYY-MM-DD HH:mm:ss'),
      'Last Updated': moment(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')
    }));

    // Calculate summary statistics
    const totalItems = items.length;
    const totalStock = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const lowStockItems = items.filter(item => item.quantity <= 10 && item.quantity > 0).length;
    const outOfStockItems = items.filter(item => item.quantity === 0).length;

    // Add summary row
    excelData.push({});
    excelData.push({
      'Item Name': 'SUMMARY',
      'Category': '',
      'Size': '',
      'Color': '',
      'Barcode': '',
      'Current Stock': totalStock,
      'Unit Price': '',
      'Total Value': totalValue,
      'Description': `Total Items: ${totalItems} | Low Stock: ${lowStockItems} | Out of Stock: ${outOfStockItems}`,
      'Status': '',
      'Date Added': '',
      'Last Updated': ''
    });

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 25 }, // Item Name
      { wch: 12 }, // Category
      { wch: 10 }, // Size
      { wch: 15 }, // Color
      { wch: 18 }, // Barcode
      { wch: 15 }, // Current Stock
      { wch: 12 }, // Unit Price
      { wch: 15 }, // Total Value
      { wch: 35 }, // Description
      { wch: 12 }, // Status
      { wch: 20 }, // Date Added
      { wch: 20 }  // Last Updated
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory List');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers
    const filename = `inventory-list-${moment().format('YYYY-MM-DD-HHmmss')}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(buffer);
  } catch (error) {
    console.error('Export all inventory error:', error);
    req.flash('error', 'Error exporting inventory list');
    res.redirect('/inventory');
  }
});

module.exports = router;
