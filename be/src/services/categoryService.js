import db from "../models/index";

// Lấy tất cả danh mục
let getAllCategory = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let categories = db.Category.findAll({
        raw: true,
      });
      resolve(categories);
    } catch (error) {
      console.log(error);
    }
  });
};

// Tạo danh mục mới
let createNewCategory = async (categoryData) => {
  try {
    if (!categoryData.name || categoryData.name.trim() === "") {
      throw new Error("Category name cannot be empty!");
    }

    const newCategory = await db.Category.create({
      name: categoryData.name.trim(),
      description: categoryData.description,
    });

    return newCategory;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

// Cập nhật danh mục
let updateCategory = async (categoryId, categoryData) => {
  if (!categoryId) {
    throw new Error("Category ID is missing!");
  }

  try {
    const category = await db.Category.findOne({
      where: { category_id: categoryId },
    });
    if (!category) throw new Error("Category not found!");

    await db.Category.update(
      {
        name: categoryData.name,
        description: categoryData.description,
      },
      { where: { category_id: categoryId } }
    );

    return "Category updated successfully!";
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Xóa danh mục
let deleteCategory = async (categoryId) => {
  try {
    const result = await db.Category.destroy({
      where: { category_id: categoryId },
    });

    if (!result) {
      throw new Error(
        `Category with ID ${categoryId} not found or couldn't be deleted`
      );
    }

    return { success: true, message: "Category deleted successfully" };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAllCategory,
  createNewCategory,
  updateCategory,
  deleteCategory,
};
