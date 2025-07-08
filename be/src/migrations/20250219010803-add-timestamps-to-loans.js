"use strict";

/**
 * Migration: Thêm timestamps (createdAt, updatedAt) vào bảng Loans
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Loans", "createdAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    });

    await queryInterface.addColumn("Loans", "updatedAt", {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
      ),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Loans", "createdAt");
    await queryInterface.removeColumn("Loans", "updatedAt");
  },
};
