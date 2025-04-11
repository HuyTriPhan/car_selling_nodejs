// models/order.model.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  car: { type: mongoose.Schema.Types.ObjectId, ref: 'Car', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: String,
  customerPhone: String,
  customerAddress: String,
  customerEmail: String,
  totalAmount: Number,
  promotionCode: String,
  discountAmount: Number,
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
  method: { type: String, enum: ['vnpay', 'momo', 'visa', 'zalopay', 'jcb', 'mastercard'], required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
}, { timestamps: true });

OrderSchema.statics = {
  createOrder(data) {
    return this.create(data);
  },
  getAllOrders() {
    return this.find().populate('car user payment');
  },
  getById(id) {
    return this.findById(id)
      .populate({ path: 'car', populate: { path: 'modelLine' } })
      .populate('user payment');
  },
  updateById(id, data) {
    return this.findByIdAndUpdate(id, data, { new: true });
  },
  deleteById(id) {
    return this.findByIdAndDelete(id);
  }
};

module.exports = mongoose.model('Order', OrderSchema);
