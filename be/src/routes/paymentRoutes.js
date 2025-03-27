import express from "express";
import paymentController from "../controllers/paymentController";

const router = express.Router();

// Route để lấy danh sách thanh toán
router.get("/payments", paymentController.getAllPayments);

// Route để tạo thanh toán mới
router.post(
  "/payments/create/:loanId/:userId/:memberId",
  paymentController.createPayment
);

// // Route để xác nhận thanh toán
// router.post("/payments/confirm", handleConfirmPayment);

//  Route để lấy danh sách thanh toán theo member_id
router.get(
  "/payments/memberId/:memberId",
  paymentController.getPaymentsByMemberId
);

export default router;
