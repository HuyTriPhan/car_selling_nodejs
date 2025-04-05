const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('../config/multer.config');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', userController.register);

router.post('/login', userController.login);

router.put('/profile', authenticate, upload.single('image'), userController.updateProfile);

router.get('/', async (req, res) => {
    try {
      const users = await require('../models/user.model').find();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.put('/lock/:id', async (req, res) => {
    try {
      const { lock } = req.body; // true = khóa, false = mở khóa
      const User = require('../models/user.model');
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { locked: lock },
        { new: true }
      );
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

module.exports = router;
