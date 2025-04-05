const mongoose = require('mongoose');
const carService = require('../services/car.service');

const getAll = async (req, res) => {
  try {
    const { name, modelLine, seats, priceRange } = req.query;
    let query = {};

    if (name) {
      query.name = { $regex: name, $options: 'i' }; 
    }

    if (modelLine) {
      query.modelLine = { $regex: modelLine, $options: 'i' }; 
    }

    if (seats) {
      query.seatCount = { $gte: +seats }; 
    }

    if (priceRange) {
      query.price = { $lte: +priceRange }; 
    }

    const cars = await carService.getAllCars(query);

    console.log('Cars with filters:', cars);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi tìm kiếm xe' });
  }
};



const getById = async (req, res) => {
  const car = await carService.getCarById(req.params.id);
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
    const newCar = await carService.addCar(data);
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
    const updated = await carService.updateCar(req.params.id, data);
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy xe' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = async (req, res) => {
  const deleted = await carService.deleteCar(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Không tìm thấy xe' });
  res.json({ message: 'Xoá thành công' });
};

const getByIdPublic = async (req, res) => {
  try {
    const car = await carService.getCarByIdPublic(req.params.id);
    if (!car) return res.status(404).json({ error: 'Không tìm thấy xe' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: 'Lỗi server' });
  }
};

module.exports = { getAll, getById, add, update, remove, getByIdPublic };
