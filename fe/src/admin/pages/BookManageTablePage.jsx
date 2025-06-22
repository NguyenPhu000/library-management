import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBook,
  FaPlus,
  FaSync,
  FaSearch,
  FaFilter,
  FaTh,
  FaTable,
  FaTimes,
  FaSave,
  FaEdit,
  FaFileAlt,
  FaTags,
  FaImage,
} from "react-icons/fa";
import adminBookService from "../services/adminBookService";
import adminCategoryService from "../services/adminCategoryService";
import ResponsiveBookTable from "../components/book/ResponsiveBookTable";
import BookSearchForm from "../components/book/BookSearchForm";
import BookPagination from "../components/book/BookPagination";
import Swal from "sweetalert2";

const BookManageTablePage = () => {
  const navigate = useNavigate();

  // State management
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("title");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Statistics
  const stats = {
    total: books.length,
    available: books.filter((book) => book.available_copies > 0).length,
    outOfStock: books.filter((book) => book.available_copies === 0).length,
    totalCopies: books.reduce((sum, book) => sum + (book.total_copies || 0), 0),
    availableCopies: books.reduce(
      (sum, book) => sum + (book.available_copies || 0),
      0
    ),
  };

  // Filter và sort books
  useEffect(() => {
    let filtered = [...books];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((book) => {
        const searchValue = searchTerm.toLowerCase();
        switch (searchCriteria) {
          case "title":
            return book.title?.toLowerCase().includes(searchValue);
          case "author":
            return book.author?.toLowerCase().includes(searchValue);
          case "isbn":
            return book.isbn?.toLowerCase().includes(searchValue);
          case "publisher":
            return book.publisher?.toLowerCase().includes(searchValue);
          case "publication_year":
            return book.publication_year?.toString().includes(searchValue);
          default:
            return (
              book.title?.toLowerCase().includes(searchValue) ||
              book.author?.toLowerCase().includes(searchValue)
            );
        }
      });
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((book) =>
        book.categories?.some(
          (cat) => cat.category_id === parseInt(selectedCategory)
        )
      );
    }

    // Status filter
    if (filterBy === "available") {
      filtered = filtered.filter((book) => book.available_copies > 0);
    } else if (filterBy === "outOfStock") {
      filtered = filtered.filter((book) => book.available_copies === 0);
    } else if (filterBy === "new") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      filtered = filtered.filter(
        (book) => new Date(book.created_at) > oneWeekAgo
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (
        sortBy === "publication_year" ||
        sortBy === "total_copies" ||
        sortBy === "available_copies"
      ) {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortBy === "created_at" || sortBy === "updated_at") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else {
        aValue = aValue?.toString().toLowerCase() || "";
        bValue = bValue?.toString().toLowerCase() || "";
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredBooks(filtered);
    setCurrentPage(1);
  }, [
    books,
    searchTerm,
    searchCriteria,
    sortBy,
    sortOrder,
    filterBy,
    selectedCategory,
  ]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Fetch data
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      console.log("🔍 Fetching books from API...");

      const response = await adminBookService.getAllBooks();
      console.log("📡 Raw API response:", response);
      console.log("📊 Response structure:", {
        hasData: !!response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataLength: response.data?.length,
        responseKeys: Object.keys(response || {}),
        sampleData: response.data?.[0],
      });

      // Response giờ đã được unwrap trong service, chỉ cần check success
      if (response && response.success && response.data) {
        console.log("✅ Setting books data:", response.data.length, "books");
        setBooks(response.data);
      } else {
        console.log("❌ No data found in response or success = false");
        console.log("❌ Response:", response);
        throw new Error("Không thể tải danh sách sách");
      }
    } catch (error) {
      console.error("💥 Error fetching books:", error);
      console.error("💥 Error details:", {
        message: error.message,
        stack: error.stack,
        response: error.response?.data,
      });
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách sách. Vui lòng thử lại.",
        confirmButtonColor: "#3b82f6",
      });
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await adminCategoryService.getAllCategories();
      if (response.success && response.categories) {
        setCategories(response.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchBooks(), fetchCategories()]);
  }, [fetchBooks, fetchCategories]);

  // Event handlers
  const handleViewBook = (book) => {
    navigate(`/admin/books/view/${book.book_id}`);
  };

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

  const handleEditBook = async (book) => {
    try {
      setModalLoading(true);
      const response = await adminBookService.getBookById(book.book_id);

      // Safely access bookData - API returns { book: {...} }
      const bookData =
        response?.data?.book ||
        response?.book ||
        response?.data ||
        response ||
        {};

      // Safely map categories với multiple fallback options
      let categoryIds = [];
      if (
        bookData.categories &&
        Array.isArray(bookData.categories) &&
        bookData.categories.length > 0
      ) {
        categoryIds = bookData.categories.map((cat) => {
          // Handle different category data structures
          return cat.category_id || cat.id || cat;
        });
      } else if (
        bookData.BookCategories &&
        Array.isArray(bookData.BookCategories)
      ) {
        // Alternative structure that might be used
        categoryIds = bookData.BookCategories.map((cat) => {
          return cat.category_id || cat.categoryId || cat.id || cat;
        });
      } else if (bookData.category_id) {
        // Single category
        categoryIds = Array.isArray(bookData.category_id)
          ? bookData.category_id
          : [bookData.category_id];
      }

      setEditingBook(bookData);
      // Extract clean filename for current_cover
      let currentCoverFilename = "";
      if (bookData.cover_image) {
        if (bookData.cover_image.startsWith("http")) {
          // Extract filename from full URL: http://localhost:8081/uploads/filename.jpg -> filename.jpg
          const urlParts = bookData.cover_image.split("/");
          currentCoverFilename = urlParts[urlParts.length - 1];
        } else {
          // Already just filename
          currentCoverFilename = bookData.cover_image;
        }

        // Clean up filename - remove brackets, quotes, duplicates
        if (typeof currentCoverFilename === "string") {
          currentCoverFilename = currentCoverFilename.replace(/[\[\]'"]+/g, "");
          if (currentCoverFilename.includes(",")) {
            currentCoverFilename = currentCoverFilename.split(",")[0];
          }
          currentCoverFilename = currentCoverFilename.trim();
        }
      }

      setEditFormData({
        title: bookData.title || "",
        author: bookData.author || "",
        isbn: bookData.isbn || "",
        description: bookData.description || "",
        publication_year: bookData.publication_year || "",
        publisher: bookData.publisher || "",
        total_copies: bookData.total_copies || 1,
        available_copies: bookData.available_copies || 1,
        status: bookData.status || "available",
        category_id: categoryIds,
        cover_image: null,
        current_cover: currentCoverFilename,
      });

      // Set image preview with proper URL handling
      if (bookData.cover_image) {
        const imageUrl = bookData.cover_image.startsWith("http")
          ? bookData.cover_image
          : `/uploads/${bookData.cover_image}`;
        setImagePreview(imageUrl);
      } else {
        setImagePreview("");
      }

      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching book details:", error);
      console.error("Error details:", error.response?.data || error.message);
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
        // Có file mới được chọn
        setEditFormData((prev) => ({ ...prev, cover_image: file }));

        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
      // Nếu không có file được chọn (user cancel), không làm gì cả
      // Giữ nguyên current_cover và imagePreview
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
      fetchBooks();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating book:", error);
      Swal.fire("Lỗi!", "Không thể cập nhật sách. Vui lòng thử lại.", "error");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteBook = async (bookId, bookTitle) => {
    try {
      await adminBookService.deleteBook(bookId);

      Swal.fire({
        icon: "success",
        title: "Đã xóa!",
        text: "Sách đã được xóa thành công.",
        timer: 1500,
        showConfirmButton: false,
        confirmButtonColor: "#3b82f6",
      });

      fetchBooks();
    } catch (error) {
      console.error("Error deleting book:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể xóa sách. Vui lòng thử lại.",
        confirmButtonColor: "#3b82f6",
      });
    }
  };

  const handleCreateBook = () => {
    navigate("/admin/books/create");
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setFilterBy("all");
    setSortBy("created_at");
    setSortOrder("desc");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageSizeChange = (newSize) => {
    setItemsPerPage(newSize);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col space-y-4 lg:flex-row lg:justify-between lg:items-center lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <FaBook className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 text-xl sm:text-2xl" />
                <span className="hidden sm:inline">Quản lý sách</span>
                <span className="sm:hidden">Sách</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                <span className="hidden sm:inline">
                  Quản lý toàn bộ sách trong thư viện theo dạng bảng chi tiết
                </span>
                <span className="sm:hidden">Dạng bảng chi tiết</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={() => navigate("/admin/books/grid")}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <FaTh className="mr-1 sm:mr-2 text-sm" />
                <span className="hidden sm:inline">Dạng lưới</span>
                <span className="sm:hidden">Lưới</span>
              </button>
              <button
                onClick={fetchBooks}
                disabled={loading}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center disabled:opacity-50 text-sm sm:text-base"
              >
                <FaSync
                  className={`mr-1 sm:mr-2 text-sm ${
                    loading ? "animate-spin" : ""
                  }`}
                />
                <span className="hidden sm:inline">Làm mới</span>
                <span className="sm:hidden">Mới</span>
              </button>
              <button
                onClick={handleCreateBook}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <FaPlus className="mr-1 sm:mr-2 text-sm" />
                <span className="hidden sm:inline">Thêm sách mới</span>
                <span className="sm:hidden">Thêm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm sm:text-base">Tổng sách</p>
                <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
              </div>
              <FaBook className="text-3xl sm:text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm sm:text-base">Còn sách</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {stats.available}
                </p>
              </div>
              <FaBook className="text-3xl sm:text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm sm:text-base">Hết sách</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {stats.outOfStock}
                </p>
              </div>
              <FaBook className="text-3xl sm:text-4xl text-red-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm sm:text-base">Tổng bản</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {stats.totalCopies}
                </p>
              </div>
              <FaBook className="text-3xl sm:text-4xl text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm sm:text-base">
                  Bản có sẵn
                </p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {stats.availableCopies}
                </p>
              </div>
              <FaBook className="text-3xl sm:text-4xl text-indigo-200" />
            </div>
          </div>
        </div>

        {/* Search Form */}
        <BookSearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          categories={categories}
          onClearFilters={handleClearFilters}
          resultsCount={filteredBooks.length}
          totalCount={books.length}
        />

        {/* Books Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
          <ResponsiveBookTable
            books={paginatedBooks}
            onEdit={handleEditBook}
            onDelete={handleDeleteBook}
            onView={handleViewBook}
            startIndex={startIndex}
            loading={loading}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <BookPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredBooks.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              showPageSize={true}
              onPageSizeChange={handlePageSizeChange}
              pageSizeOptions={[12, 24, 48, 96]}
            />
          )}
        </div>

        {/* Empty State */}
        {!loading && paginatedBooks.length === 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
            <FaBook
              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
              size={64}
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchTerm || selectedCategory || filterBy !== "all"
                ? "Không tìm thấy sách nào"
                : "Chưa có sách nào"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || selectedCategory || filterBy !== "all"
                ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
                : "Hãy thêm sách đầu tiên cho thư viện"}
            </p>
            {!searchTerm && !selectedCategory && filterBy === "all" && (
              <button
                onClick={handleCreateBook}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
              >
                <FaPlus className="mr-2" />
                Thêm sách đầu tiên
              </button>
            )}
          </div>
        )}

        {/* Modern Edit Book Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto mx-4 border border-gray-200">
              {modalLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-lg font-medium text-gray-600">
                      Đang tải dữ liệu...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Modal Header */}
                  <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                        <FaEdit className="text-xl" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">Chỉnh Sửa Sách</h3>
                        <p className="text-gray-300 text-sm">
                          Cập nhật thông tin sách
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="text-white hover:bg-white hover:bg-opacity-20 transition-colors duration-200 p-2 rounded-lg"
                      aria-label="Close"
                    >
                      <FaTimes className="text-xl" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6">
                    <form
                      onSubmit={handleUpdateBook}
                      encType="multipart/form-data"
                      className="space-y-6"
                    >
                      {/* Hidden field for book ID */}
                      <input
                        type="hidden"
                        name="book_id"
                        value={editingBook?.book_id || ""}
                      />

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Cột bên trái - Thông tin cơ bản */}
                        <div className="space-y-6">
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <FaBook className="mr-2 text-gray-700" />
                              Thông tin cơ bản
                            </h4>

                            <div className="space-y-4">
                              <div>
                                <label
                                  htmlFor="edit_title"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  Tiêu Đề{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                  id="edit_title"
                                  name="title"
                                  value={editFormData.title}
                                  onChange={handleEditFormChange}
                                  placeholder="Nhập tiêu đề sách"
                                  required
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor="edit_author"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  Tác Giả{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                  id="edit_author"
                                  name="author"
                                  value={editFormData.author}
                                  onChange={handleEditFormChange}
                                  placeholder="Nhập tên tác giả"
                                  required
                                />
                              </div>

                              <div>
                                <label
                                  htmlFor="edit_isbn"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  ISBN
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                  id="edit_isbn"
                                  name="isbn"
                                  value={editFormData.isbn}
                                  onChange={handleEditFormChange}
                                  placeholder="Nhập mã ISBN"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label
                                    htmlFor="edit_publication_year"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                  >
                                    Năm Xuất Bản
                                  </label>
                                  <select
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    id="edit_publication_year"
                                    name="publication_year"
                                    value={editFormData.publication_year}
                                    onChange={handleEditFormChange}
                                  >
                                    <option value="">Chọn năm</option>
                                    {Array.from(
                                      {
                                        length: new Date().getFullYear() - 1899,
                                      },
                                      (_, i) => new Date().getFullYear() - i
                                    ).map((year) => (
                                      <option key={year} value={year}>
                                        {year}
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label
                                    htmlFor="edit_total_copies"
                                    className="block text-sm font-semibold text-gray-700 mb-2"
                                  >
                                    Tổng Số Lượng
                                  </label>
                                  <input
                                    type="number"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                    id="edit_total_copies"
                                    name="total_copies"
                                    value={editFormData.total_copies}
                                    onChange={handleEditFormChange}
                                    min="1"
                                    placeholder="Số lượng"
                                  />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="edit_publisher"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  Nhà Xuất Bản
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                  id="edit_publisher"
                                  name="publisher"
                                  value={editFormData.publisher}
                                  onChange={handleEditFormChange}
                                  placeholder="Nhập nhà xuất bản"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Mô tả */}
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <FaFileAlt className="mr-2 text-gray-600" />
                              Mô tả
                            </h4>
                            <textarea
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors resize-vertical"
                              id="edit_description"
                              name="description"
                              value={editFormData.description}
                              onChange={handleEditFormChange}
                              placeholder="Nhập mô tả sách..."
                              rows={6}
                              style={{ minHeight: "150px" }}
                            />
                          </div>
                        </div>

                        {/* Cột bên phải - Thông tin bổ sung */}
                        <div className="space-y-6">
                          {/* Danh mục và trạng thái */}
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <FaTags className="mr-2 text-gray-600" />
                              Phân loại
                            </h4>

                            <div className="space-y-4">
                              <div>
                                <label
                                  htmlFor="category_ids"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  Danh Mục
                                </label>
                                <select
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors"
                                  name="category_id"
                                  multiple
                                  size="5"
                                  value={editFormData.category_id}
                                  onChange={handleEditFormChange}
                                >
                                  {categories.length > 0 ? (
                                    categories.map((category) => (
                                      <option
                                        key={category.category_id}
                                        value={category.category_id}
                                        className="py-2"
                                      >
                                        {category.name}
                                      </option>
                                    ))
                                  ) : (
                                    <option disabled>
                                      Không có danh mục nào
                                    </option>
                                  )}
                                </select>
                                <p className="text-xs text-gray-500 mt-1">
                                  Giữ Ctrl để chọn nhiều danh mục
                                </p>
                              </div>

                              <div>
                                <label
                                  htmlFor="edit_available_copies"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  Số Lượng Có Sẵn
                                </label>
                                <input
                                  type="number"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                                  id="edit_available_copies"
                                  name="available_copies"
                                  value={editFormData.available_copies}
                                  min="0"
                                  disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Tự động cập nhật khi có giao dịch mượn/trả
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Upload ảnh */}
                          <div className="bg-gray-50 p-4 rounded-xl">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                              <FaImage className="mr-2 text-gray-600" />
                              Ảnh bìa
                            </h4>

                            <div className="space-y-4">
                              <div>
                                <label
                                  htmlFor="edit_cover_image"
                                  className="block text-sm font-semibold text-gray-700 mb-2"
                                >
                                  Chọn ảnh mới
                                </label>
                                <input
                                  type="file"
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                  id="edit_cover_image"
                                  name="cover_image"
                                  onChange={handleEditFormChange}
                                  accept="image/*"
                                />
                                <input
                                  type="hidden"
                                  name="current_cover"
                                  value={editFormData.current_cover}
                                />
                              </div>

                              <div className="flex justify-center">
                                <div className="relative">
                                  {imagePreview ? (
                                    <img
                                      src={imagePreview}
                                      alt="Book Cover Preview"
                                      className="h-48 w-36 object-cover rounded-xl border-2 border-gray-200 shadow-lg"
                                    />
                                  ) : (
                                    <div className="h-48 w-36 bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-200 rounded-xl flex items-center justify-center shadow-lg">
                                      <div className="text-center">
                                        <FaImage className="text-3xl text-gray-400 mx-auto mb-2" />
                                        <span className="text-gray-500 text-sm">
                                          Chưa có ảnh
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200 font-medium"
                        >
                          <FaTimes className="inline mr-2" />
                          Hủy
                        </button>
                        <button
                          type="submit"
                          disabled={modalLoading}
                          className="px-8 py-3 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
                        >
                          <FaSave className="inline mr-2" />
                          {modalLoading ? "Đang cập nhật..." : "Cập Nhật Sách"}
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
    </div>
  );
};

export default BookManageTablePage;
