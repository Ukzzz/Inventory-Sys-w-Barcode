const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  inventoryItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  barcode: {
    type: String,
    required: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  quantityDelivered: {
    type: Number,
    required: true,
    min: 1
  },
  deliveryDate: {
    type: Date,
    default: Date.now
  },
  deliveredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
deliverySchema.index({ deliveryDate: -1 });
deliverySchema.index({ customerName: 1 });
deliverySchema.index({ barcode: 1 });

module.exports = mongoose.model('Delivery', deliverySchema);
