"use strict";

/**
 * Migration: Thêm 'cancelled' vào enum status của Loans
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm 'cancelled' vào enum status
    await queryInterface.sequelize.query(`
      ALTER TABLE Loans 
      MODIFY COLUMN status ENUM(
        'requested',
        'approved', 
        'pending_pickup',
        'rejected',
        'borrowed',
        'returned',
        'overdue',
        'cancelled'
      ) NOT NULL DEFAULT 'requested';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Xóa 'cancelled' khỏi enum status
    await queryInterface.sequelize.query(`
      ALTER TABLE Loans 
      MODIFY COLUMN status ENUM(
        'requested',
        'approved',
        'pending_pickup', 
        'rejected',
        'borrowed',
        'returned',
        'overdue'
      ) NOT NULL DEFAULT 'requested';
    `);
  },
};
