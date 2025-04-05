const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  // Không cho phép client gửi role → tự đặt là 'user'
  const user = new User({ 
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: 'user' // ✅ Luôn là user khi đăng ký
  });

  return await user.save();
};


const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Email không tồn tại');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Mật khẩu không đúng');

  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );  

  return { token, user };
};

module.exports = {
  registerUser,
  loginUser
};
