const express = require('express');
const router = express.Router();
const controller = require('../controllers/modelLine.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', authenticate, authorize('admin'), controller.add);
router.put('/:id', authenticate, authorize('admin'), controller.update);
router.delete('/:id', authenticate, authorize('admin'), controller.remove);

module.exports = router;