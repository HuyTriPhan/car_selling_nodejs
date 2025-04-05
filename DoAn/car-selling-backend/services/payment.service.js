const Payment = require('../models/payment.model');

const createPayment = (data) => new Payment(data).save();
const getPaymentById = (id) => Payment.findById(id);
const updatePayment = (id, data) => Payment.findByIdAndUpdate(id, data, { new: true });

module.exports = { createPayment, getPaymentById, updatePayment };
