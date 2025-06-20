import express from "express";
import bookController from "../controllers/bookController.js";
import upload from "../config/multerConfig.js";

const router = express.Router();

// GET  /api/books   → danh sách sách (with optional query params)
router.get("/books", bookController.listBooks);

// POST /api/books   → tạo sách mới (multipart)
router.post("/books", upload.single("cover_image"), bookController.createBook);

// POST /api/books/update   → cập nhật sách
router.post(
  "/books/update",
  upload.single("cover_image"),
  bookController.updateBook
);

// POST /api/books/delete   → xoá sách
router.post("/books/delete", bookController.deleteBook);

router.get("/books/:bookId", bookController.getBookById);
router.get("/books/category/:categoryId", bookController.getBookByCategory);

export default router;
