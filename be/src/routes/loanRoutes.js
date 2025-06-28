import express from "express";
import loanController from "../controllers/loanController.js";

const router = express.Router();

// === MEMBER ROUTES ===
// Member yêu cầu mượn sách
router.post("/request/:memberId/:bookId", loanController.requestBook);

// Member yêu cầu gia hạn
router.post("/renewal/request", loanController.requestRenewal);

// Member lấy sách đang mượn
router.get("/member/:memberId/current", loanController.getMemberCurrentLoans);

// Member lấy lịch sử mượn sách
router.get("/member/:memberId/history", loanController.getMemberLoanHistory);

// === PICKUP CODE ROUTES (NEW WORKFLOW) ===
// Admin xác thực pickup code
router.post("/admin/validate-pickup-code", loanController.validatePickupCode);

// Admin xác nhận đưa sách cho member bằng pickup code
router.post(
  "/admin/confirm-pickup-with-code",
  loanController.confirmPickupWithCode
);

// === ADMIN ROUTES (TRADITIONAL WORKFLOW) ===
// Admin lấy danh sách yêu cầu mượn chờ duyệt
router.get("/admin/pending-requests", loanController.getPendingRequests);

// Admin duyệt yêu cầu mượn sách
router.post("/admin/approve-request", loanController.approveBookRequest);

// Admin từ chối yêu cầu mượn sách
router.post("/admin/reject-request", loanController.rejectBookRequest);

// Admin lấy danh sách sách đã duyệt chờ nhận
router.get("/admin/approved", loanController.getApprovedLoans);

// Admin xác nhận member nhận sách
router.post("/admin/confirm-pickup", loanController.confirmBookPickup);

// Admin lấy danh sách sách đang mượn
router.get("/admin/current", loanController.getCurrentLoansAdmin);

// Admin lấy danh sách sách quá hạn
router.get("/admin/overdue", loanController.getOverdueLoans);

// Admin xác nhận trả sách
router.post("/admin/confirm-return", loanController.confirmBookReturn);

// Admin lấy danh sách yêu cầu gia hạn chờ duyệt
router.get("/admin/pending-renewals", loanController.getPendingRenewals);

// Admin duyệt gia hạn
router.post("/admin/approve-renewal", loanController.approveRenewal);

// Admin từ chối gia hạn
router.post("/admin/reject-renewal", loanController.rejectRenewal);

// === STATISTICS ROUTES ===
// Admin lấy thống kê tổng quan
router.get("/admin/statistics", loanController.getLoanStatistics);

// === LEGACY ROUTES (for backward compatibility) ===
// Danh sách tất cả loans
router.get("/", loanController.listLoans);
router.get("/all", loanController.getAllLoans);

// Deprecated routes
router.post("/borrow/:memberId/:bookId", loanController.borrowBook); // Deprecated
router.post("/return", loanController.returnBook); // Deprecated
router.get("/current/:memberId", loanController.getCurrentLoans); // Deprecated
router.get("/history/:memberId", loanController.getLoanHistory); // Deprecated

// Legacy renewal routes
router.post("/renew", loanController.requestRenewLoan); // Deprecated
router.post("/approve-renew", loanController.approveRenewLoan); // Deprecated
router.post("/reject-renew", loanController.rejectRenewLoan); // Deprecated

// Utility routes
router.get("/book/:bookId", loanController.getLoanByBookId);
router.get("/stats", loanController.getLoanStats);

export default router;
