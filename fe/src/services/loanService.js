// Hàm này lấy danh sách các lượt mượn hiện tại của một thành viên theo ID
import API from "./api";

const loanService = {
  async getCurrentLoans(memberId) {
    try {
      const response = await API.get(`/loans/current/${memberId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách loan:", error);
      throw new Error("Không thể lấy danh sách sách mượn.");
    }
  },

  // Hàm này xử lý việc mượn sách cho một thành viên theo ID
  async borrowBook(memberId, bookId) {
    try {
      const response = await API.post(
        `/loans/borrow/members/${memberId}/books/${bookId}`,
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi mượn sách:", error);
      throw new Error("Không thể mượn sách.");
    }
  },

  // Hàm này xử lý việc trả sách theo ID của lượt mượn
  async returnBook(loanId) {
    try {
      const response = await API.post(
        `/loans/return`,
        { loan_id: loanId },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi trả sách:", error);
      throw new Error("Không thể trả sách.");
    }
  },

  // Hàm này yêu cầu gia hạn lượt mượn sách
  async requestRenewLoan(loanId) {
    try {
      const response = await API.post(
        `/loans/request-renew`,
        { loan_id: loanId },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi yêu cầu gia hạn:", error);
      throw new Error("Không thể yêu cầu gia hạn. Vui lòng thử lại sau.");
    }
  },
  // Hàm này lấy lịch sử mượn sách của một thành viên theo ID
  async getLoanHistory(memberId) {
    try {
      const response = await API.get(`/loans/history/${memberId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi khi lấy lịch sử mượn sách:", error);
      throw new Error("Không thể lấy lịch sử mượn sách.");
    }
  },
};

export default loanService;
