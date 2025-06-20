import bookService from "../services/bookService.js";

// GET /api/books
const listBooks = async (req, res) => {
  try {
    const { criteria, query } = req.query;
    const books =
      criteria && query
        ? await bookService.searchBook({ criteria, query })
        : await bookService.getAllBooks();

    return res.json({ success: true, books });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/books (create new)
const createBook = async (req, res) => {
  try {
    await bookService.createNewBooks(req);
    return res.json({ success: true, message: "Thêm sách thành công!" });
  } catch (error) {
    console.error("Lỗi khi tạo sách:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/books/update
const updateBook = async (req, res) => {
  try {
    if (!req.body.book_id)
      return res
        .status(400)
        .json({ success: false, message: "Book ID is required" });

    await bookService.updateBook(req);
    return res.json({ success: true, message: "Cập nhật thành công!" });
  } catch (error) {
    console.error("Lỗi khi cập nhật sách:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/books/delete
const deleteBook = async (req, res) => {
  try {
    const { book_id } = req.body;
    if (!book_id)
      return res
        .status(400)
        .json({ success: false, message: "Book ID is required" });

    await bookService.deleteBook(book_id);
    return res.json({ success: true, message: "Xóa sách thành công!" });
  } catch (error) {
    console.error("Lỗi khi xóa sách:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let book = await bookService.getBookById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Sách không tồn tại!",
        book: null,
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Lỗi khi lấy sách!!!:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      book: null,
    });
  }
};

const getBookByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu categoryId!",
        books: [],
      });
    }

    let books = await bookService.getBookByCategory(categoryId);

    if (books.length === 0) {
      return res.status(200).json({
        success: true,
        books: [],
        message: "Không có sách nào trong danh mục này!",
      });
    }

    return res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    console.error(" Lỗi khi lấy sách theo danh mục:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      books: [],
    });
  }
};

const searchBooks = async (req, res) => {
  try {
    let filters = {
      criteria: req.query.criteria,
      query: req.query.query,
    };
    let books = await bookService.searchBook(filters);

    return res.status(200).json({
      success: true,
      books,
    });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sách:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
      books: [],
    });
  }
};

export default {
  listBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookById,
  getBookByCategory,
  searchBooks,
};
