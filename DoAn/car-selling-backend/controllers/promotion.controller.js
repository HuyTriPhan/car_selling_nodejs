const Promotion = require('../models/promotion.model');

const generateUniquePromoCode = async () => {
  let code, exists;
  do {
    code = 'PROMO-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    exists = await Promotion.getByCode(code);
  } while (exists);
  return code;
};

const getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.getAll();
    const now = new Date();
    for (const promo of promotions) {
      if (promo.expiredAt && promo.expiredAt < now && promo.active) {
        promo.active = false;
        await promo.save();
      }
    }
    res.json(promotions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getPromotionById = async (req, res) => {
  const promo = await Promotion.getById(req.params.id);
  if (!promo) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
  res.json(promo);
};

const getByCode = async (req, res) => {
  const promo = await Promotion.getByCode(req.params.code);
  if (!promo) return res.status(404).json({ message: 'Không tìm thấy mã khuyến mãi' });
  res.json(promo);
};

const createPromotion = async (req, res) => {
  try {
    const code = await generateUniquePromoCode();
    const created = await Promotion.createPromo({
      ...req.body,
      code,
      active: true,
      used: false
    });
    res.status(201).json(created);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const updatePromotion = async (req, res) => {
  try {
    const updated = await Promotion.updatePromo(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const deletePromotion = async (req, res) => {
  await Promotion.deletePromo(req.params.id);
  res.json({ message: 'Đã xoá khuyến mãi' });
};

const markPromotionUsed = async (req, res) => {
  const promo = await Promotion.markUsed(req.params.id);
  if (!promo) return res.status(404).json({ message: 'Không tìm thấy khuyến mãi' });
  res.json({ message: 'Mã đã được đánh dấu đã sử dụng' });
};

module.exports = {
  getAllPromotions,
  getPromotionById,
  createPromotion,
  updatePromotion,
  deletePromotion,
  markPromotionUsed,
  getByCode
};
