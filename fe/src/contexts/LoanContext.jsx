import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import loanService from "../services/loanService";
import { useMemberId } from "./MemberContext";
import Swal from "sweetalert2"; // Import SweetAlert2
import { useAuth } from "./AuthContext";

export const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const memberId = useMemberId();
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowError, setBorrowError] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Sử dụng useCallback để đảm bảo hàm không được tạo lại mỗi lần render
  const fetchLoans = useCallback(async () => {
    if (!currentUser || !memberId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await loanService.getCurrentLoans(memberId);
      // Đảm bảo dữ liệu nhận được đúng định dạng
      if (Array.isArray(data)) {
        setLoans(data);
      } else {
        console.error("Dữ liệu nhận được không phải là mảng:", data);
        setError("Định dạng dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách mượn:", err);
      setError("Không thể tải danh sách sách mượn");
    } finally {
      setLoading(false);
    }
  }, [currentUser, memberId]);

  // Sử dụng useCallback để đảm bảo hàm không được tạo lại mỗi lần render
  const fetchLoanHistory = useCallback(async () => {
    if (!currentUser || !memberId) {
      return;
    }

    // Tránh fetch nhiều lần liên tục
    if (historyLoading) return;

    setHistoryLoading(true);

    try {
      const history = await loanService.getLoanHistory(memberId);
      if (Array.isArray(history)) {
        setLoanHistory(history);
      } else {
        console.error("Lịch sử mượn không phải là mảng:", history);
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử mượn:", err);
      setError(err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, [currentUser, memberId, historyLoading]);

  // Chỉ fetch dữ liệu khi memberId hoặc currentUser thay đổi
  useEffect(() => {
    if (currentUser && memberId) {
      fetchLoans();
    }
  }, [memberId, currentUser, fetchLoans]);

  const returnLoan = async (loanId) => {
    try {
      const result = await loanService.returnBook(loanId);

      Swal.fire({
        icon: result.success ? "success" : "error",
        title: result.success ? "Thành công" : "Lỗi",
        text: result.success
          ? "Trả sách thành công!"
          : result.message || "Có lỗi xảy ra khi trả sách.",
      });

      if (result.success) {
        // Cập nhật lại danh sách mượn sau khi trả sách thành công
        fetchLoans();
        // Cập nhật lịch sử mượn
        fetchLoanHistory();
      }
    } catch (err) {
      console.error("Lỗi khi trả sách:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể trả sách. Vui lòng thử lại sau.",
      });
    }
  };

  const borrowBookContext = async (bookId) => {
    if (!currentUser) {
      Swal.fire({
        icon: "info",
        title: "Cần đăng nhập",
        text: "Bạn cần đăng nhập để mượn sách.",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập ngay",
        cancelButtonText: "Đóng",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return { success: false, message: "Vui lòng đăng nhập để mượn sách" };
    }

    setBorrowLoading(true);
    setBorrowError(null);
    try {
      if (!memberId) throw new Error("Không có memberId để mượn sách.");

      const result = await loanService.borrowBook(memberId, bookId);
      setBorrowLoading(false);

      Swal.fire({
        icon: result.success ? "success" : "error",
        title: result.success ? "Thành công" : "Lỗi",
        text:
          result.message ||
          (result.success
            ? "Mượn sách thành công!"
            : "Có lỗi xảy ra khi mượn sách."),
      });

      // Nếu mượn sách thành công, cập nhật lại danh sách
      if (result.success) {
        fetchLoans();
      }

      return result;
    } catch (err) {
      setBorrowLoading(false);
      setBorrowError(err.message);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể mượn sách: " + err.message,
      });
      throw err;
    }
  };

  const requestRenewLoan = async (loanId) => {
    try {
      const result = await loanService.requestRenewLoan(loanId);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Yêu cầu gia hạn sách đã được gửi thành công!",
        });

        // Cập nhật danh sách mượn sau khi yêu cầu gia hạn
        fetchLoans();
      }
      return result;
    } catch (err) {
      console.error("Lỗi khi yêu cầu gia hạn:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể yêu cầu gia hạn: " + err.message,
      });
      throw err;
    }
  };

  return (
    <LoanContext.Provider
      value={{
        loans,
        loanHistory,
        loading,
        historyLoading,
        error,
        returnLoan,
        borrowBook: borrowBookContext,
        requestRenewLoan,
        fetchLoans,
        fetchLoanHistory,
        borrowLoading,
        borrowError,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error("useLoan phải được sử dụng trong LoanProvider");
  }
  return context;
};
