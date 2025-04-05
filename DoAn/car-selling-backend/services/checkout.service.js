const Order = require('../models/order.model');
const Payment = require('../models/payment.model');

const createPayment = (data) => Payment.create(data);
const createOrder = (data) => Order.create(data);
const getOrdersByUser = (userId) => Order.find({ user: userId }).populate('car payment');
const getAllOrders = () => Order.find().populate('car user payment');

module.exports = { createPayment, createOrder, getOrdersByUser, getAllOrders };
