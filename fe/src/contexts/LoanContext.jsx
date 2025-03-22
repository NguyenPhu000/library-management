import React, { createContext, useState, useEffect, useContext } from "react";
import loanService from "../services/loanService";
import { useMemberId } from "./MemberContext";

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
        console.log("Không có memberId để lấy danh sách sách mượn.");
        return;
      }

      try {
        const data = await loanService.getCurrentLoans(memberId);
        setLoans(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLoans();
  }, [memberId]);

  const returnLoan = async (loanId) => {
    try {
      const result = await loanService.returnBook(loanId);

      if (result.success) {
        alert(result.message);
        setLoans((prevLoans) =>
          prevLoans.filter((loan) => loan.loan_id !== loanId)
        );
      } else {
        alert(result.message);
      }
    } catch (err) {
      setError(err.message);
      alert("Không thể trả sách.");
    }
  };

  const borrowBookContext = async (bookId) => {
    setBorrowLoading(true);
    setBorrowError(null);
    try {
      if (!memberId) {
        throw new Error("Không có memberId để mượn sách.");
      }
      const result = await loanService.borrowBook(memberId, bookId);
      setBorrowLoading(false);
      alert(result.message);
      return result;
    } catch (err) {
      setBorrowLoading(false);
      setBorrowError(err.message);
      alert("Không thể mượn sách: " + err.message);
      throw err;
    }
  };

  const requestRenewLoan = async (loanId) => {
    try {
      const result = await loanService.requestRenewLoan(loanId);
      alert(result.message);
      return result;
    } catch (err) {
      setError(err.message);
      alert("Không thể yêu cầu gia hạn: " + err.message);
      throw err;
    }
  };

  const fetchLoanHistory = async () => {
    if (!memberId) {
      console.log("Không có memberId để lấy lịch sử mượn sách.");
      return;
    }

    try {
      const history = await loanService.getLoanHistory(memberId);
      setLoanHistory(history);
    } catch (err) {
      setError(err.message);
      alert("Không thể lấy lịch sử mượn sách: " + err.message);
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
