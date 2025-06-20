import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import userController from "../controllers/userController.js";
import bookController from "../controllers/bookController.js";
import categoryController from "../controllers/categoryController.js";

let router = express.Router();

// Route API cho admin (có kiểm tra xác thực admin)
// Thống kê & Dashboard
router.get(
  "/api/admin/stats",
  authMiddleware.verifyAdmin,
  adminController.getAdminStats
);

// Quản lý Admin
router.get(
  "/api/admin/list",
  authMiddleware.verifyAdmin,
  adminController.getAllAdmins
);

router.get(
  "/api/admin/:id",
  authMiddleware.verifyAdmin,
  adminController.getAdminById
);

router.post(
  "/api/admin/update",
  authMiddleware.verifyAdmin,
  adminController.updateAdmin
);

router.delete(
  "/api/admin/:id",
  authMiddleware.verifyAdmin,
  adminController.deleteAdmin
);

router.post(
  "/api/admin/sync",
  authMiddleware.verifyAdmin,
  adminController.syncAdmin
);

// Quản lý User (từ admin)
router.get(
  "/api/admin/users",
  authMiddleware.verifyAdmin,
  userController.getDisplayUser
);

router.post(
  "/api/admin/users",
  authMiddleware.verifyAdmin,
  userController.postCreateUser
);

router.put(
  "/api/admin/users/:id",
  authMiddleware.verifyAdmin,
  userController.updateUser
);

router.delete(
  "/api/admin/users/:id",
  authMiddleware.verifyAdmin,
  userController.deleteUser
);

// Quản lý Book (từ admin)
router.get(
  "/api/admin/books",
  authMiddleware.verifyAdmin,
  bookController.getDisplayBooks
);

router.post(
  "/api/admin/books",
  authMiddleware.verifyAdmin,
  bookController.postCreateBooks
);

router.put(
  "/api/admin/books/:id",
  authMiddleware.verifyAdmin,
  bookController.updateBook
);

router.delete(
  "/api/admin/books/:id",
  authMiddleware.verifyAdmin,
  bookController.deleteBook
);

// Quản lý Category (từ admin)
router.get(
  "/api/admin/categories",
  authMiddleware.verifyAdmin,
  categoryController.displayCategory
);

router.post(
  "/api/admin/categories",
  authMiddleware.verifyAdmin,
  categoryController.createCategory
);

router.put(
  "/api/admin/categories/:id",
  authMiddleware.verifyAdmin,
  categoryController.updateCategory
);

router.delete(
  "/api/admin/categories/:id",
  authMiddleware.verifyAdmin,
  categoryController.deleteCategory
);

// Route cho admin frontend, chuyển hướng đến React admin
router.get("/admin*", (req, res) => {
  res.redirect("/");
});

export default router;
