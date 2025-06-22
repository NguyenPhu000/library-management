"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // N-N với Book thông qua BookCategory
      Category.belongsToMany(models.Book, {
        through: models.BookCategory,
        foreignKey: "category_id",
        otherKey: "book_id",
        as: "books",
      });

      // 1-N với BookCategory để đếm số sách
      Category.hasMany(models.BookCategory, {
        foreignKey: "category_id",
        as: "bookCategories",
      });
    }
  }
  Category.init(
    {
      category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "Categories",
      timestamps: false,
    }
  );
  return Category;
};
