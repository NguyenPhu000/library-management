import { Payment, Member, Loan, User } from "../models";
import { sequelize } from "../models";

// Lấy danh sách tất cả các payment với tất cả các thuộc tính
const getAllPayments = async () => {
  try {
    return await Payment.findAll({
      include: [
        {
          model: Member,
          attributes: ["member_code"],
        },
        {
          model: Loan,
          attributes: ["loan_id", "fine_amount"],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });
  } catch (error) {
    throw new Error("Lỗi lấy danh sách thanh toán: " + error.message);
  }
};

const getPaymentsByMemberId = async (memberId) => {
  try {
    return await Payment.findAll({
      where: { member_id: memberId },
      include: [
        {
          model: Member,
          attributes: ["member_code"],
        },
        {
          model: Loan,
          attributes: ["loan_id", "fine_amount"],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
      attributes: [
        "payment_id",
        "payment_date",
        "payment_method",
        "amount",
        "status",
      ],
      order: [["payment_date", "DESC"]],
    });
  } catch (error) {
    throw new Error("Lỗi lấy danh sách thanh toán: " + error.message);
  }
};

// Tạo một khoản thanh toán mới
const createPayment = async (paymentData) => {
  if (!paymentData || Object.keys(paymentData).length === 0) {
    throw new Error("Dữ liệu thanh toán không hợp lệ.");
  }

  const transaction = await sequelize.transaction();
  try {
    const { loan_id, payment_date, payment_method, user_id, member_id } =
      paymentData;

    if (!loan_id) {
      throw new Error("Thiếu loan_id để tạo thanh toán.");
    }

    if (!user_id) {
      throw new Error("Thiếu user_id để tạo thanh toán.");
    }
    if (!member_id) {
      throw new Error("Thiếu member_id để tạo thanh toán.");
    }

    const loan = await Loan.findByPk(loan_id);
    if (!loan) {
      throw new Error("Không tìm thấy khoản vay.");
    }

    // Tạo đối tượng thanh toán
    const payment = await Payment.create(
      {
        loan_id,
        payment_date,
        payment_method,
        user_id,
        member_id,
        status: "PENDING",
      },
      { transaction }
    );

    await transaction.commit();
    return { success: true, message: "Tạo thanh toán thành công.", payment };
  } catch (error) {
    await transaction.rollback();
    return { success: false, message: "Lỗi tạo thanh toán: " + error.message };
  }
};

const confirmPayment = async (paymentId, amount) => {
  if (!paymentId || !amount) {
    return {
      success: false,
      message: "Thiếu thông tin cần thiết để xác nhận thanh toán.",
    };
  }

  const transaction = await sequelize.transaction();
  try {
    const payment = await Payment.findByPk(paymentId, { transaction });

    if (!payment) {
      throw new Error("Không tìm thấy thanh toán.");
    }

    if (payment.status === "APPROVED") {
      return {
        success: false,
        message: "Thanh toán đã được xác nhận trước đó.",
      };
    }

    if (amount < payment.amount) {
      return {
        success: false,
        message: "Số tiền thanh toán không đúng.",
      };
    }

    await payment.update(
      {
        status: "APPROVED",
        amount: amount,
      },
      { transaction }
    );

    await transaction.commit();
    return {
      success: true,
      message: "Xác nhận thanh toán thành công.",
      payment,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi xác nhận thanh toán: " + error.message,
    };
  }
};

export default {
  getAllPayments,
  getPaymentsByMemberId,
  createPayment,
  confirmPayment,
};
