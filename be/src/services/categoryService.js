import db from "../models/index";

// Lấy tất cả danh mục với số lượng sách
let getAllCategory = async () => {
  try {
    // Thử query với count trước
    let categories = await db.Category.findAll({
      include: [
        {
          model: db.BookCategory,
          as: "bookCategories",
          attributes: [],
        },
      ],
      attributes: [
        "category_id",
        "name",
        "description",
        "created_at",
        "updated_at",
        [
          db.sequelize.fn("COUNT", db.sequelize.col("bookCategories.book_id")),
          "bookCount",
        ],
      ],
      group: ["Category.category_id"],
      raw: true,
    });
    return categories;
  } catch (error) {
    console.log("Error with count query, falling back to simple query:", error);
    // Fallback: query đơn giản không có count
    try {
      let categories = await db.Category.findAll({
        attributes: [
          "category_id",
          "name",
          "description",
          "created_at",
          "updated_at",
        ],
        raw: true,
      });

      // Thêm bookCount = 0 cho tất cả
      categories = categories.map((cat) => ({
        ...cat,
        bookCount: 0,
      }));

      return categories;
    } catch (fallbackError) {
      console.log("Error in fallback query:", fallbackError);
      throw fallbackError;
    }
  }
};

// Tạo danh mục mới
let createNewCategory = async (categoryData) => {
  try {
    // Validate name
    if (!categoryData.name || categoryData.name.trim() === "") {
      throw new Error("Tên danh mục không được để trống");
    }

    const trimmedName = categoryData.name.trim();

    if (trimmedName.length < 2) {
      throw new Error("Tên danh mục phải có ít nhất 2 ký tự");
    }

    if (trimmedName.length > 100) {
      throw new Error("Tên danh mục không được quá 100 ký tự");
    }

    // Check duplicate name
    const existingCategory = await db.Category.findOne({
      where: { name: trimmedName },
    });

    if (existingCategory) {
      throw new Error("Tên danh mục đã tồn tại");
    }

    // Validate description
    const trimmedDescription = categoryData.description?.trim() || "";
    if (trimmedDescription.length > 500) {
      throw new Error("Mô tả không được quá 500 ký tự");
    }

    const newCategory = await db.Category.create({
      name: trimmedName,
      description: trimmedDescription,
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
    if (!category) throw new Error("Danh mục không tồn tại!");

    // Validate name
    if (!categoryData.name || categoryData.name.trim() === "") {
      throw new Error("Tên danh mục không được để trống");
    }

    const trimmedName = categoryData.name.trim();

    if (trimmedName.length < 2) {
      throw new Error("Tên danh mục phải có ít nhất 2 ký tự");
    }

    if (trimmedName.length > 100) {
      throw new Error("Tên danh mục không được quá 100 ký tự");
    }

    // Check duplicate name (exclude current category)
    const existingCategory = await db.Category.findOne({
      where: {
        name: trimmedName,
        category_id: { [db.Sequelize.Op.ne]: categoryId },
      },
    });

    if (existingCategory) {
      throw new Error("Tên danh mục đã tồn tại");
    }

    // Validate description
    const trimmedDescription = categoryData.description?.trim() || "";
    if (trimmedDescription.length > 500) {
      throw new Error("Mô tả không được quá 500 ký tự");
    }

    await db.Category.update(
      {
        name: trimmedName,
        description: trimmedDescription,
      },
      { where: { category_id: categoryId } }
    );

    return "Cập nhật danh mục thành công!";
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

// Xóa danh mục
let deleteCategory = async (categoryId) => {
  try {
    // Check if category exists
    const category = await db.Category.findOne({
      where: { category_id: categoryId },
    });

    if (!category) {
      throw new Error("Danh mục không tồn tại");
    }

    // Check if category has books
    const bookCount = await db.BookCategory.count({
      where: { category_id: categoryId },
    });

    if (bookCount > 0) {
      throw new Error(
        `Không thể xóa danh mục "${category.name}" vì có ${bookCount} cuốn sách thuộc danh mục này. Vui lòng xóa sách trước khi xóa danh mục.`
      );
    }

    const result = await db.Category.destroy({
      where: { category_id: categoryId },
    });

    if (!result) {
      throw new Error("Không thể xóa danh mục");
    }

    return { success: true, message: "Xóa danh mục thành công" };
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
