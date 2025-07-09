import { API, PublicAPI } from "./api";
import { getUploadsBase } from "./urlHelper";

// Helper tạo URL ảnh bìa dựa trên biến môi trường
const formatCoverImage = (filename) =>
  filename
    ? `${getUploadsBase()}${filename.replace(/['"']+/g, "")}`
    : "https://via.placeholder.com/150";

// Lấy danh sách tất cả sách - sử dụng PublicAPI vì đây là API công khai
const getBooks = async () => {
  try {
    const response = await PublicAPI.get("/books");

    if (!response.data || !response.data.success) {
      console.warn("Phản hồi API không hợp lệ:", response.data);
      return { books: [] };
    }

    const formattedBooks = response.data.books.map((book) => ({
      ...book,
      cover_image: formatCoverImage(book.cover_image),
    }));

    return { books: formattedBooks };
  } catch (error) {
    console.error("❌ API Error:", error);
    return { books: [] };
  }
};

// Lấy sách theo danh mục - sử dụng PublicAPI vì đây là API công khai
const getBooksByCategory = async (categoryId) => {
  try {
    const response = await PublicAPI.get(`/books/category/${categoryId}`);

    if (!response.data || !response.data.success) {
      console.warn("Phản hồi API không hợp lệ:", response.data);
      return { books: [] };
    }

    const formattedBooks = response.data.books.map((book) => ({
      ...book,
      cover_image: formatCoverImage(book.cover_image),
    }));

    return { books: formattedBooks };
  } catch (error) {
    console.error("❌ API Error:", error);
    return { books: [] };
  }
};

// Lấy chi tiết sách theo book_id - sử dụng PublicAPI vì đây là API công khai
const getBookById = async (bookId) => {
  try {
    const response = await PublicAPI.get(`/books/${bookId}`);

    if (!response.data || !response.data.success || !response.data.book) {
      console.warn("Phản hồi API không hợp lệ:", response.data);
      return { book: null };
    }

    const book = {
      ...response.data.book,
      cover_image: formatCoverImage(response.data.book.cover_image),
    };

    return { book };
  } catch (error) {
    console.error("❌ API Error:", error);
    return { book: null };
  }
};

const searchBooks = async (criteria, query) => {
  try {
    const response = await PublicAPI.get("/books", {
      params: {
        criteria: criteria,
        query: query,
      },
    });

    if (!response.data || !response.data.success) {
      console.warn("Phản hồi API không hợp lệ:", response.data);
      return { books: [] };
    }

    // Xử lý hình ảnh cho từng sách trong kết quả
    const booksWithImages = response.data.books.map((book) => ({
      ...book,
      cover_image: formatCoverImage(book.cover_image), // Hình ảnh placeholder nếu không có
    }));

    return { books: booksWithImages }; // Trả về danh sách sách đã xử lý
  } catch (error) {
    console.error("Lỗi khi tìm kiếm sách:", error);
    return { books: [] };
  }
};

export default {
  getBooks,
  getBooksByCategory,
  getBookById,
  searchBooks,
};
