const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  category: {
    type: String,
    default: 'General'
  },
  expiryDate: {
    type: Date
  },
  statusbar: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
