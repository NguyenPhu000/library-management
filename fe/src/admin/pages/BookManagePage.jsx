import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaTable,
  FaTimes,
  FaSave,
} from "react-icons/fa";
import { formatCoverImage } from "../../utils/imageHelper";
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

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Form data for edit
  const [editFormData, setEditFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    publication_year: "",
    publisher: "",
    total_copies: 1,
    available_copies: 1,
    status: "available",
    category_id: [],
    cover_image: null,
    current_cover: "",
  });

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

  const handleEditBook = async (bookId) => {
    try {
      setModalLoading(true);
      const response = await adminBookService.getBookById(bookId);
      const book = response.data;

      // Map categories
      const categoryIds =
        book.categories && book.categories.length > 0
          ? book.categories.map((cat) => cat.category_id)
          : [];

      setEditingBook(book);
      setEditFormData({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        description: book.description || "",
        publication_year: book.publication_year || "",
        publisher: book.publisher || "",
        total_copies: book.total_copies || 1,
        available_copies: book.available_copies || 1,
        status: book.status || "available",
        category_id: categoryIds,
        cover_image: null,
        current_cover: book.cover_image || "",
      });

      if (book.cover_image) {
        setImagePreview(book.cover_image);
      } else {
        setImagePreview("");
      }

      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching book details:", error);
      Swal.fire("Lỗi!", "Không thể tải thông tin sách.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setEditingBook(null);
    setEditFormData({
      title: "",
      author: "",
      isbn: "",
      description: "",
      publication_year: "",
      publisher: "",
      total_copies: 1,
      available_copies: 1,
      status: "available",
      category_id: [],
      cover_image: null,
      current_cover: "",
    });
    setImagePreview("");
  };

  const handleEditFormChange = (e) => {
    const { name, value, type, files, options } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setEditFormData((prev) => ({ ...prev, cover_image: file }));

        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setEditFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      setEditFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateBook = async (e) => {
    e.preventDefault();

    if (!editingBook) return;

    try {
      setModalLoading(true);
      await adminBookService.updateBook(editingBook.book_id, editFormData);

      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Cập nhật sách thành công",
        timer: 1500,
        showConfirmButton: false,
      });

      // Refresh books list
      fetchBooks(currentPage);
      handleCloseModal();
    } catch (error) {
      console.error("Error updating book:", error);
      Swal.fire("Lỗi!", "Không thể cập nhật sách. Vui lòng thử lại.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Quản Lý Sách (Dạng lưới)
        </h1>
        <div className="flex space-x-3">
          <Link
            to="/admin/books"
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center transition duration-300"
          >
            <FaTable className="mr-2" /> Dạng bảng
          </Link>
          <Link
            to="/admin/books/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition duration-300"
          >
            <FaPlus className="mr-2" /> Tạo Sách Mới
          </Link>
        </div>
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
                          src={formatCoverImage(book.cover_image)}
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

      {/* Edit Book Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            {modalLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Chỉnh Sửa Sách
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <FaTimes className="text-xl" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                  <form onSubmit={handleUpdateBook}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Cột bên trái */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ISBN
                          </label>
                          <input
                            type="text"
                            name="isbn"
                            value={editFormData.isbn}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu Đề
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={editFormData.title}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tác Giả
                          </label>
                          <input
                            type="text"
                            name="author"
                            value={editFormData.author}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Năm Xuất Bản
                          </label>
                          <input
                            type="text"
                            name="publication_year"
                            value={editFormData.publication_year}
                            onChange={handleEditFormChange}
                            placeholder="Nhập năm xuất bản"
                            pattern="\d{4}"
                            title="Vui lòng nhập năm hợp lệ (4 chữ số)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhà Xuất Bản
                          </label>
                          <input
                            type="text"
                            name="publisher"
                            value={editFormData.publisher}
                            onChange={handleEditFormChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô Tả
                          </label>
                          <textarea
                            name="description"
                            value={editFormData.description}
                            onChange={handleEditFormChange}
                            placeholder="Nhập mô tả"
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[200px]"
                          />
                        </div>
                      </div>

                      {/* Cột bên phải */}
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tổng Số Lượng
                          </label>
                          <input
                            type="number"
                            name="total_copies"
                            value={editFormData.total_copies}
                            onChange={handleEditFormChange}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Số Lượng Có Sẵn
                          </label>
                          <input
                            type="number"
                            name="available_copies"
                            value={editFormData.available_copies}
                            onChange={handleEditFormChange}
                            min="0"
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Danh Mục
                          </label>
                          <select
                            name="category_id"
                            value={editFormData.category_id}
                            onChange={handleEditFormChange}
                            multiple
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
                          >
                            {categories.length > 0 ? (
                              categories.map((category) => (
                                <option
                                  key={category.category_id}
                                  value={category.category_id}
                                >
                                  {category.name}
                                </option>
                              ))
                            ) : (
                              <option disabled>Không có danh mục nào</option>
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Trạng Thái
                          </label>
                          <select
                            name="status"
                            value={editFormData.status}
                            onChange={handleEditFormChange}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="available">Còn Sách</option>
                            <option value="unavailable">Hết Sách</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ảnh Bìa
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                            <div>
                              <input
                                type="file"
                                name="cover_image"
                                onChange={handleEditFormChange}
                                accept="image/*"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex justify-center">
                              {imagePreview && (
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="h-32 w-24 object-cover rounded-md border border-gray-300"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="mt-8 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <FaTimes className="inline mr-2" />
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={modalLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        <FaSave className="inline mr-2" />
                        {modalLoading ? "Đang cập nhật..." : "Cập Nhật"}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookManagePage;
