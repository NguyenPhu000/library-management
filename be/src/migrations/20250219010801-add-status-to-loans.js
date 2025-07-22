"use strict";

/**
 * Migration: Thêm các cột cần thiết cho hệ thống pickup code và workflow mới
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm cột status để quản lý trạng thái loan
    await queryInterface.addColumn("Loans", "status", {
      type: Sequelize.ENUM(
        "requested", // Yêu cầu chờ duyệt
        "pending_pickup", // Đã duyệt, chờ nhận sách
        "borrowed", // Đang mượn
        "returned", // Đã trả
        "rejected", // Từ chối
        "cancelled" // Hủy bởi user
      ),
      allowNull: false,
      defaultValue: "requested",
    });

    // Thêm cột pickup_code cho hệ thống mã nhận sách
    await queryInterface.addColumn("Loans", "pickup_code", {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
    });

    // Thêm cột request_date để lưu ngày yêu cầu
    await queryInterface.addColumn("Loans", "request_date", {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    // Thêm cột hold_until để quản lý thời hạn giữ chỗ
    await queryInterface.addColumn("Loans", "hold_until", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Thêm cột approved_date
    await queryInterface.addColumn("Loans", "approved_date", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    // Thêm cột approved_by (FK đến admins)
    await queryInterface.addColumn("Loans", "approved_by", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // Thêm cột notes cho ghi chú
    await queryInterface.addColumn("Loans", "notes", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Thêm cột rejection_reason
    await queryInterface.addColumn("Loans", "rejection_reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    // Cập nhật dữ liệu hiện có: set status dựa trên returned
    await queryInterface.sequelize.query(`
      UPDATE Loans 
      SET status = CASE 
        WHEN returned = 1 THEN 'returned'
        ELSE 'borrowed'
      END
    `);

    // Thêm index cho pickup_code
    await queryInterface.addIndex("Loans", ["pickup_code"], {
      name: "idx_loans_pickup_code",
      unique: true,
    });

    // Thêm index cho status để tối ưu query
    await queryInterface.addIndex("Loans", ["status"], {
      name: "idx_loans_status",
    });
  },

  async down(queryInterface, Sequelize) {
    // Xóa indexes
    await queryInterface.removeIndex("Loans", "idx_loans_pickup_code");
    await queryInterface.removeIndex("Loans", "idx_loans_status");

    // Xóa các cột đã thêm
    await queryInterface.removeColumn("Loans", "status");
    await queryInterface.removeColumn("Loans", "pickup_code");
    await queryInterface.removeColumn("Loans", "request_date");
    await queryInterface.removeColumn("Loans", "hold_until");
    await queryInterface.removeColumn("Loans", "approved_date");
    await queryInterface.removeColumn("Loans", "approved_by");
    await queryInterface.removeColumn("Loans", "notes");
    await queryInterface.removeColumn("Loans", "rejection_reason");
  },
};
