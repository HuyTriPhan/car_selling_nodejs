// ✅ car.model.js (Model + CRUD functions)
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modelLine: { type: mongoose.Schema.Types.ObjectId, ref: 'ModelLine', required: true },
  price: { type: Number, required: true },
  year: Number,
  origin: String,
  seatCount: Number,
  image: String,
  description: String,
  stock: {
    type: Number,
    default: 1, // mỗi xe mặc định có 1
    min: 0
  }
}, { timestamps: true });

CarSchema.statics.getAll = function (query = {}) {
  return this.find(query).populate('modelLine').sort({ createdAt: -1 });
};

CarSchema.statics.getById = function (id) {
  return this.findById(id);
};

CarSchema.statics.getByIdPublic = function (id) {
  return this.findById(id).populate('modelLine');
};

CarSchema.statics.add = function (data) {
  return this.create(data);
};

CarSchema.statics.updateById = function (id, data) {
  return this.findByIdAndUpdate(id, data, { new: true });
};

CarSchema.statics.deleteById = function (id) {
  return this.findByIdAndDelete(id);
};
CarSchema.statics.decreaseStock = async function (carId) {
  return this.findByIdAndUpdate(carId, { $inc: { stock: -1 } });
};


module.exports = mongoose.model('Car', CarSchema);
