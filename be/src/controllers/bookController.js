import bookService from "../services/bookService.js";

// GET /api/books và /api/admin/books
const listBooks = async (req, res) => {
  try {
    const { criteria, query, page = 1, limit = 10 } = req.query;

    // Lấy danh sách sách
    let books =
      criteria && query
        ? await bookService.searchBook({ criteria, query })
        : await bookService.getAllBooks();

    // Kiểm tra nếu là admin route (có pagination)
    const isAdminRoute = req.path.includes("/admin/");

    if (isAdminRoute) {
      // Admin route: trả về format với pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + parseInt(limit);
      const paginatedBooks = books.slice(startIndex, endIndex);
      const totalPages = Math.ceil(books.length / limit);

      return res.json({
        success: true,
        data: paginatedBooks, // Admin frontend expect 'data'
        totalPages,
        currentPage: parseInt(page),
        totalItems: books.length,
      });
    } else {
      // Public route: trả về format cũ
      return res.json({ success: true, books });
    }
  } catch (error) {
    console.error("Lỗi khi lấy danh sách sách:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

// POST /api/books và /api/admin/books (create new)
const createBook = async (req, res) => {
  try {
    const result = await bookService.createNewBooks(req);

    // Kiểm tra nếu là admin route
    const isAdminRoute = req.path.includes("/admin/");

    if (isAdminRoute) {
      return res.json({
        success: true,
        message: "Thêm sách thành công!",
        data: result, // Return the created book data for admin
      });
    } else {
      return res.json({ success: true, message: "Thêm sách thành công!" });
    }
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

// GET /api/admin/books/stats - Lấy thống kê sách cho dashboard
const getBookStats = async (req, res) => {
  try {
    const stats = await bookService.getBookStats();
    return res.json({ success: true, data: stats });
  } catch (error) {
    console.error("Lỗi khi lấy thống kê sách:", error);
    return res
      .status(500)
      .json({ success: false, message: error.message, data: null });
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
  getBookStats,
};
