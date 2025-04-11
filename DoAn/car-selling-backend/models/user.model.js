// models/user.model.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  locked: { type: Boolean, default: false },
  image: String,
  phone: String,
  address: String,
  date: Date
});

UserSchema.statics.createUser = function (data) {
  return this.create(data);
};

UserSchema.statics.getUserByEmail = function (email) {
  return this.findOne({ email });
};

UserSchema.statics.getUserById = function (id) {
  return this.findById(id);
};

UserSchema.statics.updateUser = function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

UserSchema.statics.deleteUser = function (id) {
  return this.findByIdAndDelete(id);
};

UserSchema.statics.getAllUsers = function () {
  return this.find();
};

module.exports = mongoose.model('User', UserSchema);
