import { createContext, useContext, useEffect, useState } from "react";
import {
  getPaymentsByMemberId,
  createPayment,
} from "../services/paymentService";
import { useAuth } from "./AuthContext";
import { useMemberId } from "./MemberContext";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const { user } = useAuth();
  const memberId = useMemberId();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm lấy danh sách thanh toán
  const fetchPayments = async () => {
    if (!memberId) {
      setError("Không có memberId để lấy danh sách thanh toán.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await getPaymentsByMemberId(memberId);
      setPayments(data);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách thanh toán:", error);
      setError("Không thể lấy danh sách thanh toán");
    } finally {
      setLoading(false);
    }
  };

  // Hàm kiểm tra xem thanh toán đã tồn tại hay chưa
  const isPaymentExists = (loanId) => {
    return payments.some((payment) => payment.Loan.loan_id === loanId);
  };

  // Hàm tạo một khoản thanh toán mới
  const handleCreatePayment = async (loanId, paymentData) => {
    try {
      if (!paymentData || Object.keys(paymentData).length === 0) {
        throw new Error("Dữ liệu thanh toán không hợp lệ.");
      }

      const newPaymentData = {
        ...paymentData,
        user_id: user ? user.user_id : null,
        member_id: memberId,
      };

      const newPayment = await createPayment(
        loanId,
        user ? user.user_id : null,
        memberId,
        newPaymentData
      );

      setPayments((prevPayments) => [...prevPayments, newPayment]);
      return newPayment;
    } catch (error) {
      console.error("❌ Lỗi khi tạo thanh toán:", error);
      throw new Error("Không thể tạo thanh toán: " + error.message);
    }
  };

  // Tự động lấy danh sách thanh toán khi component được mount
  useEffect(() => {
    fetchPayments();
  }, [memberId]);

  return (
    <PaymentContext.Provider
      value={{
        payments,
        loading,
        error,
        handleCreatePayment,
        fetchPayments,
        isPaymentExists,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error("usePayment phải được sử dụng trong PaymentProvider");
  }
  return context;
};
