import api from "../../services/api";

class AdminBookService {
  getAllBooks(params = {}) {
    return api.get("/api/admin/books", { params });
  }

  getBookById(id) {
    return api.get(`/api/admin/books/${id}`);
  }

  createBook(bookData) {
    const formData = this.prepareFormData(bookData);
    return api.post("/api/admin/books", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  updateBook(id, bookData) {
    const formData = this.prepareFormData(bookData);
    return api.put(`/api/admin/books/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  deleteBook(id) {
    return api.delete(`/api/admin/books/${id}`);
  }

  // Tìm kiếm sách theo tiêu chí
  searchBooks(query, criteria = "title", page = 1, limit = 10) {
    return api.get("/api/admin/books", {
      params: {
        query,
        criteria,
        page,
        limit,
      },
    });
  }

  // Lấy thống kê sách
  getBookStats() {
    return api.get("/api/admin/books/stats");
  }

  // Quản lý danh mục sách
  getBookCategories(bookId) {
    return api.get(`/api/admin/books/${bookId}/categories`);
  }

  updateBookCategories(bookId, categoryIds) {
    return api.post(`/api/admin/books/${bookId}/categories`, { categoryIds });
  }

  // Quản lý sách theo danh mục
  getBooksByCategory(categoryId, page = 1, limit = 10) {
    return api.get("/api/admin/books", {
      params: {
        categoryId,
        page,
        limit,
      },
    });
  }

  // Chuyển đổi dữ liệu từ form sang FormData để gửi file
  prepareFormData(bookData) {
    const formData = new FormData();

    // Thêm các trường dữ liệu thông thường
    Object.keys(bookData).forEach((key) => {
      if (
        key !== "image" &&
        key !== "cover_image" &&
        bookData[key] !== null &&
        bookData[key] !== undefined
      ) {
        // Xử lý đặc biệt cho mảng danh mục
        if (key === "category_id" && Array.isArray(bookData[key])) {
          bookData[key].forEach((categoryId) => {
            formData.append("category_id", categoryId);
          });
        } else {
          formData.append(key, bookData[key]);
        }
      }
    });

    // Thêm file ảnh nếu có
    if (bookData.image) {
      formData.append("cover_image", bookData.image);
    } else if (bookData.cover_image && bookData.cover_image instanceof File) {
      formData.append("cover_image", bookData.cover_image);
    }

    // Thêm cover hiện tại nếu có (để giữ lại nếu không có ảnh mới)
    if (bookData.current_cover) {
      formData.append("current_cover", bookData.current_cover);
    }

    return formData;
  }

  // Cập nhật trạng thái sách
  updateBookStatus(id, status) {
    return api.patch(`/api/admin/books/${id}/status`, { status });
  }

  // Cập nhật số lượng sách
  updateBookCopies(id, totalCopies, availableCopies) {
    return api.patch(`/api/admin/books/${id}/copies`, {
      total_copies: totalCopies,
      available_copies: availableCopies,
    });
  }
}

const adminBookService = new AdminBookService();
export default adminBookService;
