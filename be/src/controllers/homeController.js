import homeService from "../services/homeService.js";

export const getHomePage = async (req, res) => {
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
    });
  } catch (error) {
    res.status(500).send("Lỗi khi tải trang chủ");
  }
};

module.exports = {
  getHomePage: getHomePage,
};
