const Car = require('../models/car.model');

const getAllCars = () => Car.find().populate('modelLine').sort({ createdAt: -1 });

const getCarById = (id) => Car.findById(id);

const getCarByIdPublic = (id) => Car.findById(id).populate('modelLine');

const addCar = (data) => {
  const car = new Car(data);
  return car.save();
};

const updateCar = (id, data) => Car.findByIdAndUpdate(id, data, { new: true });

const deleteCar = (id) => Car.findByIdAndDelete(id);

module.exports = { getAllCars, getCarById, getCarByIdPublic, addCar, updateCar, deleteCar };
