const ModelLine = require('../models/modelLine.model');

const getAll = async (req, res) => {
  const lines = await ModelLine.find().sort({ createdAt: -1 });
  res.json(lines);
};

const getById = async (req, res) => {
  const line = await ModelLine.findById(req.params.id);
  if (!line) return res.status(404).json({ message: 'Không tìm thấy dòng xe' });
  res.json(line);
};

const add = async (req, res) => {
  try {
    const newLine = new ModelLine(req.body);
    const saved = await newLine.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await ModelLine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy dòng xe' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  const deleted = await ModelLine.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy dòng xe' });
  res.json({ message: 'Xoá thành công' });
};

module.exports = { getAll, getById, add, update, remove };