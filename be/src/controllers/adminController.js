import adminService from "../services/adminService.js";
import bookService from "../services/bookService.js";

// Lấy thống kê dành cho trang dashboard admin
const getAdminStats = async (req, res) => {
  try {
    // Lấy tất cả thông tin thống kê cần thiết
    const adminCount = await adminService.getAdminCount();
    const recentAdmins = await adminService.getRecentAdmins();

    return res.status(200).json({
      success: true,
      data: {
        adminCount,
        recentAdmins,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy thống kê admin: " + error.message,
    });
  }
};

// Lấy danh sách admin
const getAllAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await adminService.getAllAdminsWithPagination(page, limit);

    return res.status(200).json({
      success: true,
      data: data.admins,
      totalPages: data.totalPages,
      currentPage: page,
      totalItems: data.totalItems,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy danh sách admin: " + error.message,
    });
  }
};

// Lấy thông tin chi tiết một admin
const getAdminById = async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await adminService.getAdminById(adminId);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy admin",
      });
    }

    return res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi lấy thông tin admin: " + error.message,
    });
  }
};

// Cập nhật admin
const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await adminService.updateAdmin(req.body);

    return res.status(200).json({
      success: true,
      message: "Cập nhật admin thành công",
      data: updatedAdmin,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi cập nhật admin: " + error.message,
    });
  }
};

// Xóa admin
const deleteAdmin = async (req, res) => {
  try {
    const adminId = req.params.id || req.body.id;

    if (!adminId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu ID admin",
      });
    }

    await adminService.deleteAdminById(adminId);

    return res.status(200).json({
      success: true,
      message: "Xóa admin thành công",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi xóa admin: " + error.message,
    });
  }
};

// Đồng bộ admin từ Users
const syncAdmin = async (req, res) => {
  try {
    const syncResult = await adminService.syncAdminFromUsers();

    if (!syncResult.success) {
      return res.status(400).json({
        success: false,
        message: syncResult.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Đồng bộ admin thành công",
      data: syncResult.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Có lỗi xảy ra khi đồng bộ admin: " + error.message,
    });
  }
};

// GET /api/admin/books - Lấy danh sách sách cho admin
const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, query, criteria, categoryId } = req.query;

    // Nếu có search parameters, sử dụng search
    let books;
    if (query && criteria) {
      books = await bookService.searchBook({ criteria, query });
    } else {
      books = await bookService.getAllBooks();
    }

    // Filter by category if provided
    if (categoryId) {
      books = books.filter((book) =>
        book.categories?.some((cat) => cat.category_id === parseInt(categoryId))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBooks = books.slice(startIndex, endIndex);
    const totalPages = Math.ceil(books.length / limit);

    return res.json({
      success: true,
      data: paginatedBooks, // Frontend expects 'data' field
      totalPages,
      currentPage: parseInt(page),
      totalItems: books.length,
    });
  } catch (error) {
    console.error("Error fetching books for admin:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: [],
    });
  }
};

// GET /api/admin/books/:id - Lấy chi tiết sách
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await bookService.getBookById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Sách không tồn tại!",
        data: null,
      });
    }

    return res.json({
      success: true,
      data: book,
    });
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

// POST /api/admin/books - Tạo sách mới
const createBook = async (req, res) => {
  try {
    await bookService.createNewBooks(req);
    return res.json({
      success: true,
      message: "Thêm sách thành công!",
    });
  } catch (error) {
    console.error("Error creating book:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// PUT /api/admin/books/:id - Cập nhật sách
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    // Add book_id to body for service
    req.body.book_id = id;

    await bookService.updateBook(req);
    return res.json({
      success: true,
      message: "Cập nhật sách thành công!",
    });
  } catch (error) {
    console.error("Error updating book:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE /api/admin/books/:id - Xóa sách
const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    await bookService.deleteBook(id);
    return res.json({
      success: true,
      message: "Xóa sách thành công!",
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export default {
  getAdminStats,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  syncAdmin,
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};
