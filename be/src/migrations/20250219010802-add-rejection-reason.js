"use strict";

/**
 * Migration: Thêm cột rejection_reason vào bảng Loans
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Loans", "rejection_reason", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Loans", "rejection_reason");
  },
};
