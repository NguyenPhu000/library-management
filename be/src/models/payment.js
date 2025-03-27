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
      amount: DataTypes.DECIMAL,
      payment_date: DataTypes.DATE,
      payment_method: DataTypes.STRING,
      status: DataTypes.STRING,
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
