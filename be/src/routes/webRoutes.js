import express from "express";
import homeRoutes from "./homeRoutes.js";
import userRoutes from "./userRoutes.js";
import bookRoutes from "./bookRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import memberRoutes from "./memberRoutes.js";
import authRoutes from "./authRoutes.js";
import loanRoutes from "./loanRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import adminRoutes from "./adminRoutes.js";
import authMiddleware from "../middlewares/authMiddleware.js";

let router = express.Router();

// Public routes (không yêu cầu đăng nhập)
router.use("/api", authRoutes);
router.use("/api", bookRoutes); // API sách là công khai
router.use("/api", categoryRoutes); // API danh mục là công khai
router.use("/api", homeRoutes);
router.use("/api", memberRoutes); // API member là công khai

// Các API route sau khi đã xác thực
router.use("/api", userRoutes);
router.use("/api", loanRoutes);
router.use("/api", paymentRoutes);

// Admin routes với middleware xác thực được tích hợp sẵn
router.use("/api", adminRoutes); // Mount tại /api để match với frontend

// Xử lý chuyển hướng đến frontend cho các route không phải API
router.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
  } else {
    res.redirect("/");
  }
});

const initWebRoutes = (app) => {
  app.use("/", router);
};

export default initWebRoutes;
