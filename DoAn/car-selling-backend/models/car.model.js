const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  modelLine: { type: mongoose.Schema.Types.ObjectId, ref: 'ModelLine', required: true },
  price: { type: Number, required: true },
  year: { type: Number },
  origin: { type: String },
  seatCount: { type: Number },
  image: { type: String },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Car', CarSchema);