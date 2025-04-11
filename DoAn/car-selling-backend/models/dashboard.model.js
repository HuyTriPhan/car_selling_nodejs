const User = require('./user.model');
const Order = require('./order.model');
const Car = require('./car.model');
const Payment = require('./payment.model');

const DashboardModel = {
  async getSummary() {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Tổng số xe còn lại là tổng của tất cả stock
    const totalCarsStock = await Car.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$stock" }
        }
      }
    ]);

    // Tổng tiền đã thanh toán từ bảng Payment
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'paid' } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    return {
      totalUsers,
      totalOrders,
      totalCars: totalCarsStock[0]?.totalStock || 0,
      totalRevenue: totalRevenue[0]?.total || 0
    };
  }
};

module.exports = DashboardModel;
