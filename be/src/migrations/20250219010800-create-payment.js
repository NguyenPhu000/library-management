"use strict";
/**
 * Tạo bảng payment
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Payments", {
      payment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      loan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      member_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      payment_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      payment_method: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "CASH",
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: "PENDING",
      },
    });

    // Thêm FK
    await queryInterface.addConstraint("Payments", {
      fields: ["loan_id"],
      type: "foreign key",
      name: "fk_payment_loanid",
      references: {
        table: "Loans",
        field: "loan_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Payments", {
      fields: ["user_id"],
      type: "foreign key",
      name: "fk_payment_userid",
      references: {
        table: "Users",
        field: "user_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });

    await queryInterface.addConstraint("Payments", {
      fields: ["member_id"],
      type: "foreign key",
      name: "fk_payment_memberid",
      references: {
        table: "Members",
        field: "member_id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Payments");
  },
};
