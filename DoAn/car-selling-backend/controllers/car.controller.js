const mongoose = require('mongoose');
const Car = require('../models/car.model');
const Order = require('../models/order.model');

const getAll = async (req, res) => {
  try {
    const { name, modelLine, seats, priceRange } = req.query;
    let query = {};

    if (name) query.name = { $regex: name, $options: 'i' };
    if (modelLine) query.modelLine = { $regex: modelLine, $options: 'i' };
    if (seats) query.seatCount = { $gte: +seats };
    if (priceRange) query.price = { $lte: +priceRange };

    const cars = await Car.getAll(query);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm xe' });
  }
};

const getById = async (req, res) => {
  const car = await Car.getById(req.params.id);
  if (!car) return res.status(404).json({ message: 'Xe không tồn tại' });
  res.json(car);
};

const add = async (req, res) => {
  try {
    const data = req.body;
    if (data.modelLine) {
      data.modelLine = new mongoose.Types.ObjectId(data.modelLine);
    }
    if (req.file) {
      data.image = req.file.filename;
    }
    if (data.stock !== undefined) {
      data.stock = parseInt(data.stock, 10);
    }
    const newCar = await Car.add(data);
    res.status(201).json(newCar);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      data.image = req.file.filename;
    }
    if (data.stock !== undefined) {
      data.stock = parseInt(data.stock, 10);
    }
    const updated = await Car.updateById(req.params.id, data);
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy xe' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  const deleted = await Car.deleteById(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy xe' });
  res.json({ message: 'Xoá thành công' });
};

const getByIdPublic = async (req, res) => {
  try {
    const car = await Car.getByIdPublic(req.params.id);
    if (!car) return res.status(404).json({ error: 'Không tìm thấy xe' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

const safeDecreaseStock = async (carId, amount = 1) => {
  const car = await Car.getById(carId);
  if (!car) throw new Error('Xe không tồn tại');

  const hasCancelledOrder = await Order.exists({ car: carId, status: 'cancelled' });
  if (hasCancelledOrder) {
    return car; 
  }

  if (car.stock <= 0) {
    return car; 
  }

  car.stock = Math.max(0, car.stock - amount);
  return car.save();
};

module.exports = { getAll, getById, add, update, remove, getByIdPublic, safeDecreaseStock };
