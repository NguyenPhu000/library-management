import homeService from "../services/homeService.js";

// GET  /api/dashboard
const getDashboard = async (req, res) => {
  try {
    const dashboardData = await homeService.getDashboardData();
    const loansByMonth = await homeService.getLoansByMonth();
    const memberStatus = await homeService.getMemberStatus();
    const activeMembers = await homeService.getActiveMembers();

    return res.json({
      success: true,
      data: { dashboardData, loansByMonth, memberStatus, activeMembers },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi tải dữ liệu dashboard: " + error.message,
    });
  }
};

export default { getDashboard };
