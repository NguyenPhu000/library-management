"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Loan, { foreignKey: "loan_id" });
      Payment.belongsTo(models.User, { foreignKey: "user_id" });
      Payment.belongsTo(models.Member, { foreignKey: "member_id" });
    }
  }
  Payment.init(
    {
      payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      loan_id: DataTypes.INTEGER,
      member_id: DataTypes.INTEGER,
      user_id: DataTypes.INTEGER,
      amount: DataTypes.DECIMAL(10, 2),
      payment_date: DataTypes.DATE,
      payment_method: {
        type: DataTypes.ENUM("cash", "qrcode"),
        allowNull: false,
        defaultValue: "cash",
      },
      status: {
        type: DataTypes.ENUM("PENDING", "APPROVED", "REJECTED"),
        allowNull: false,
        defaultValue: "PENDING",
      },
      qr_code_url: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "URL ảnh QR code từ VietQR",
      },
      qr_data: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Dữ liệu QR raw từ VietQR",
      },
      bank_account_no: {
        type: DataTypes.STRING(50),
        allowNull: true,
        comment: "Số tài khoản ngân hàng nhận tiền",
      },
      payment_content: {
        type: DataTypes.STRING(255),
        allowNull: true,
        comment: "Nội dung chuyển khoản để đối soát",
      },
      auto_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Thanh toán tự động xác nhận qua webhook",
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: false,
    }
  );
  return Payment;
};
