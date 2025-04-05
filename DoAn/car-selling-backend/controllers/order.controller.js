const orderService = require('../services/order.service');
const paymentService = require('../services/payment.service');

const createOrder = async (req, res) => {
  try {
    const payment = await paymentService.createPayment({
      method: req.body.method,
      status: 'unpaid'
    });

    const order = await orderService.createOrder({
      ...req.body,
      user: req.user.userId,
      payment: payment._id
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const getAll = async (req, res) => {
  const orders = await orderService.getAllOrders();
  res.json(orders);
};

const getById = async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
  res.json(order);
};

const update = async (req, res) => {
  const updated = await orderService.updateOrder(req.params.id, req.body);
  res.json(updated);
};

const remove = async (req, res) => {
  await orderService.deleteOrder(req.params.id);
  res.json({ message: 'Đã xoá đơn hàng' });
};

module.exports = { createOrder, getAll, getById, update, remove };
