const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth.middleware');
const vnpayController = require('../controllers/vnpay.controller');

router.post('/create_payment', authenticate, vnpayController.createPayment);
router.get('/vnpay_return', vnpayController.vnpayReturn);

module.exports = router;
