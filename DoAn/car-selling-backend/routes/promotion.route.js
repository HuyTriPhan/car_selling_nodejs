const express = require('express');
const router = express.Router();
const controller = require('../controllers/promotion.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', controller.getAllPromotions);
router.get('/:id', controller.getPromotionById);
router.get('/code/:code', controller.getByCode);

router.post('/', authenticate, authorize('admin'), controller.createPromotion);
router.put('/:id', authenticate, authorize('admin'), controller.updatePromotion);
router.delete('/:id', authenticate, authorize('admin'), controller.deletePromotion);

router.put('/:id/mark-used', authenticate, controller.markPromotionUsed);

module.exports = router;
