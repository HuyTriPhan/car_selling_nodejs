const DashboardModel = require('../models/dashboard.model');

const getDashboard = async (req, res) => {
  try {
    const summary = await DashboardModel.getSummary();
    res.json(summary);
  } catch (error) {
    console.error('Lỗi dashboard:', error);
    res.status(500).json({ message: 'Lỗi server khi lấy thống kê dashboard' });
  }
};

module.exports = { getDashboard };
