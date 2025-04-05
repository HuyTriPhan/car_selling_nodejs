const express = require('express');
const cors = require('cors'); 
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express(); 

app.use(cors()); 
app.use(express.json());

connectDB();

app.use('/api/users', require('./routes/user.route'));
app.use('/api/admin', require('./routes/admin.route'));
app.use('/api/admin/cars', require('./routes/car.route'));
app.use('/api/admin/modellines', require('./routes/modelLine.route'));
app.use('/api/modelLine', require('./routes/modelLine.route'));
app.use('/uploads', express.static('uploads'));
app.use('/api', require('./routes/userCar.route'));
app.use('/api/orders', require('./routes/order.route'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
