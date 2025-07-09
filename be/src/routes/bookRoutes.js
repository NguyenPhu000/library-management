import express from "express";
import bookController from "../controllers/bookController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// Admin Book routes (cần xác thực admin)
router.get(
  "/admin/books",
  authMiddleware.verifyAdmin,
  bookController.listBooks
);

// Thống kê sách cho dashboard (totalBooks, topBooks, ...)
router.get(
  "/admin/books/stats",
  authMiddleware.verifyAdmin,
  bookController.getBookStats
);

router.post(
  "/admin/books",
  authMiddleware.verifyAdmin,
  upload.single("cover_image"),
  bookController.createBook
);
router.post(
  "/admin/books/update",
  authMiddleware.verifyAdmin,
  upload.single("cover_image"),
  bookController.updateBook
);
router.post(
  "/admin/books/delete",
  authMiddleware.verifyAdmin,
  bookController.deleteBook
);

// Book routes công khai
router.get("/books", bookController.listBooks);
router.post("/books", upload.single("cover_image"), bookController.createBook);
router.post(
  "/books/update",
  upload.single("cover_image"),
  bookController.updateBook
);
router.post("/books/delete", bookController.deleteBook);

router.get("/books/:bookId", bookController.getBookById);
router.get("/books/category/:categoryId", bookController.getBookByCategory);

export default router;
