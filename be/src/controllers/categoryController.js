import categoryService from "../services/categoryService.js";

// GET /api/category và GET /api/admin/categories
const listCategories = async (_req, res) => {
  try {
    const categories = await categoryService.getAllCategory();
    return res.json({
      success: true,
      categories: categories,
      data: categories, // Thêm field data để tương thích với frontend
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh mục:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/category (create new) và POST /api/admin/categories
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    await categoryService.createNewCategory({ name, description });
    return res.json({ success: true, message: "Tạo danh mục thành công!" });
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/category/update
const updateCategory = async (req, res) => {
  try {
    const { category_id, name, description } = req.body;
    if (!category_id) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }
    await categoryService.updateCategory(category_id, { name, description });
    return res.json({
      success: true,
      message: "Cập nhật danh mục thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/category/delete
const deleteCategory = async (req, res) => {
  try {
    const { category_id } = req.body;
    if (!category_id) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }
    await categoryService.deleteCategory(category_id);
    return res.json({ success: true, message: "Xóa danh mục thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// RESTful PUT /admin/categories/:id
const updateCategoryRESTful = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, description } = req.body;

    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }

    await categoryService.updateCategory(categoryId, { name, description });
    return res.json({
      success: true,
      message: "Cập nhật danh mục thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// RESTful DELETE /admin/categories/:id
const deleteCategoryRESTful = async (req, res) => {
  try {
    const categoryId = req.params.id;

    if (!categoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Category ID is required" });
    }

    await categoryService.deleteCategory(categoryId);
    return res.json({ success: true, message: "Xóa danh mục thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa danh mục:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryRESTful,
  deleteCategoryRESTful,
};
