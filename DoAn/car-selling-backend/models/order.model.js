const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  customerEmail: String,
  totalAmount: Number,
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
