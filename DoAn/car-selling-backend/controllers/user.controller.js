const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.createUser({ name, email, password: hashedPassword });
    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user });
  } catch (err) {
    res.status(400).json({ message: err.code === 11000 ? 'Email đã tồn tại!' : err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.getUserByEmail(email);
    if (!user) throw new Error('Email không tồn tại');
    if (user.locked) return res.status(403).json({ message: 'Tài khoản đã bị khóa' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mật khẩu không đúng');

    const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.getUserById(req.user.userId);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) data.image = req.file.filename;
    const updated = await User.updateUser(req.user.userId, data);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.getUserById(req.user.userId);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await User.deleteUser(req.params.id);
    res.json({ message: 'Xoá user thành công' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const lockUser = async (req, res) => {
  try {
    const { lock } = req.body;
    const updatedUser = await User.updateUser(req.params.id, { locked: lock });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  deleteUser,
  getAllUsers,
  lockUser
};
