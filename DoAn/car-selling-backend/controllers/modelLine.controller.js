// controllers/modelLine.controller.js
const ModelLine = require('../models/modelLine.model');

const getAll = async (req, res) => {
  const lines = await ModelLine.getAll();
  res.json(lines);
};

const getById = async (req, res) => {
  const line = await ModelLine.getById(req.params.id);
  if (!line) return res.status(404).json({ message: 'Không tìm thấy dòng xe' });
  res.json(line);
};

const add = async (req, res) => {
  try {
    const saved = await ModelLine.add(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const updated = await ModelLine.updateById(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy dòng xe' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  const deleted = await ModelLine.removeById(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy dòng xe' });
  res.json({ message: 'Xoá thành công' });
};

module.exports = { getAll, getById, add, update, remove };
