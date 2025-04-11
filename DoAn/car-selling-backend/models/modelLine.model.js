// models/modelLine.model.js
const mongoose = require('mongoose');

const ModelLineSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
}, { timestamps: true });

// ✅ CRUD methods
ModelLineSchema.statics.getAll = function () {
  return this.find().sort({ createdAt: -1 });
};

ModelLineSchema.statics.getById = function (id) {
  return this.findById(id);
};

ModelLineSchema.statics.add = function (data) {
  const line = new this(data);
  return line.save();
};

ModelLineSchema.statics.updateById = function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

ModelLineSchema.statics.removeById = function (id) {
  return this.findByIdAndDelete(id);
};

module.exports = mongoose.model('ModelLine', ModelLineSchema);
