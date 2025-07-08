import express from "express";
import paymentController from "../controllers/paymentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { isTestMode } from "../config/testConfig.js";

const router = express.Router();

// Route dành cho admin (có kiểm tra quyền admin)
router.get(
  "/admin/payments",
  authMiddleware.verifyAdmin,
  paymentController.getAllPayments
);
router.patch(
  "/admin/payments/:paymentId/confirm",
  authMiddleware.verifyAdmin,
  paymentController.confirmPayment
);
router.patch(
  "/admin/payments/:paymentId/cancel",
  authMiddleware.verifyAdmin,
  paymentController.cancelPayment
);
router.delete(
  "/admin/payments/:paymentId",
  authMiddleware.verifyAdmin,
  paymentController.deletePayment
);
router.get(
  "/admin/payments/stats",
  authMiddleware.verifyAdmin,
  paymentController.getPaymentStats
);
router.get(
  "/admin/payments/income-report",
  authMiddleware.verifyAdmin,
  paymentController.generateIncomeReport
);

// Route để lấy danh sách thanh toán
router.get("/payments", paymentController.getAllPayments);

// Route để tạo thanh toán mới (với QR code support)
router.post("/payments/create", paymentController.createPayment);

// Route để xác nhận thanh toán
router.post("/payments/confirm", paymentController.confirmPayment);

// Route để lấy danh sách thanh toán theo member_id
router.get(
  "/payments/memberId/:memberId",
  paymentController.getPaymentsByMemberId
);

// Route để lấy payment theo ID
router.get("/payments/:paymentId", paymentController.getPaymentById);

// Test webhook endpoint (chỉ hoạt động trong test mode)
router.post(
  "/webhook-test",
  (req, res, next) => {
    if (!isTestMode()) {
      return res
        .status(404)
        .json({ success: false, message: "Endpoint not found" });
    }
    next();
  },
  paymentController.handleTestWebhook
);

// Webhook production endpoint (luôn bật)
router.post("/webhook", paymentController.handleWebhook);

export default router;
