import express from "express";
import authController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// EJS routes (backward compatibility)
router.get("/login", authController.showLogin);
router.get("/register", authController.showRegister);

// API routes cho cả EJS và React
router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/logout", authController.logout);

// API route yêu cầu xác thực
router.get("/me", authMiddleware.verifyToken, authController.getCurrentUser);

export default router;
