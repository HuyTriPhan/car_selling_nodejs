const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  vnp_TxnRef: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  paidAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

paymentSchema.statics = {
  createPayment: function (data) {
    return this.create(data);
  },
  updatePaymentByTxnRef: function (vnp_TxnRef, data) {
    return this.findOneAndUpdate({ vnp_TxnRef }, data, { new: true });
  },
  getPaymentByTxnRef: function (vnp_TxnRef) {
    return this.findOne({ vnp_TxnRef });
  }
};

module.exports = mongoose.model('Payment', paymentSchema);
