import { API } from "../../services/api";

class AdminBookService {
  // Helper function to format image URL like in bookservice.js
  formatImageUrl(coverImage) {
    if (!coverImage) {
      return "https://via.placeholder.com/150";
    }

    // Xử lý nếu coverImage là array
    let cleanImage = coverImage;
    if (Array.isArray(coverImage)) {
      cleanImage = coverImage[0];
    }

    // Xử lý string có format lỗi như "[filename,filename]" hoặc "[filename"
    if (typeof cleanImage === "string") {
      // Remove brackets and quotes
      cleanImage = cleanImage.replace(/[\[\]'"]+/g, "");

      // If contains comma, take first part
      if (cleanImage.includes(",")) {
        cleanImage = cleanImage.split(",")[0];
      }
    }

    // Ensure we have a clean filename
    cleanImage = cleanImage.trim();

    return `http://localhost:8081/uploads/${cleanImage}`;
  }

  // Helper function to format book data with image URL
  formatBookData(book) {
    return {
      ...book,
      cover_image: this.formatImageUrl(book.cover_image),
    };
  }
  getAllBooks(params = {}) {
    return API.get("/admin/books", { params })
      .then((response) => {
        // Format image URLs like in bookservice.js
        if (response.data.data) {
          response.data.data = response.data.data.map((book) =>
            this.formatBookData(book)
          );
        }

        return response.data;
      })
      .catch((error) => {
        console.error("💥 Error in AdminBookService.getAllBooks:", error);
        throw error;
      });
  }

  // Sử dụng GET /books/:bookId từ bookRoutes (public route)
  getBookById(id) {
    return API.get(`/books/${id}`).then((response) => {
      // Format image URL like in bookservice.js
      if (response.data.book) {
        response.data.book = this.formatBookData(response.data.book);
      }

      return response.data;
    });
  }

  // Sử dụng POST /admin/books
  createBook(bookData) {
    const formData = this.prepareFormData(bookData);
    return API.post("/admin/books", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.data);
  }

  // Sử dụng POST /admin/books/update
  updateBook(id, bookData) {
    const formData = this.prepareFormData(bookData);
    // Thêm book_id vào formData
    formData.append("book_id", id);

    return API.post("/admin/books/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then((response) => response.data);
  }

  // Sử dụng POST /admin/books/delete
  deleteBook(id) {
    return API.post("/admin/books/delete", { book_id: id }).then(
      (response) => response.data
    );
  }

  // Tìm kiếm sách theo tiêu chí
  searchBooks(query, criteria = "title", page = 1, limit = 10) {
    return API.get("/admin/books", {
      params: {
        query,
        criteria,
        page,
        limit,
      },
    }).then((response) => {
      // Format image URLs like in bookservice.js
      if (response.data.data) {
        response.data.data = response.data.data.map((book) =>
          this.formatBookData(book)
        );
      }

      return response.data;
    });
  }

  // Lấy thống kê sách
  getBookStats() {
    return API.get("/admin/books/stats").then((response) => response.data);
  }

  // Quản lý danh mục sách
  getBookCategories(bookId) {
    return API.get(`/admin/books/${bookId}/categories`).then(
      (response) => response.data
    );
  }

  updateBookCategories(bookId, categoryIds) {
    return API.post(`/admin/books/${bookId}/categories`, { categoryIds }).then(
      (response) => response.data
    );
  }

  // Quản lý sách theo danh mục
  getBooksByCategory(categoryId, page = 1, limit = 10) {
    return API.get("/admin/books", {
      params: {
        categoryId,
        page,
        limit,
      },
    }).then((response) => response.data);
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
    return API.patch(`/admin/books/${id}/status`, { status }).then(
      (response) => response.data
    );
  }

  // Cập nhật số lượng sách
  updateBookCopies(id, totalCopies, availableCopies) {
    return API.patch(`/admin/books/${id}/copies`, {
      total_copies: totalCopies,
      available_copies: availableCopies,
    }).then((response) => response.data);
  }
}

const adminBookService = new AdminBookService();
export default adminBookService;
