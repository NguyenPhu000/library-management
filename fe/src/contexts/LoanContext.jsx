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
  const [librarySettings, setLibrarySettings] = useState(null);

  // =============================================================================
  // ENHANCED LOAN SYSTEM FUNCTIONS
  // =============================================================================

  // Load library settings/business rules - Using hardcoded values based on memory
  const loadLibrarySettings = useCallback(async () => {
    // Set default settings based on business rules from memory:
    // Tối đa 5 cuốn sách/thành viên, thời hạn mượn 10 ngày, phí phạt 2,000 VND/ngày trễ hạn,
    // tối đa 1 lần gia hạn, giữ chỗ đặt trước 3 ngày
    setLibrarySettings({
      maxBooksPerMember: 5,
      loanDurationDays: 10,
      finePerDay: 2000,
      maxRenewals: 1,
      reservationHoldDays: 3,
    });
  }, []);

  // NEW: Fetch loans với NEW PICKUP CODE API
  const fetchLoans = useCallback(async () => {
    if (!currentUser || !memberId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await loanService.getMemberCurrentLoans(memberId);

      if (data.success && Array.isArray(data.loans)) {
        setLoans(data.loans);
      } else {
        console.error("Dữ liệu nhận được không đúng định dạng:", data);
        setError("Định dạng dữ liệu không hợp lệ");
      }
    } catch (err) {
      console.error("Lỗi khi tải danh sách mượn:", err);
      setError("Không thể tải danh sách sách mượn");
    } finally {
      setLoading(false);
    }
  }, [currentUser, memberId]);

  // NEW: Fetch loan history với NEW API
  const fetchLoanHistory = useCallback(async () => {
    if (!currentUser || !memberId) {
      return;
    }

    if (historyLoading) return;

    setHistoryLoading(true);
    setError(null); // Reset error state

    try {
      const historyData = await loanService.getMemberLoanHistory(memberId);

      if (historyData && historyData.success === true) {
        // Kiểm tra xem có thuộc tính history hoặc loans không
        const loanArray = historyData.history || historyData.loans || [];

        if (Array.isArray(loanArray)) {
          // Format dữ liệu trước khi lưu vào state
          const formattedLoans = loanArray.map((loan) => ({
            ...loan,
            fine_amount: loan.fine_amount || 0,
            return_date: loan.return_date || null,
            renewal_count: loan.renewal_count || 0,
            status: loan.status || "completed",
          }));
          setLoanHistory(formattedLoans);
        } else {
          console.error("Dữ liệu lịch sử mượn không phải là mảng:", loanArray);
          setError("Định dạng dữ liệu không hợp lệ");
        }
      } else {
        console.error("Lịch sử mượn không đúng định dạng:", historyData);
        setError("Không thể tải lịch sử mượn sách");
      }
    } catch (err) {
      console.error("Lỗi khi tải lịch sử mượn:", err);
      setError(err.message || "Không thể tải lịch sử mượn sách");
    } finally {
      setHistoryLoading(false);
    }
  }, [currentUser, memberId]);

  // Load initial data
  useEffect(() => {
    loadLibrarySettings();
  }, [loadLibrarySettings]);

  useEffect(() => {
    if (currentUser && memberId) {
      fetchLoans();
      fetchLoanHistory();
    }
  }, [memberId, currentUser, fetchLoans, fetchLoanHistory]);

  // =============================================================================
  // ENHANCED LOAN ACTIONS
  // =============================================================================

  // Enhanced return loan (Admin functionality - members can't directly return)
  const returnLoan = async (loanId) => {
    try {
      const result = await loanService.returnBook(loanId);

      const isSuccess = result.success !== false;
      const message =
        result.message ||
        (isSuccess ? "Trả sách thành công!" : "Có lỗi xảy ra khi trả sách.");

      // Show fine information if applicable
      let displayMessage = message;
      if (isSuccess && result.data?.fine_amount > 0) {
        displayMessage += `\nPhí phạt: ${result.data.fine_amount.toLocaleString()} VND`;
      }

      Swal.fire({
        icon: isSuccess ? "success" : "error",
        title: isSuccess ? "Thành công" : "Lỗi",
        text: displayMessage,
      });

      if (isSuccess) {
        fetchLoans();
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

  // NEW: Request loan với pickup code system
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

    // Hiển thị hộp thoại xác nhận trước khi gửi
    const { isConfirmed } = await Swal.fire({
      title: "Xác nhận mượn sách",
      html: `<p>Bạn có chắc muốn gửi yêu cầu mượn sách này?</p><p><em>Lưu ý: Sau khi thủ thư duyệt bạn phải đến nhận sách trong 3 ngày.</em></p>`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Gửi yêu cầu",
      cancelButtonText: "Hủy",
    });

    if (!isConfirmed) return { success: false, message: "Đã hủy" };

    setBorrowLoading(true);
    setBorrowError(null);

    try {
      if (!memberId) throw new Error("Không có memberId để mượn sách.");

      // Request loan với pickup code system
      const result = await loanService.requestLoan(memberId, bookId, "");

      if (result.success) {
        const pickupCode = result.pickup_code || result.loan?.pickup_code;
        Swal.fire({
          icon: "success",
          title: "Đã gửi yêu cầu mượn!",
          html: `
            <div class="text-center leading-relaxed">
              <p class="text-base mb-3">
                Bạn đã gửi yêu cầu mượn <strong class="text-primary">\"${
                  result.loan?.Book?.title || ""
                }\"</strong> thành công.
              </p>

              <ul class="text-left list-disc list-inside space-y-1 text-sm">
                <li>Đến thư viện và đọc mã nhận sách cho thủ thư</li>
                <li>Thủ thư sẽ duyệt yêu cầu và gửi sách cho bạn</li>
                <li>Thời hạn trả: <strong class="text-blue-600">10 ngày</strong> kể từ khi nhận sách</li>
                <li>Phí phạt: <strong class="text-red-600">2.000 VND/ngày trễ</strong></li>
              </ul>
            </div>
          `,
          confirmButtonText: "Đã hiểu",
          confirmButtonColor: "#16a34a",
          width: 520,
          customClass: {
            popup: "swal2-rounded",
          },
        });

        // Refresh loan list để hiển thị yêu cầu mới
        fetchLoans();

        return { success: true, message: result.message };
      } else {
        throw new Error(result.message || "Không thể gửi yêu cầu mượn sách");
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu mượn sách:", err);
      const errorMessage = err.message || "Không thể gửi yêu cầu mượn sách";

      setBorrowError(errorMessage);

      Swal.fire({
        icon: "error",
        title: "Không thể gửi yêu cầu",
        text: errorMessage,
      });

      return { success: false, message: errorMessage };
    } finally {
      setBorrowLoading(false);
    }
  };

  // Enhanced request renewal với reason
  const requestRenewLoan = async (loanId, reason = "") => {
    try {
      // Find the loan to check business rules
      const loan = loans.find((l) => l.loan_id === loanId);
      if (!loan) {
        throw new Error("Không tìm thấy phiếu mượn");
      }

      // Check if renewal is allowed
      if (!loanService.canRenew(loan)) {
        let message = "Không thể gia hạn sách này.";
        if (loan.renewal_count >= (librarySettings?.maxRenewals || 1)) {
          message = `Đã đạt giới hạn gia hạn tối đa (${
            librarySettings?.maxRenewals || 1
          } lần)`;
        } else if (loan.fine_amount > 0) {
          message = `Vui lòng thanh toán phí phạt (${loan.fine_amount.toLocaleString()} VND) trước khi gia hạn`;
        }

        Swal.fire({
          icon: "warning",
          title: "Không thể gia hạn",
          text: message,
        });
        return { success: false, message };
      }

      // Get renewal reason if not provided
      let renewalReason = reason;
      if (!renewalReason) {
        const { value: inputReason } = await Swal.fire({
          title: "Yêu cầu gia hạn",
          text: "Vui lòng nhập lý do gia hạn (tùy chọn):",
          input: "textarea",
          inputPlaceholder: "Lý do gia hạn...",
          showCancelButton: true,
          confirmButtonText: "Gửi yêu cầu",
          cancelButtonText: "Hủy",
          inputValidator: () => {
            // No validation required - reason is optional
            return null;
          },
        });

        if (inputReason === undefined) {
          // User cancelled
          return { success: false, message: "Đã hủy yêu cầu gia hạn" };
        }

        renewalReason = inputReason || "";
      }

      const result = await loanService.requestRenewLoan(
        loanId,
        memberId,
        renewalReason
      );

      const isSuccess = result.success !== false;
      const message =
        result.message ||
        (isSuccess
          ? "Yêu cầu gia hạn đã được gửi thành công!"
          : "Có lỗi xảy ra khi gửi yêu cầu gia hạn.");

      Swal.fire({
        icon: isSuccess ? "success" : "error",
        title: isSuccess ? "Thành công" : "Lỗi",
        text: message,
      });

      if (isSuccess) {
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

  // Hàm lấy chi tiết loan theo ID
  const getLoanDetail = async (loanId) => {
    // Thử tìm trong loanHistory trước
    let found = [...loans, ...loanHistory].find((l) => l.loan_id === loanId);
    if (found) return found;

    // Nếu không thấy, fetch lại lịch sử
    try {
      const historyData = await loanService.getMemberLoanHistory(memberId);
      if (historyData.success) {
        const arr = historyData.history || historyData.loans || [];
        found = arr.find((l) => l.loan_id === loanId);
        if (found) return found;
      }
    } catch (err) {
      console.error("getLoanDetail error:", err);
    }
    throw new Error("Không thể tải thông tin khoản vay");
  };

  // =============================================================================
  // UTILITY FUNCTIONS
  // =============================================================================

  // Get enhanced loan statistics
  const getLoanStatistics = () => {
    const active = loans.filter((loan) => !loan.returned);
    const overdue = active.filter(
      (loan) => new Date(loan.due_date) < new Date()
    );
    const nearDue = active.filter((loan) => {
      const daysUntilDue =
        (new Date(loan.due_date) - new Date()) / (1000 * 60 * 60 * 24);
      return daysUntilDue <= 2 && daysUntilDue > 0;
    });
    const pending = active.filter((loan) => loan.renewal_status === "pending");
    const totalFines = loans.reduce(
      (sum, loan) => sum + (loan.fine_amount || 0),
      0
    );

    return {
      active: active.length,
      overdue: overdue.length,
      nearDue: nearDue.length,
      pending: pending.length,
      totalFines,
      remainingSlots: (librarySettings?.maxBooksPerMember || 5) - active.length,
    };
  };

  // Check if member can borrow more books
  const canBorrowMore = () => {
    const activeLoans = loans.filter((loan) => !loan.returned).length;
    return activeLoans < (librarySettings?.maxBooksPerMember || 5);
  };

  // Get time remaining for a loan
  const getTimeRemaining = (dueDate) => {
    return loanService.formatTimeRemaining(dueDate);
  };

  // Calculate fine for a loan
  const calculateFine = (dueDate, returnDate = new Date()) => {
    return loanService.calculateFine(dueDate, returnDate);
  };

  // =============================================================================
  // CONTEXT VALUE
  // =============================================================================

  return (
    <LoanContext.Provider
      value={{
        // State
        loans,
        loanHistory,
        loading,
        historyLoading,
        error,
        borrowLoading,
        borrowError,
        librarySettings,

        // Actions
        fetchLoans,
        fetchLoanHistory,
        loadLibrarySettings,
        returnLoan,
        borrowBook: borrowBookContext,
        requestRenewLoan,
        getLoanDetail,

        // Utility functions
        getLoanStatistics,
        canBorrowMore,
        getTimeRemaining,
        calculateFine,

        // Enhanced utilities from service
        canRenew: loanService.canRenew,
        formatTimeRemaining: loanService.formatTimeRemaining,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};

export const useLoan = () => {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error("useLoan must be used within a LoanProvider");
  }
  return context;
};
