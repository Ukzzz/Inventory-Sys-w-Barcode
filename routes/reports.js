const express = require('express');
const Delivery = require('../models/Delivery');
const Inventory = require('../models/Inventory');
const { requireAuth, requireStaff } = require('../middleware/auth');
const XLSX = require('xlsx');
const puppeteer = require('puppeteer');
const moment = require('moment');
const router = express.Router();

// Flash messages middleware
const flashMessages = (req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
};

router.use(flashMessages);

// All report routes require authentication
router.use(requireAuth);

// Reports page
router.get('/', requireStaff, (req, res) => {
  res.render('reports/index', {
    title: 'Generate Reports',
    user: req.user || { username: req.session.username, role: req.session.userRole }
  });
});

// Generate delivery report (Excel)
router.get('/delivery/excel', requireStaff, async (req, res) => {
  try {
    const { startDate, endDate, customerName } = req.query;
    
    // Build filter
    const filter = {};
    if (startDate && endDate) {
      filter.deliveryDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }
    if (customerName) {
      filter.customerName = { $regex: customerName, $options: 'i' };
    }

    // Get deliveries with populated data
    const deliveries = await Delivery.find(filter)
      .populate('inventoryItem', 'itemName category size color price')
      .populate('deliveredBy', 'username')
      .sort({ deliveryDate: -1 });

    // Filter out deliveries with missing references
    const validDeliveries = deliveries.filter(d => d.inventoryItem && d.deliveredBy);

    if (validDeliveries.length === 0) {
      req.flash('error', 'No delivery records found for the selected criteria');
      return res.redirect('/reports');
    }

    // Prepare data for Excel
    const excelData = validDeliveries.map(delivery => ({
      'Delivery Date': moment(delivery.deliveryDate).format('YYYY-MM-DD'),
      'Customer Name': delivery.customerName,
      'Item Name': delivery.inventoryItem.itemName,
      'Category': delivery.inventoryItem.category,
      'Size': delivery.inventoryItem.size,
      'Color': delivery.inventoryItem.color,
      'Barcode': delivery.barcode,
      'Quantity Delivered': delivery.quantityDelivered,
      'Unit Price': delivery.inventoryItem.price,
      'Total Amount': delivery.quantityDelivered * delivery.inventoryItem.price,
      'Delivered By': delivery.deliveredBy.username,
      'Notes': delivery.notes || ''
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Delivery Date
      { wch: 20 }, // Customer Name
      { wch: 25 }, // Item Name
      { wch: 12 }, // Category
      { wch: 10 }, // Size
      { wch: 15 }, // Color
      { wch: 18 }, // Barcode
      { wch: 18 }, // Quantity Delivered
      { wch: 12 }, // Unit Price
      { wch: 15 }, // Total Amount
      { wch: 15 }, // Delivered By
      { wch: 30 }  // Notes
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Delivery Report');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers
    const filename = `delivery-report-${moment().format('YYYY-MM-DD')}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(buffer);
  } catch (error) {
    console.error('Excel report error:', error);
    req.flash('error', 'Error generating Excel report');
    res.redirect('/reports');
  }
});

// Generate inventory report (Excel)
router.get('/inventory/excel', requireStaff, async (req, res) => {
  try {
    const { category, lowStock } = req.query;
    
    // Build filter
    const filter = {};
    if (category) filter.category = category;
    if (lowStock === 'true') filter.quantity = { $lte: 10 };

    // Get inventory items
    const items = await Inventory.find(filter).sort({ category: 1, itemName: 1 });

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
      'Status': item.quantity <= 10 ? 'Low Stock' : item.quantity === 0 ? 'Out of Stock' : 'In Stock'
    }));

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
      { wch: 30 }, // Description
      { wch: 12 }  // Status
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory Report');

    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    // Set response headers
    const filename = `inventory-report-${moment().format('YYYY-MM-DD')}.xlsx`;
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(buffer);
  } catch (error) {
    console.error('Inventory Excel report error:', error);
    req.flash('error', 'Error generating inventory Excel report');
    res.redirect('/reports');
  }
});

// Generate delivery report (PDF)
router.get('/delivery/pdf', requireStaff, async (req, res) => {
  try {
    const { startDate, endDate, customerName } = req.query;
    
    // Build filter
    const filter = {};
    if (startDate && endDate) {
      filter.deliveryDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + 'T23:59:59.999Z')
      };
    }
    if (customerName) {
      filter.customerName = { $regex: customerName, $options: 'i' };
    }

    // Get deliveries with populated data
    const deliveries = await Delivery.find(filter)
      .populate('inventoryItem', 'itemName category size color price')
      .populate('deliveredBy', 'username')
      .sort({ deliveryDate: -1 });

    // Filter out deliveries with missing references
    const validDeliveries = deliveries.filter(d => d.inventoryItem && d.deliveredBy);

    if (validDeliveries.length === 0) {
      req.flash('error', 'No delivery records found for the selected criteria');
      return res.redirect('/reports');
    }

    // Generate HTML for PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Delivery Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #333; margin-bottom: 10px; }
          .header p { color: #666; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; font-weight: bold; }
          .total { font-weight: bold; background-color: #f9f9f9; }
          .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Delivery Report</h1>
          <p>Generated on: ${moment().format('YYYY-MM-DD HH:mm:ss')}</p>
          ${startDate && endDate ? `<p>Period: ${moment(startDate).format('YYYY-MM-DD')} to ${moment(endDate).format('YYYY-MM-DD')}</p>` : ''}
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Category</th>
              <th>Size</th>
              <th>Color</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
              <th>Delivered By</th>
            </tr>
          </thead>
          <tbody>
            ${validDeliveries.map(delivery => `
              <tr>
                <td>${moment(delivery.deliveryDate).format('YYYY-MM-DD')}</td>
                <td>${delivery.customerName}</td>
                <td>${delivery.inventoryItem.itemName}</td>
                <td>${delivery.inventoryItem.category}</td>
                <td>${delivery.inventoryItem.size}</td>
                <td>${delivery.inventoryItem.color}</td>
                <td>${delivery.quantityDelivered}</td>
                <td>Rs ${delivery.inventoryItem.price}</td>
                <td>Rs ${(delivery.quantityDelivered * delivery.inventoryItem.price).toFixed(2)}</td>
                <td>${delivery.deliveredBy.username}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total">
              <td colspan="8">Total Deliveries: ${validDeliveries.length}</td>
              <td>Rs ${validDeliveries.reduce((sum, d) => sum + (d.quantityDelivered * d.inventoryItem.price), 0).toFixed(2)}</td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        
        <div class="footer">
          <p>Uniform Inventory & Delivery System</p>
        </div>
      </body>
      </html>
    `;

    // Generate PDF using Puppeteer
    let browser;
    try {
      browser = await puppeteer.launch({ 
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'] // For server environments
      });
      const page = await browser.newPage();
      await page.setContent(html);
      
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          right: '20mm',
          bottom: '20mm',
          left: '20mm'
        }
      });
      
      await browser.close();

      // Set response headers
      const filename = `delivery-report-${moment().format('YYYY-MM-DD')}.pdf`;
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      
      res.send(pdfBuffer);
    } catch (puppeteerError) {
      console.error('Puppeteer error:', puppeteerError);
      if (browser) {
        await browser.close().catch(() => {});
      }
      throw new Error('PDF generation failed: ' + puppeteerError.message);
    }
  } catch (error) {
    console.error('PDF report error:', error);
    req.flash('error', 'Error generating PDF report');
    res.redirect('/reports');
  }
});

module.exports = router;
