const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express(); 

app.use(cors()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

// Route
app.use('/api/users', require('./routes/user.route'));
app.use('/api/admin', require('./routes/admin.route'));
app.use('/api/admin/cars', require('./routes/car.route'));
app.use('/api/admin/modellines', require('./routes/modelLine.route'));
app.use('/api/modelLine', require('./routes/modelLine.route'));
app.use('/uploads', express.static('uploads'));
app.use('/api', require('./routes/userCar.route'));
app.use('/api/orders', require('./routes/order.route'));
app.use('/api/vnpay', require('./routes/payment.route'));
app.use('/api/promotions', require('./routes/promotion.route'));
app.use('/api/dashboard', require('./routes/dashboard.route'));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
