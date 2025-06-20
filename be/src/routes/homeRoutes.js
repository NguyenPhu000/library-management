import express from "express";
import homeController from "../controllers/homeController.js";

const router = express.Router();
// Dashboard data (GET /api/dashboard)
router.get("/dashboard", homeController.getDashboard);

export default router;
