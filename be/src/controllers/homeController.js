import homeService from "../services/homeService.js";

const getHomePage = async (req, res) => {
  try {
    const dashboardData = await homeService.getDashboardData();
    const loansByMonth = await homeService.getLoansByMonth();
    const memberStatus = await homeService.getMemberStatus();
    const activeMembers = await homeService.getActiveMembers();

    res.render("homePage", {
      dashboardData,
      loansByMonth,
      memberStatus,
      activeMembers,
      successMessage: req.query.successMessage || null,
      errorMessage: req.query.errorMessage || null,
    });
  } catch (error) {
    res.status(500).send("Có lỗi xảy ra khi tải trang chủ");
  }
};

export default {
  getHomePage,
};
