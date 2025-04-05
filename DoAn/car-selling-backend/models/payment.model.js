const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  method: { 
    type: String, 
    enum: [
      'cash', 
      'momo',  
      'visa', 
      'mastercard', 
      'jcb', 
      'vnpay', 
      'zalopay'
    ], 
    required: true 
  },
  status: { type: String, enum: ['unpaid', 'paid'], default: 'unpaid' },
  paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
