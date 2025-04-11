// controllers/vnpay.controller.js
const crypto = require('crypto');
const moment = require('moment');
const uuid = require('uuid');
const Payment = require('../models/payment.model');
const config = require('../config/vnpay');

const sortObject = (obj) => {
  const sorted = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = obj[key];
  });
  return sorted;
};

exports.createPayment = async (req, res) => {
  try {
    const { orderId, amount } = req.body;
    const userId = req.user.userId;

    if (!orderId || !amount) {
      return res.status(400).json({ message: 'Thiếu orderId hoặc amount' });
    }

    let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    if (ipAddr === '::1') ipAddr = '127.0.0.1';

    const vnp_TxnRef = uuid.v4().replace(/-/g, '').substring(0, 8);
    const createDate = moment().format('YYYYMMDDHHmmss');
    const expireDate = moment().add(15, 'minutes').format('YYYYMMDDHHmmss');

    let vnp_Params = {
      vnp_Version: config.vnp_Version,
      vnp_Command: config.vnp_Command,
      vnp_TmnCode: config.vnp_TmnCode,
      vnp_Amount: amount.toString(),
      vnp_CurrCode: 'VND',
      vnp_BankCode: 'NCB',
      vnp_TxnRef,
      vnp_OrderInfo: `Thanh toan don hang ${vnp_TxnRef}`,
      vnp_OrderType: config.orderType,
      vnp_Locale: 'vn',
      vnp_ReturnUrl: config.vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
      vnp_ExpireDate: expireDate,
    };

    vnp_Params = sortObject(vnp_Params);
    const signData = new URLSearchParams(vnp_Params).toString();
    const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;

    const paymentUrl = `${config.vnp_Url}?${new URLSearchParams(vnp_Params).toString()}`;

    // ✅ Dùng hàm CRUD trong model
    await Payment.createPayment({
      userId,
      orderId,
      amount,
      vnp_TxnRef
    });

    res.json({
      status: 'Ok',
      paymentUrl,
      message: 'Tạo thanh toán thành công'
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi tạo thanh toán', error: err.message });
  }
};

exports.vnpayReturn = async (req, res) => {
  const vnp_Params = req.query;
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const sortedParams = sortObject(vnp_Params);
  const signData = new URLSearchParams(sortedParams).toString();
  const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  if (secureHash !== signed) {
    return res.status(400).send('<h2>❌ Chữ ký không hợp lệ</h2>');
  }

  const paymentStatus = vnp_Params['vnp_ResponseCode'] === '00' ? 'paid' : 'failed';
  const vnp_TxnRef = vnp_Params['vnp_TxnRef'];

  try {
    // ✅ Nếu thất bại, cập nhật cả payment và order → rồi redirect về trang chủ
    if (paymentStatus === 'failed') {
      const failedPayment = await Payment.findOne({ vnp_TxnRef });
      if (failedPayment && failedPayment.orderId) {
        const Order = require('../models/order.model');
        await Order.updateById(failedPayment.orderId, { status: 'cancelled' });
      }

      return res.redirect(`http://localhost:4200/`);
    }

    // ✅ Nếu thành công, cập nhật payment và redirect về invoice
    const payment = await Payment.updatePaymentByTxnRef(vnp_TxnRef, {
      status: 'paid',
      paidAt: new Date(),
    });

    if (!payment || !payment.orderId) {
      return res.status(404).send('<h2>❌ Không tìm thấy giao dịch</h2>');
    }

    return res.redirect(`http://localhost:4200/invoice?orderId=${payment.orderId}`);
  } catch (error) {
    console.error('🔥 Lỗi xử lý vnpay_return:', error);
    return res.status(500).send('<h2>❌ Lỗi máy chủ</h2>');
  }
};

