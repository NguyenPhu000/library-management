"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    static associate(models) {
      // 1 loan thuộc về 1 member
      Loan.belongsTo(models.Member, {
        foreignKey: "member_id",
      });
      // 1 loan thuộc về 1 book
      Loan.belongsTo(models.Book, {
        foreignKey: "book_id",
      });
      // 1 loan thuộc về 1 admin (người duyệt)
      Loan.belongsTo(models.Admin, {
        foreignKey: "approved_by",
        as: "approver",
      });
      // 1 loan có thể có nhiều payment (phạt)
      Loan.hasMany(models.Payment, {
        foreignKey: "loan_id",
      });
    }
  }
  Loan.init(
    {
      loan_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      member_id: DataTypes.INTEGER,
      book_id: DataTypes.INTEGER,
      // Trạng thái: 'requested' -> 'approved' -> 'borrowed' -> 'returned' hoặc 'rejected'
      status: {
        type: DataTypes.ENUM(
          "requested",
          "approved",
          "pending_pickup",
          "rejected",
          "borrowed",
          "returned",
          "overdue",
          "cancelled"
        ),
        allowNull: false,
        defaultValue: "requested",
      },
      // Mã nhận sách (sinh ra khi admin duyệt)
      pickup_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true,
        comment:
          "Mã nhận sách dạng PICK-XXXX, member đưa cho admin để nhận sách",
      },
      // Ngày yêu cầu mượn
      request_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      // Ngày duyệt yêu cầu
      approved_date: DataTypes.DATE,
      // Người duyệt (admin_id)
      approved_by: DataTypes.INTEGER,
      // Lý do từ chối (nếu có)
      rejection_reason: DataTypes.TEXT,
      // Ngày thực tế nhận sách
      loan_date: DataTypes.DATE,
      // Ngày hết hạn trả
      due_date: DataTypes.DATE,
      // Ngày thực tế trả sách
      return_date: DataTypes.DATE,
      // Đã trả hay chưa (deprecated - dùng status thay thế)
      returned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      // Tiền phạt
      fine_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
      },
      // Số lần gia hạn
      renew_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      // Trạng thái gia hạn
      renewal_status: {
        type: DataTypes.ENUM("none", "requested", "approved", "rejected"),
        allowNull: false,
        defaultValue: "none",
      },
      // Ghi chú
      notes: DataTypes.TEXT,
      // Hạn giữ chỗ (3 ngày từ khi được duyệt)
      hold_until: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Loan",
      tableName: "Loans",
      timestamps: true, // Bật timestamps để theo dõi created_at, updated_at
    }
  );
  return Loan;
};
