import express from "express";
import loanController from "../controllers/loanController.js";

const router = express.Router();

// Route mượn sách
router.get("/loans", loanController.getAllLoans);

router.post("/loans/return", loanController.returnBook);

router.post("/loans/request-renew", loanController.requestRenewLoan);

router.post("/loans/approve-renew", loanController.approveRenewLoan);

router.get("/loans/current/:memberId", loanController.getCurrentLoans);

router.post(
  "/loans/borrow/members/:memberId/books/:bookId",
  loanController.borrowBook
);

router.get("/loans/history/:memberId", loanController.getLoanHistory);

export default router;
