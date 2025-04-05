const express = require('express');
const router = express.Router();
const carController = require('../controllers/car.controller');

// Endpoint dành cho user xem danh sách xe (không cần xác thực)
router.get('/carlist', carController.getAll);

// Endpoint dành cho user xem chi tiết xe (không cần xác thực)
router.get('/detailcar/:id', carController.getByIdPublic);

module.exports = router;
