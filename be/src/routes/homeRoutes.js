import express from "express";
import homeController from "../controllers/homeController.js";

const router = express.Router();
// home route
router.get("/", homeController.getHomePage);

export default router;
