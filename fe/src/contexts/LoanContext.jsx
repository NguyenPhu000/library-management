import React, { createContext, useState, useEffect, useContext } from "react";
import loanService from "../services/loanService";
import { useMemberId } from "./MemberContext";
import Swal from "sweetalert2"; // Import SweetAlert2

export const LoanContext = createContext();

export const LoanProvider = ({ children }) => {
  const memberId = useMemberId();
  const [loans, setLoans] = useState([]);
  const [loanHistory, setLoanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowError, setBorrowError] = useState(null);

  useEffect(() => {
    const fetchLoans = async () => {
      if (!memberId) {
        console.warn("Không có memberId để lấy danh sách sách mượn.");
        return;
      }

      setLoading(true);
      try {
        const data = await loanService.getCurrentLoans(memberId);
        setLoans(data);
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể lấy danh sách sách mượn!",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [memberId]);

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
        setLoans((prevLoans) =>
          prevLoans.filter((loan) => loan.loan_id !== loanId)
        );
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể trả sách. Vui lòng thử lại sau.",
      });
    }
  };

  const borrowBookContext = async (bookId) => {
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
      }
      return result;
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể yêu cầu gia hạn: " + err.message,
      });
      throw err;
    }
  };

  const fetchLoanHistory = async () => {
    if (!memberId) {
      console.warn("Không có memberId để lấy lịch sử mượn sách.");
      return;
    }

    try {
      const history = await loanService.getLoanHistory(memberId);
      setLoanHistory(history);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lấy lịch sử mượn sách: " + err.message,
      });
    }
  };

  return (
    <LoanContext.Provider
      value={{
        loans,
        loanHistory,
        loading,
        error,
        returnLoan,
        borrowBook: borrowBookContext,
        requestRenewLoan,
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
