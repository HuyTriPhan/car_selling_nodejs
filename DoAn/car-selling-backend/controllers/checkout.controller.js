const Order = require('../models/order.model');
const Payment = require('../models/payment.model');

const createOrder = async (req, res) => {
  try {
    const { carId, name, phone, address, method, note } = req.body;

    const payment = await Payment.create({ method, note });

    const order = await Order.create({
      car: carId,
      user: req.user.userId,
      name,
      phone,
      address,
      payment: payment._id,
      total: 0, // bạn có thể tính giá xe ở đây nếu muốn
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo đơn hàng', error: err.message });
  }
};

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('car')
      .populate('payment');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi lấy đơn hàng', error: err.message });
  }
};

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('car')
      .populate('user', 'name email')
      .populate('payment');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi admin xem đơn hàng', error: err.message });
  }
};

module.exports = { createOrder, getUserOrders, getAllOrdersAdmin };
