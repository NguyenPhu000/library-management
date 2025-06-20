import express from "express";
import adminController from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

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

// Route cho admin frontend, chuyển hướng đến React admin
router.get("/admin*", (req, res) => {
  res.redirect("/");
});

export default router;
