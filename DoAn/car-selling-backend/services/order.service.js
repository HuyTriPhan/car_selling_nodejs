const Order = require('../models/order.model');

const createOrder = (data) => new Order(data).save();
const getAllOrders = () => Order.find().populate('car user payment');

const getOrderById = (id) => 
    Order.findById(id).populate('car user payment');  
const updateOrder = (id, data) => Order.findByIdAndUpdate(id, data, { new: true });
const deleteOrder = (id) => Order.findByIdAndDelete(id);

module.exports = { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder };
