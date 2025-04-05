const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  locked: { type: Boolean, default: false },
  image: { type: String },
  phone: { type: String },
  address: { type: String },
  date: { type: Date }  
});

module.exports = mongoose.model('User', UserSchema);
