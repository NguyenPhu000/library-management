import { createContext, useContext, useEffect, useState } from "react";
import {
  getPaymentsByMemberId,
  createPayment,
} from "../services/paymentService";
import { useAuth } from "./AuthContext";
import { useMemberId } from "./MemberContext";

const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const { currentUser } = useAuth();
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

  // Kiểm tra tình trạng thanh toán của 1 loan
  const isPaymentCompleted = (loanId) => {
    return payments.some(
      (p) =>
        p.Loan.loan_id === loanId &&
        ["completed", "APPROVED"].includes(
          p.status?.toLowerCase?.() || p.status
        )
    );
  };

  const isPaymentPending = (loanId) => {
    return payments.some(
      (p) =>
        p.Loan.loan_id === loanId &&
        ["pending", "processing"].includes(
          p.status?.toLowerCase?.() || p.status
        )
    );
  };

  const getPendingQrPayment = (loanId) => {
    return payments.find(
      (p) =>
        p.Loan.loan_id === loanId &&
        ["pending", "processing"].includes(
          p.status?.toLowerCase?.() || p.status
        ) &&
        p.payment_method === "qrcode"
    );
  };

  // Hàm tạo một khoản thanh toán mới (hỗ trợ QR code)
  const createPaymentRequest = async (paymentData) => {
    try {
      if (!paymentData || Object.keys(paymentData).length === 0) {
        throw new Error("Dữ liệu thanh toán không hợp lệ.");
      }

      if (!["cash", "qrcode"].includes(paymentData.payment_method)) {
        throw new Error("Phương thức thanh toán không hợp lệ.");
      }

      const newPaymentData = {
        ...paymentData,
        amount: Number(paymentData.amount),
        description:
          paymentData.description ||
          `Phí phạt trả sách quá hạn - Loan #${paymentData.loan_id}`,
        user_id: currentUser ? currentUser.user_id || currentUser.id : null,
        member_id: memberId,
        status:
          paymentData.payment_method === "qrcode" ? "pending" : "processing",
      };

      const newPayment = await createPayment(newPaymentData);

      if (!newPayment) {
        throw new Error("Không nhận được phản hồi từ server");
      }

      // Cập nhật danh sách payments
      setPayments((prevPayments) => {
        // Loại bỏ payment cũ của loan này nếu có
        const filteredPayments = prevPayments.filter(
          (p) => p.loan_id !== paymentData.loan_id
        );
        return [...filteredPayments, newPayment];
      });

      return newPayment;
    } catch (error) {
      console.error("❌ Lỗi khi tạo thanh toán:", error);
      throw error;
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
        createPaymentRequest,
        handleCreatePayment: createPaymentRequest,
        fetchPayments,
        isPaymentCompleted,
        isPaymentPending,
        getPendingQrPayment,
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
