const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middlewares/auth.middleware');

router.get('/dashboard', authenticate, authorize('admin'), (req, res) => {
  res.json({ message: 'Welcome to admin dashboard!' });
});

module.exports = router;
