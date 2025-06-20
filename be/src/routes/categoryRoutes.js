import express from "express";
import categoryController from "../controllers/categoryController.js";

const router = express.Router();

// GET  /api/category   → danh sách
router.get("/category", categoryController.listCategories);

// POST /api/category  → tạo mới
router.post("/category", categoryController.createCategory);

// POST /api/category/update  → cập nhật
router.post("/category/update", categoryController.updateCategory);

// POST /api/category/delete  → xoá
router.post("/category/delete", categoryController.deleteCategory);

export default router;
