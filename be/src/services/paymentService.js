import { Payment, Member, Loan, User } from "../models";
import db from "../models";
const { Sequelize } = db;
import vietqrService from "./vietqrService.js";
import { isTestMode } from "../config/testConfig.js";

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

// Tạo một khoản thanh toán mới với hỗ trợ QR code
const createPayment = async (paymentData) => {
  if (!paymentData || Object.keys(paymentData).length === 0) {
    throw new Error("Dữ liệu thanh toán không hợp lệ.");
  }

  const transaction = await db.sequelize.transaction();
  try {
    const { loan_id, member_id, user_id, amount, payment_method, description } =
      paymentData;

    // Validation
    if (!loan_id) {
      throw new Error("Thiếu loan_id để tạo thanh toán.");
    }
    if (!member_id) {
      throw new Error("Thiếu member_id để tạo thanh toán.");
    }
    if (!amount || amount <= 0) {
      throw new Error("Số tiền thanh toán không hợp lệ.");
    }
    if (!payment_method) {
      throw new Error("Thiếu phương thức thanh toán.");
    }

    // Validate payment method
    const validMethods = ["cash", "qrcode"];
    if (!validMethods.includes(payment_method.toLowerCase())) {
      throw new Error(
        "Phương thức thanh toán không hợp lệ. Chỉ chấp nhận: " +
          validMethods.join(", ")
      );
    }

    // Hủy các thanh toán pending/processing cũ nếu có (tránh trùng lặp)
    const oldPendingPayments = await Payment.findAll({
      where: {
        loan_id,
        status: "pending",
      },
      transaction,
    });

    for (const oldPayment of oldPendingPayments) {
      await oldPayment.update(
        {
          status: "cancelled",
          notes:
            (oldPayment.notes ? oldPayment.notes + "\n" : "") +
            `Auto-cancelled due to new payment request at ${new Date().toISOString()}`,
        },
        { transaction }
      );
    }

    // Kiểm tra loan tồn tại
    const loan = await Loan.findByPk(loan_id);
    if (!loan) {
      throw new Error("Không tìm thấy khoản vay.");
    }

    // Tạo payment record
    const paymentRecord = {
      loan_id,
      member_id,
      user_id: user_id || null,
      amount: parseFloat(amount),
      payment_method: payment_method.toLowerCase(),
      description:
        description || `Phí phạt trả sách quá hạn - Loan #${loan_id}`,
      status: "pending",
      payment_date: new Date(),
    };

    // Tạo đối tượng thanh toán
    const payment = await Payment.create(paymentRecord, { transaction });

    // Nếu là QR code, generate QR
    if (payment_method.toLowerCase() === "qrcode") {
      try {
        const qrResult = await vietqrService.generateQR({
          payment_id: payment.payment_id,
          amount: payment.amount,
          description: payment.description,
        });

        if (qrResult.success) {
          // Cập nhật payment với thông tin QR
          await payment.update(
            {
              qr_code_url: qrResult.qr_code_url,
              qr_data: qrResult.qr_data,
              bank_account_no: qrResult.bank_account_no,
              payment_content: qrResult.payment_content,
            },
            { transaction }
          );
        } else {
          // Sử dụng fallback data nếu API thất bại
          await payment.update(
            {
              qr_data: qrResult.fallback.qr_data,
              bank_account_no: qrResult.fallback.bank_account_no,
              payment_content: qrResult.fallback.payment_content,
              notes: `QR generation failed: ${qrResult.error}`,
            },
            { transaction }
          );
        }
      } catch (qrError) {
        console.error("QR Generation Error:", qrError);
        // Vẫn tạo payment nhưng không có QR
        await payment.update(
          {
            notes: `QR generation failed: ${qrError.message}`,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    // Reload payment with all data
    const fullPayment = await Payment.findByPk(payment.payment_id, {
      include: [
        { model: Member, attributes: ["member_code"] },
        { model: Loan, attributes: ["loan_id", "fine_amount"] },
        { model: User, attributes: ["username"] },
      ],
    });

    return {
      success: true,
      message: "Tạo thanh toán thành công.",
      payment: fullPayment,
    };
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

  const transaction = await db.sequelize.transaction();
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

// Lấy payment theo ID
const getPaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findByPk(paymentId, {
      include: [
        { model: Member, attributes: ["member_code"] },
        { model: Loan, attributes: ["loan_id", "fine_amount"] },
        { model: User, attributes: ["username"] },
      ],
    });

    if (!payment) {
      return { success: false, message: "Không tìm thấy thanh toán." };
    }

    return { success: true, payment };
  } catch (error) {
    throw new Error("Lỗi lấy thông tin thanh toán: " + error.message);
  }
};

// Auto confirm payment (từ webhook)
const autoConfirmPayment = async (paymentId, webhookData) => {
  const transaction = await db.sequelize.transaction();
  try {
    const payment = await Payment.findByPk(paymentId, { transaction });

    if (!payment) {
      throw new Error("Không tìm thấy thanh toán.");
    }

    if (payment.status === "completed") {
      return {
        success: false,
        message: "Thanh toán đã được xác nhận trước đó.",
      };
    }

    // Validate amount if provided
    if (webhookData.amount) {
      if (!vietqrService.validateAmount(payment.amount, webhookData.amount)) {
        throw new Error("Số tiền thanh toán không khớp.");
      }
    }

    // Update payment status
    await payment.update(
      {
        status: "completed",
        auto_verified: true,
        payment_date: new Date(),
        notes: payment.notes
          ? `${
              payment.notes
            }\nAuto-confirmed via webhook at ${new Date().toISOString()}`
          : `Auto-confirmed via webhook at ${new Date().toISOString()}`,
      },
      { transaction }
    );

    await transaction.commit();
    return {
      success: true,
      message: "Thanh toán đã được xác nhận tự động.",
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

// Hủy thanh toán
const cancelPayment = async (paymentId, reason) => {
  if (!paymentId || !reason) {
    return {
      success: false,
      message: "Thiếu thông tin cần thiết để hủy thanh toán.",
    };
  }

  const transaction = await db.sequelize.transaction();
  try {
    const payment = await Payment.findByPk(paymentId, { transaction });

    if (!payment) {
      throw new Error("Không tìm thấy thanh toán.");
    }

    if (payment.status === "cancelled") {
      return {
        success: false,
        message: "Thanh toán đã được hủy trước đó.",
      };
    }

    if (payment.status === "completed" || payment.status === "APPROVED") {
      return {
        success: false,
        message: "Không thể hủy thanh toán đã hoàn thành.",
      };
    }

    await payment.update(
      {
        status: "cancelled",
        notes: payment.notes
          ? `${payment.notes}\nHủy bởi admin: ${reason}`
          : `Hủy bởi admin: ${reason}`,
      },
      { transaction }
    );

    await transaction.commit();
    return {
      success: true,
      message: "Hủy thanh toán thành công.",
      payment,
    };
  } catch (error) {
    await transaction.rollback();
    return {
      success: false,
      message: "Lỗi hủy thanh toán: " + error.message,
    };
  }
};

// Lấy thống kê thanh toán
const getPaymentStats = async (startDate, endDate) => {
  try {
    const whereClause = {};
    if (startDate && endDate) {
      whereClause.payment_date = {
        [Sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
      };
    }

    const payments = await Payment.findAll({
      where: whereClause,
      attributes: ["amount", "status", "payment_method", "payment_date"],
    });

    const stats = {
      totalRevenue: 0,
      totalPayments: payments.length,
      pendingPayments: 0,
      completedPayments: 0,
      cashPayments: 0,
      qrPayments: 0,
      monthlyRevenue: 0,
      dailyRevenue: 0,
      averagePayment: 0,
      revenueGrowth: 0,
    };

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const today = new Date().toDateString();

    payments.forEach((payment) => {
      const amount = parseFloat(payment.amount) || 0;
      const paymentDate = new Date(payment.payment_date);

      // Total revenue (only completed payments)
      if (payment.status === "completed" || payment.status === "APPROVED") {
        stats.totalRevenue += amount;
        stats.completedPayments++;

        // Monthly revenue
        if (
          paymentDate.getMonth() === currentMonth &&
          paymentDate.getFullYear() === currentYear
        ) {
          stats.monthlyRevenue += amount;
        }

        // Daily revenue
        if (paymentDate.toDateString() === today) {
          stats.dailyRevenue += amount;
        }
      }

      // Status counts
      if (payment.status === "pending") {
        stats.pendingPayments++;
      }

      // Payment method counts
      if (payment.payment_method === "cash") {
        stats.cashPayments++;
      } else if (payment.payment_method === "qrcode") {
        stats.qrPayments++;
      }
    });

    // Calculate average payment
    if (stats.completedPayments > 0) {
      stats.averagePayment = stats.totalRevenue / stats.completedPayments;
    }

    return {
      success: true,
      stats,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi lấy thống kê thanh toán: " + error.message,
    };
  }
};

// Tạo báo cáo thu nhập
const generateIncomeReport = async (year, month) => {
  try {
    const whereClause = {
      status: ["completed", "APPROVED"],
    };

    if (year && month) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      whereClause.payment_date = {
        [Sequelize.Op.between]: [startDate, endDate],
      };
    } else if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      whereClause.payment_date = {
        [Sequelize.Op.between]: [startDate, endDate],
      };
    }

    const payments = await Payment.findAll({
      where: whereClause,
      include: [
        { model: Member, attributes: ["member_code"] },
        { model: Loan, attributes: ["loan_id"] },
      ],
      order: [["payment_date", "DESC"]],
    });

    const report = {
      period: year && month ? `${month}/${year}` : year ? `${year}` : "Tất cả",
      totalRevenue: 0,
      totalPayments: payments.length,
      paymentsByMethod: {
        cash: 0,
        qrcode: 0,
      },
      paymentsByStatus: {
        completed: 0,
        APPROVED: 0,
      },
      payments: payments.map((payment) => ({
        payment_id: payment.payment_id,
        amount: payment.amount,
        payment_method: payment.payment_method,
        status: payment.status,
        payment_date: payment.payment_date,
        member_code: payment.Member?.member_code,
        loan_id: payment.Loan?.loan_id,
      })),
    };

    payments.forEach((payment) => {
      const amount = parseFloat(payment.amount) || 0;
      report.totalRevenue += amount;

      // Count by method
      if (payment.payment_method === "cash") {
        report.paymentsByMethod.cash++;
      } else if (payment.payment_method === "qrcode") {
        report.paymentsByMethod.qrcode++;
      }

      // Count by status
      if (payment.status === "completed") {
        report.paymentsByStatus.completed++;
      } else if (payment.status === "APPROVED") {
        report.paymentsByStatus.APPROVED++;
      }
    });

    return {
      success: true,
      data: report,
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi tạo báo cáo thu nhập: " + error.message,
    };
  }
};

// Xóa thanh toán (hard delete)
const deletePayment = async (paymentId) => {
  try {
    const payment = await Payment.findByPk(paymentId);
    if (!payment) {
      return {
        success: false,
        message: "Không tìm thấy thanh toán.",
      };
    }

    await payment.destroy();

    return {
      success: true,
      message: "Xóa thanh toán thành công.",
    };
  } catch (error) {
    return {
      success: false,
      message: "Lỗi xóa thanh toán: " + error.message,
    };
  }
};

export default {
  getAllPayments,
  getPaymentsByMemberId,
  createPayment,
  confirmPayment,
  getPaymentById,
  autoConfirmPayment,
  cancelPayment,
  getPaymentStats,
  generateIncomeReport,
  deletePayment,
};
