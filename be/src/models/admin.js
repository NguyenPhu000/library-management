"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      // Admin thuộc về 1 user
      Admin.belongsTo(models.User, {
        foreignKey: "user_id",
      });
    }
  }
  Admin.init(
    {
      admin_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: DataTypes.INTEGER,
      department: DataTypes.STRING,
      admin_type: {
        type: DataTypes.ENUM("admin", "librarian"),
        defaultValue: "librarian",
      },
      created_at: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updated_at: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {
      sequelize,
      modelName: "Admin",
      tableName: "Admins",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Admin;
};
