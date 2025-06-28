"use strict";
/**
 * Tạo bảng loan
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Loans", {
      loan_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      member_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      book_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      loan_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      return_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      returned: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      fine_amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      renew_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      renewal_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "none", // none, pending, approved, rejected
      },
    });

    // Thêm FK
    await queryInterface.addConstraint("Loans", {
      fields: ["member_id"],
      type: "foreign key",
      name: "fk_loan_memberid",
      references: {
        table: "Members",
        field: "member_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Loans", {
      fields: ["book_id"],
      type: "foreign key",
      name: "fk_loan_bookid",
      references: {
        table: "Books",
        field: "book_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Loans");
  },
};
