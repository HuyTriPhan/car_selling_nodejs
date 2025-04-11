const Order = require('../models/order.model');
const Payment = require('../models/payment.model');
const uuid = require('uuid');
const Car = require('../models/car.model'); 
const { safeDecreaseStock } = require('./car.controller');

// Tạo đơn hàng + tạo payment + cập nhật lại order
const createOrder = async (req, res) => {
  try {
    const data = {
      ...req.body,
      user: req.user.userId,
      totalAmount: req.body.totalAmount
    };

    const order = await Order.createOrder(data);

    await safeDecreaseStock(order.car);
    
    const payment = await Payment.create({
      userId: req.user.userId,
      orderId: order._id,
      amount: data.totalAmount,
      vnp_TxnRef: uuid.v4().replace(/-/g, '').substring(0, 8),
      status: 'pending',
    });

    order.payment = payment._id;
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAll = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const order = await Order.getById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await Order.updateById(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  try {
    await Order.deleteById(req.params.id);
    res.json({ message: 'Đã xoá đơn hàng' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.find({ user: userId })
      .populate({ path: 'car', populate: { path: 'modelLine' } })
      .populate('payment');
      
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { createOrder, getAll, getById, update, remove, getMyOrders };
