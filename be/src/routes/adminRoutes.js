import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";

let router = express.Router();

// Route API cho admin (có kiểm tra xác thực admin)
// Thống kê & Dashboard
router.get(
  "/admin/stats",
  authMiddleware.verifyAdmin,
  adminController.getAdminStats
);

// Quản lý Admin
router.get(
  "/admin/list",
  authMiddleware.verifyAdmin,
  adminController.getAllAdmins
);

router.post(
  "/admin/update",
  authMiddleware.verifyAdmin,
  adminController.updateAdmin
);

router.post(
  "/admin/sync",
  authMiddleware.verifyAdmin,
  adminController.syncAdmin
);

router.get(
  "/admin/:id",
  authMiddleware.verifyAdmin,
  adminController.getAdminById
);

router.delete(
  "/admin/:id",
  authMiddleware.verifyAdmin,
  adminController.deleteAdmin
);

// Route cho admin frontend, chuyển hướng đến React admin
router.get("/admin*", (req, res) => {
  res.redirect("/");
});

// Admin management routes (quản lý admin) - RESTful API
router.get(
  "/admin/admins",
  authMiddleware.verifyAdmin,
  adminController.getAllAdmins
);
router.post(
  "/admin/admins",
  authMiddleware.verifyAdmin,
  adminController.updateAdmin
);
router.put(
  "/admin/admins/:id",
  authMiddleware.verifyAdmin,
  adminController.updateAdmin
);
router.delete(
  "/admin/admins/:id",
  authMiddleware.verifyAdmin,
  adminController.deleteAdmin
);
router.post(
  "/admin/admins/sync",
  authMiddleware.verifyAdmin,
  adminController.syncAdmin
);

// Book management được xử lý trong bookRoutes.js
// Routes: GET /api/admin/books, POST /api/admin/books, POST /api/admin/books/update, POST /api/admin/books/delete

export default router;
