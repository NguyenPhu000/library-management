import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye } from "react-icons/fa";
import adminBookService from "../services/adminBookService";
import adminCategoryService from "../services/adminCategoryService";
import Swal from "sweetalert2";

const BookManagePage = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        query: searchTerm,
        criteria: searchCriteria,
        categoryId: selectedCategory,
      };

      const response = await adminBookService.getAllBooks(params);

      if (response && response.data) {
        setBooks(response.data);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
      setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await adminCategoryService.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchBooks(1);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(1);
  };

  const handleCategoryFilter = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    fetchBooks(1);
  };

  const handlePageChange = (page) => {
    fetchBooks(page);
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    Swal.fire({
      title: "Xác nhận xóa sách",
      text: `Bạn có chắc chắn muốn xóa sách "${bookTitle}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await adminBookService.deleteBook(bookId);
          Swal.fire("Đã xóa!", "Sách đã được xóa thành công.", "success");
          // Cập nhật lại danh sách sau khi xóa
          fetchBooks(currentPage);
        } catch (error) {
          console.error(`Error deleting book ${bookId}:`, error);
          Swal.fire(
            "Lỗi!",
            `Không thể xóa sách "${bookTitle}". Vui lòng thử lại sau.`,
            "error"
          );
        }
      }
    });
  };

  // Hiển thị trạng thái sách
  const getStatusBadge = (status, availableCopies) => {
    if (status === "available" || availableCopies > 0) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Còn sách
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Hết sách
        </span>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản Lý Sách</h1>
        <Link
          to="/admin/books/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition duration-300"
        >
          <FaPlus className="mr-2" /> Tạo Sách Mới
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        {/* Form tìm kiếm */}
        <form
          onSubmit={handleSearch}
          className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6"
        >
          <div className="md:col-span-3">
            <select
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="title">Tìm theo Tiêu đề</option>
              <option value="author">Tìm theo Tác giả</option>
              <option value="publisher">Tìm theo Nhà xuất bản</option>
              <option value="publication_year">Tìm theo Năm xuất bản</option>
            </select>
          </div>

          <div className="md:col-span-6">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Nhập từ khóa..."
                className="w-full border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 transition duration-300"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={handleCategoryFilter}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </form>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : books.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tác giả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Năm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhà xuất bản
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng số
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số có sẵn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình ảnh
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {books.map((book, index) => (
                  <tr key={book.book_id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.isbn || "N/A"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.author}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.publication_year}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.publisher}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {book.total_copies}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {book.available_copies}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-center">
                      {getStatusBadge(book.status, book.available_copies)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {book.categories && book.categories.length > 0 ? (
                          book.categories.map((category) => (
                            <span
                              key={category.category_id}
                              className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-white"
                            >
                              {category.name}
                            </span>
                          ))
                        ) : (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                            Không có
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {book.cover_image ? (
                        <img
                          src={`/uploads/${book.cover_image}`}
                          alt={book.title}
                          className="h-16 w-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-xs text-gray-500">
                          Không có ảnh
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBook(book.book_id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Chỉnh sửa"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteBook(book.book_id, book.title)
                          }
                          className="text-red-600 hover:text-red-900"
                          title="Xóa"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy sách nào!
          </div>
        )}

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <nav className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border-t border-b ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                Sau
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookManagePage;
