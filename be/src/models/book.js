"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    static associate(models) {
      // 1 book có nhiều loan
      Book.hasMany(models.Loan, {
        foreignKey: "book_id",
      });
      // N-N với Category thông qua BookCategory
      Book.belongsToMany(models.Category, {
        through: models.BookCategory,
        foreignKey: "book_id",
        otherKey: "category_id",
        as: "categories",
      });
    }
  }
  Book.init(
    {
      book_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      isbn: DataTypes.STRING,
      title: DataTypes.STRING,
      author: DataTypes.STRING,
      publication_year: DataTypes.INTEGER,
      publisher: DataTypes.STRING,
      total_copies: DataTypes.INTEGER,
      available_copies: DataTypes.INTEGER,
      status: DataTypes.STRING,
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      cover_image: {
        type: DataTypes.TEXT("long"),
        allowNull: true,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Book",
      tableName: "Books",
      timestamps: true,
      underscored: true,
    }
  );
  return Book;
};
