const userService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

// Giữ nguyên hàm register, chỉ thêm field locked: false (nếu muốn mặc định)
const register = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token, user });
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ message: 'Email đã tồn tại!' });
    } else {
      res.status(400).json({ message: err.message });
    }
  }
};

// ✅ Sửa login: Thêm kiểm tra user.locked
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);

    // THÊM ĐOẠN KIỂM TRA
    if (result.user && result.user.locked) {
      return res.status(403).json({ message: 'Tài khoản đã bị khóa' });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = req.body;

    if (req.file) {
      data.image = req.file.filename;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login, updateProfile };
