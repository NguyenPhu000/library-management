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

    res.render("bookPage", {
      dataTable: data,
      categories,
      currentPage: "books",
      criteria: req.query.criteria || "",
      query: req.query.query || "",
    });
  } catch (error) {
    console.error("Lỗi khi tạo sách:", error);
    res
      .status(500)
      .json({ error: "Có lỗi xảy ra khi tạo sách, vui lòng thử lại!" });
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
      return res.json({ books, categories });
    }

    res.render("bookPage", {
      dataTable: books,
      categories,
      currentPage: "books",
      criteria: criteria || "",
      query: query || "",
    });
  } catch (error) {
    console.error("Lỗi khi hiển thị sách:", error);
    res
      .status(500)
      .json({ error: "Có lỗi xảy ra khi hiển thị sách, vui lòng thử lại!" });
  }
};

const updateBook = async (req, res) => {
  try {
    if (!req.body.book_id) {
      return res.status(400).json({ error: "Thiếu ID sách!" });
    }

    await bookService.updateBook(req);
    let data = await bookService.getAllBooks();
    let categories = await categoryService.getAllCategory();

    if (req.headers.accept?.includes("application/json")) {
      return res.json({ message: "Cập nhật sách thành công!" });
    }

    res.render("bookPage", {
      dataTable: data,
      categories,
      currentPage: "books",
      criteria: req.query.criteria || "",
      query: req.query.query || "",
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật sách:", error);
    res
      .status(500)
      .json({ error: "Có lỗi xảy ra khi cập nhật sách, vui lòng thử lại!" });
  }
};

const getBookByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!categoryId) {
      return res.status(400).json({ error: "Thiếu categoryId!" });
    }

    let books = await bookService.getBookByCategory(categoryId);

    if (books.length === 0) {
      return res.json({
        books: [],
        message: "Không có sách nào trong danh mục này!",
      });
    }

    return res.json({ books });
  } catch (error) {
    console.error("Lỗi khi lấy sách theo danh mục:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra khi lấy sách theo danh mục!" });
  }
};

const getBookById = async (req, res) => {
  try {
    let bookId = req.params.bookId;
    let book = await bookService.getBookById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Sách không tồn tại!" });
    }

    return res.json({ book });
  } catch (error) {
    console.error("Lỗi khi lấy sách:", error);
    return res.status(500).json({ error: "Có lỗi xảy ra khi lấy sách!" });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.query.book_id;
    await bookService.deleteBook(bookId);
    let data = await bookService.getAllBooks();
    let categories = await categoryService.getAllCategory();

    res.render("bookPage", {
      dataTable: data,
      categories,
      currentPage: "books",
      criteria: req.query.criteria || "",
      query: req.query.query || "",
      message: "Xóa danh mục thành công",
    });
  } catch (error) {
    console.error("Lỗi khi xóa sách:", error);
    res.status(500).json({ error: "Có lỗi xảy ra khi xóa sách!" });
  }
};

const searchBooks = async (req, res) => {
  try {
    let filters = {
      criteria: req.query.criteria,
      query: req.query.query,
    };
    let books = await bookService.searchBook(filters);

    return res.json({ books });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sách:", error);
    return res.status(500).json({ error: "Có lỗi xảy ra khi tìm kiếm sách!" });
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
