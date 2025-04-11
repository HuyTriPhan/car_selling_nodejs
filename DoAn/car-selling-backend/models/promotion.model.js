const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  name: String,
  code: { type: String, unique: true },
  discount: Number,
  description: String,
  expiredAt: Date,
  active: { type: Boolean, default: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

promotionSchema.statics = {
  getAll: function () {
    return this.find();
  },
  getById: function (id) {
    return this.findById(id);
  },
  getByCode: function (code) {
    return this.findOne({ code });
  },
  createPromo: function (data) {
    return this.create(data);
  },
  updatePromo: function (id, data) {
    return this.findByIdAndUpdate(id, data, { new: true });
  },
  deletePromo: function (id) {
    return this.findByIdAndDelete(id);
  },
  markUsed: async function (id) {
    const promo = await this.findById(id);
    if (!promo) return null;
    promo.active = false;
    promo.used = true;
    return promo.save();
  }
};

module.exports = mongoose.model('Promotion', promotionSchema);
