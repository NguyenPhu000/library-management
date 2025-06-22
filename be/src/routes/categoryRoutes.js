import express from "express";
import categoryController from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin Category routes (cần xác thực admin)
router.get(
  "/admin/categories",
  authMiddleware.verifyAdmin,
  categoryController.listCategories
);
router.post(
  "/admin/categories",
  authMiddleware.verifyAdmin,
  categoryController.createCategory
);
router.put(
  "/admin/categories/:id",
  authMiddleware.verifyAdmin,
  categoryController.updateCategoryRESTful
);
router.delete(
  "/admin/categories/:id",
  authMiddleware.verifyAdmin,
  categoryController.deleteCategoryRESTful
);

// Legacy POST routes for backward compatibility
router.post(
  "/admin/categories/update",
  authMiddleware.verifyAdmin,
  categoryController.updateCategory
);
router.post(
  "/admin/categories/delete",
  authMiddleware.verifyAdmin,
  categoryController.deleteCategory
);

// Category routes công khai
router.get("/category", categoryController.listCategories);
router.post("/category", categoryController.createCategory);
router.post("/category/update", categoryController.updateCategory);
router.post("/category/delete", categoryController.deleteCategory);

export default router;
