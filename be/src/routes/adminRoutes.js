import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";

let router = express.Router();

// Route API cho admin (có kiểm tra xác thực admin)
// Thống kê & Dashboard
router.get(
  "/admin/stats",
  authMiddleware.verifySuperAdmin,
  adminController.getAdminStats
);

// Admin management routes (quản lý admin) - RESTful API (đặt TRƯỚC route param để tránh nhầm path)
router.get(
  "/admin/admins",
  authMiddleware.verifySuperAdmin,
  adminController.getAllAdmins
);
router.post(
  "/admin/admins",
  authMiddleware.verifySuperAdmin,
  adminController.updateAdmin
);
router.put(
  "/admin/admins/:id",
  authMiddleware.verifySuperAdmin,
  adminController.updateAdmin
);
router.delete(
  "/admin/admins/:id",
  authMiddleware.verifySuperAdmin,
  adminController.deleteAdmin
);
router.post(
  "/admin/admins/sync",
  authMiddleware.verifySuperAdmin,
  adminController.syncAdmin
);

// Quản lý Admin đơn lẻ
router.get(
  "/admin/:id",
  authMiddleware.verifySuperAdmin,
  adminController.getAdminById
);
router.delete(
  "/admin/:id",
  authMiddleware.verifySuperAdmin,
  adminController.deleteAdmin
);

// Route cho admin frontend, chuyển hướng đến React admin
router.get("/admin*", (req, res) => {
  res.redirect("/");
});

export default router;
