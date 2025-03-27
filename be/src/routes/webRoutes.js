import express from "express";
import homeRoutes from "./homeRoutes.js";
import userRoutes from "./userRoutes.js";
import bookRoutes from "./bookRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import adminRoutes from "./adminRoutes.js";
import memberRoutes from "./memberRoutes.js";
import authRoutes from "./authRoutes.js";
import loanRoutes from "./loanRoutes.js";
import paymentRoutes from "./paymentRoutes.js";
import authMiddleware from "../middlewares/authMiddleware.js";
let router = express.Router();

router.use("/api", authRoutes);

router.use(authMiddleware);

router.use("/api", homeRoutes);
router.use("/api", userRoutes);
router.use("/api", bookRoutes);
router.use("/api", categoryRoutes);
router.use("/api", adminRoutes);
router.use("/api", memberRoutes);
router.use("/api", loanRoutes);
router.use("/api", paymentRoutes);
const initWebRoutes = (app) => {
  app.use("/", router);
};

export default initWebRoutes;
