"use strict";

/**
 * Migration thêm các trường QR code và cập nhật payment_method
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm các trường mới cho QR payment
    await queryInterface.addColumn("Payments", "qr_code_url", {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "URL ảnh QR code từ VietQR",
    });

    await queryInterface.addColumn("Payments", "qr_data", {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: "Dữ liệu QR raw từ VietQR",
    });

    await queryInterface.addColumn("Payments", "bank_account_no", {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: "Số tài khoản ngân hàng nhận tiền",
    });

    await queryInterface.addColumn("Payments", "payment_content", {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: "Nội dung chuyển khoản để đối soát",
    });

    await queryInterface.addColumn("Payments", "auto_verified", {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      comment: "Thanh toán tự động xác nhận qua webhook",
    });

    // Cập nhật payment_method thành ENUM
    await queryInterface.changeColumn("Payments", "payment_method", {
      type: Sequelize.ENUM("cash", "qrcode"),
      allowNull: false,
      defaultValue: "cash",
    });

    // Thêm index cho payment_content để tra cứu nhanh
    await queryInterface.addIndex("Payments", ["payment_content"], {
      name: "idx_payment_content",
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa index
    await queryInterface.removeIndex("Payments", "idx_payment_content");

    // Xóa các cột đã thêm
    await queryInterface.removeColumn("Payments", "qr_code_url");
    await queryInterface.removeColumn("Payments", "qr_data");
    await queryInterface.removeColumn("Payments", "bank_account_no");
    await queryInterface.removeColumn("Payments", "payment_content");
    await queryInterface.removeColumn("Payments", "auto_verified");

    // Khôi phục payment_method về dạng STRING
    await queryInterface.changeColumn("Payments", "payment_method", {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: "CASH",
    });
  },
};
