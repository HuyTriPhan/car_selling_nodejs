const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.post('/', authenticate, controller.createOrder);
router.get('/', authenticate, authorize('admin'), controller.getAll);
router.get('/:id', authenticate, controller.getById);
router.put('/:id', authenticate, controller.update);
router.delete('/:id', authenticate, authorize('admin'), controller.remove);

module.exports = router;
