const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');
const upload = require('../config/multer.config');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/', carController.getAll);
router.get('/:id', carController.getById);
router.post('/', authenticate, authorize('admin'), upload.single('image'), carController.add);
router.put('/:id', authenticate, authorize('admin'), upload.single('image'), carController.update);
router.delete('/:id', authenticate, authorize('admin'), carController.remove);

module.exports = router;