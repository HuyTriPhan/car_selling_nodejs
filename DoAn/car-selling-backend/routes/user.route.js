const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const upload = require('../config/multer.config');
const { authenticate } = require('../middlewares/auth.middleware');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.get('/profile', authenticate, userController.getProfile);
router.put('/profile', authenticate, upload.single('image'), userController.updateProfile);
router.put('/password', authenticate, userController.changePassword);

router.delete('/:id', userController.deleteUser); // hoặc dùng authenticate + isAdmin nếu cần
router.get('/', userController.getAllUsers);
router.put('/lock/:id', userController.lockUser);


module.exports = router;
