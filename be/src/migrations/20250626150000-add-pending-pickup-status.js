"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Thêm status "pending_pickup" vào enum của cột status trong bảng Loans
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
      ) NOT NULL DEFAULT 'requested'
    `);
  },

  async down(queryInterface, Sequelize) {
    // Xóa status "pending_pickup" khỏi enum
    await queryInterface.sequelize.query(`
      ALTER TABLE Loans 
      MODIFY COLUMN status ENUM(
        'requested', 
        'approved', 
        'rejected', 
        'borrowed', 
        'returned', 
        'overdue'
      ) NOT NULL DEFAULT 'requested'
    `);
  },
};
