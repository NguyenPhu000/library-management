import bookService from "../services/bookService.js";
import categoryService from "../services/categoryService.js";

const getCreateBooks = (req, res) => {
  res.render("partials/createBook");
};

const postCreateBooks = async (req, res) => {
  try {
    await bookService.createNewBooks(req);
    let data = await bookService.getAllBooks();
    let categories = await categoryService.getAllCategory();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ message: "Thêm sách thành công!" });
    }

    res.redirect("/api/books?successMessage=Thêm sách thành công!");
  } catch (error) {
    console.error("Lỗi khi tạo sách:", error);
    res.redirect(
      `/api/books?errorMessage=${encodeURIComponent(error.message)}`
    );
  }
};

const getDisplayBooks = async (req, res) => {
  try {
    let { criteria, query } = req.query;
    let books =
      criteria && query
        ? await bookService.searchBook({ criteria, query })
        : await bookService.getAllBooks();
    let categories = await categoryService.getAllCategory();

    if (req.headers.accept?.includes("application/json")) {
      return res.status(200).json({
        success: true,
        books,
      });
    }

    res.render("bookPage", {
      dataTable: books,
      categories,
      currentPage: "books",
      criteria: criteria || "",
      query: query || "",
      successMessage: req.query.successMessage || null,
      errorMessage: req.query.errorMessage || null,
    });
  } catch (error) {
    console.error("Lỗi khi hiển thị sách:", error);
    if (req.headers.accept?.includes("application/json")) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi tải danh sách sách",
        books: [],
      });
    }
    res.status(500).json({ lỗi: "Lỗi hệ thống, vui lòng thử lại!" });
  }
};

const updateBook = async (req, res) => {
  try {
    if (!req.body.book_id) {
      return res.status(400).json({ error: "Book ID is required!" });
    }

    await bookService.updateBook(req);
    let data = await bookService.getAllBooks();
    let categories = await categoryService.getAllCategory();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ message: "Cập nhật sách thành công!" });
    }

    res.redirect("/api/books?successMessage=Cập nhật sách thành công!");
  } catch (error) {
    console.error("Lỗi khi cập nhật sách:", error);
    res.redirect(
      `/api/books?errorMessage=${encodeURIComponent(error.message)}`
    );
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

const deleteBook = async (req, res) => {
  try {
    const bookId = req.query.book_id;
    await bookService.deleteBook(bookId);
    let data = await bookService.getAllBooks();
    let categories = await categoryService.getAllCategory();

    res.redirect("/api/books?successMessage=Xóa sách thành công!");
  } catch (error) {
    console.error("Lỗi khi xóa sách:", error);
    res.redirect(
      `/api/books?errorMessage=Không thể xóa sách: ${encodeURIComponent(
        error.message
      )}`
    );
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
  getCreateBooks,
  postCreateBooks,
  getDisplayBooks,
  getBookById,
  updateBook,
  deleteBook,
  getBookByCategory,
  searchBooks,
};
