import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";
import bookController from "../controllers/bookController.js";
import categoryController from "../controllers/categoryController.js";
import upload from "../config/multerConfig.js";

let router = express.Router();

// Route API cho admin (có kiểm tra xác thực admin)
// Thống kê & Dashboard
router.get(
  "/api/admin/stats",
  authMiddleware.verifyAdmin,
  adminController.getAdminStats
);

// Quản lý User (từ admin) - đặt trước admin routes để tránh conflict
router.get(
  "/api/admin/users",
  authMiddleware.verifyAdmin,
  userController.listUsers
);

router.get(
  "/api/admin/users/stats",
  authMiddleware.verifyAdmin,
  userController.getUserStats
);

router.get(
  "/api/admin/users/:id",
  authMiddleware.verifyAdmin,
  userController.getUserById
);

router.post(
  "/api/admin/users/create",
  authMiddleware.verifyAdmin,
  userController.createUser
);

router.post(
  "/api/admin/users/update",
  authMiddleware.verifyAdmin,
  userController.updateUser
);

router.post(
  "/api/admin/users/delete",
  authMiddleware.verifyAdmin,
  userController.deleteUser
);

router.post(
  "/api/admin/users/toggle-active",
  authMiddleware.verifyAdmin,
  userController.toggleActive
);

router.post(
  "/api/admin/users/sync",
  authMiddleware.verifyAdmin,
  userController.syncUsers
);

// Quản lý Admin - đặt sau user routes để tránh conflict
router.get(
  "/api/admin/list",
  authMiddleware.verifyAdmin,
  adminController.getAllAdmins
);

router.post(
  "/api/admin/update",
  authMiddleware.verifyAdmin,
  adminController.updateAdmin
);

router.post(
  "/api/admin/sync",
  authMiddleware.verifyAdmin,
  adminController.syncAdmin
);

router.get(
  "/api/admin/:id",
  authMiddleware.verifyAdmin,
  adminController.getAdminById
);

router.delete(
  "/api/admin/:id",
  authMiddleware.verifyAdmin,
  adminController.deleteAdmin
);

// Quản lý Book (từ admin)
router.get(
  "/api/admin/books",
  authMiddleware.verifyAdmin,
  bookController.listBooks
);

router.post(
  "/api/admin/books",
  authMiddleware.verifyAdmin,
  upload.single("cover_image"),
  bookController.createBook
);

router.post(
  "/api/admin/books/update",
  authMiddleware.verifyAdmin,
  upload.single("cover_image"),
  bookController.updateBook
);

router.post(
  "/api/admin/books/delete",
  authMiddleware.verifyAdmin,
  bookController.deleteBook
);

// Quản lý Category (từ admin)
router.get(
  "/api/admin/categories",
  authMiddleware.verifyAdmin,
  categoryController.listCategories
);

router.post(
  "/api/admin/categories",
  authMiddleware.verifyAdmin,
  categoryController.createCategory
);

router.post(
  "/api/admin/categories/update",
  authMiddleware.verifyAdmin,
  categoryController.updateCategory
);

router.post(
  "/api/admin/categories/delete",
  authMiddleware.verifyAdmin,
  categoryController.deleteCategory
);

// Route cho admin frontend, chuyển hướng đến React admin
router.get("/admin*", (req, res) => {
  res.redirect("/");
});

export default router;
