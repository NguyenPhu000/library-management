import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  FaListAlt,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSync,
  FaEye,
  FaBook,
  FaTags,
  FaChartBar,
  FaTimes,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import adminCategoryService from "../services/adminCategoryService";
import Swal from "sweetalert2";

const CategoryManagePage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterBy, setFilterBy] = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const total = categories.length;
    const withBooks = categories.filter((cat) => cat.bookCount > 0).length;
    const empty = total - withBooks;
    const totalBooks = categories.reduce(
      (sum, cat) => sum + (cat.bookCount || 0),
      0
    );

    return { total, withBooks, empty, totalBooks };
  }, [categories]);

  // Filter và sort categories
  useEffect(() => {
    let filtered = [...categories];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterBy === "withBooks") {
      filtered = filtered.filter((cat) => cat.bookCount > 0);
    } else if (filterBy === "empty") {
      filtered = filtered.filter((cat) => cat.bookCount === 0);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "bookCount") {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortBy === "created_at") {
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

    setFilteredCategories(filtered);
  }, [categories, searchTerm, sortBy, sortOrder, filterBy]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminCategoryService.getAllCategories();

      if (response.success && response.categories) {
        const mappedCategories = response.categories.map((category) => ({
          id: category.category_id,
          name: category.name,
          description: category.description,
          created_at: category.created_at,
          updated_at: category.updated_at,
          bookCount: parseInt(category.bookCount) || 0,
        }));

        setCategories(mappedCategories);
      } else {
        throw new Error(response.message || "Không thể tải danh mục");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách danh mục. Vui lòng thử lại.",
        confirmButtonColor: "#3b82f6",
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Form handlers
  const resetForm = () => {
    setFormData({ name: "", description: "" });
    setFormErrors({});
    setSelectedCategory(null);
  };

  const closeAllModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    resetForm();
  };

  const validateForm = () => {
    const errors = {};

    // Validate name
    if (!formData.name?.trim()) {
      errors.name = "Tên danh mục không được để trống";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Tên danh mục phải có ít nhất 2 ký tự";
    } else if (formData.name.trim().length > 100) {
      errors.name = "Tên danh mục không được quá 100 ký tự";
    }

    // Check duplicate name (exclude current category in edit mode)
    if (formData.name?.trim()) {
      const duplicateName = categories.find(
        (cat) =>
          cat.name?.toLowerCase() === formData.name.trim().toLowerCase() &&
          cat.id !== selectedCategory?.id
      );

      if (duplicateName) {
        errors.name = "Tên danh mục đã tồn tại";
      }
    }

    // Validate description (optional but if provided, check length)
    if (formData.description && formData.description.trim().length > 500) {
      errors.description = "Mô tả không được quá 500 ký tự";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // CRUD operations
  const handleCreateCategory = () => {
    resetForm();
    setShowCreateModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
    });
    setShowEditModal(true);
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const trimmedData = {
        name: formData.name.trim(),
        description: formData.description?.trim() || "",
      };

      let response;

      if (showCreateModal) {
        response = await adminCategoryService.createCategory(trimmedData);
      } else {
        response = await adminCategoryService.updateCategory(
          selectedCategory.id,
          trimmedData
        );
      }

      if (response.success) {
        const action = showCreateModal ? "Tạo" : "Cập nhật";

        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: `${action} danh mục thành công!`,
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: "#3b82f6",
        });

        closeAllModals();
        fetchCategories();
      } else {
        throw new Error(response.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể lưu danh mục. Vui lòng thử lại.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const category = categories.find((cat) => cat.id === categoryId);

    if (category?.bookCount > 0) {
      Swal.fire({
        icon: "warning",
        title: "Không thể xóa",
        text: `Danh mục "${categoryName}" có ${category.bookCount} cuốn sách. Vui lòng xóa sách trước khi xóa danh mục.`,
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await adminCategoryService.deleteCategory(categoryId);

        if (response.success) {
          Swal.fire({
            icon: "success",
            title: "Đã xóa!",
            text: "Danh mục đã được xóa thành công.",
            timer: 1500,
            showConfirmButton: false,
            confirmButtonColor: "#3b82f6",
          });
          fetchCategories();
        } else {
          throw new Error(response.message || "Xóa danh mục thất bại");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: error.message || "Không thể xóa danh mục. Vui lòng thử lại.",
          confirmButtonColor: "#3b82f6",
        });
      }
    }
  };

  // Utility functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getBookCountBadge = (count) => {
    if (count === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          <FaBook className="mr-1" />
          Trống
        </span>
      );
    } else if (count <= 5) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
          <FaBook className="mr-1" />
          {count} sách
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <FaBook className="mr-1" />
          {count} sách
        </span>
      );
    }
  };

  // Components
  const Modal = ({ show, onClose, title, children, size = "md" }) => {
    if (!show) return null;

    const sizeClasses = {
      sm: "max-w-md",
      md: "max-w-lg",
      lg: "max-w-2xl",
      xl: "max-w-4xl",
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-hidden`}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-2xl font-bold transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const CategoryForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Nhập tên danh mục..."
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            // Clear errors when user starts typing
            if (formErrors.name) {
              setFormErrors({ ...formErrors, name: "" });
            }
          }}
          onBlur={() => {
            // Validate on blur
            if (formData.name?.trim()) {
              validateForm();
            }
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            formErrors.name
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          disabled={isSubmitting}
          autoComplete="off"
          maxLength={100}
        />
        {formErrors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {formErrors.name}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.name?.length || 0}/100 ký tự
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mô tả
        </label>
        <textarea
          placeholder="Nhập mô tả danh mục..."
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            // Clear errors when user starts typing
            if (formErrors.description) {
              setFormErrors({ ...formErrors, description: "" });
            }
          }}
          rows="4"
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical transition-colors ${
            formErrors.description
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-gray-300 dark:border-gray-600"
          } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
          disabled={isSubmitting}
          autoComplete="off"
          maxLength={500}
        />
        {formErrors.description && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {formErrors.description}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {formData.description?.length || 0}/500 ký tự
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          type="button"
          onClick={closeAllModals}
          disabled={isSubmitting}
          className="px-6 py-3 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {showCreateModal ? "Đang tạo..." : "Đang cập nhật..."}
            </>
          ) : showCreateModal ? (
            "Tạo danh mục"
          ) : (
            "Cập nhật"
          )}
        </button>
      </div>
    </form>
  );

  const CategoryDetail = ({ category }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tên danh mục:
          </label>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {category.name}
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Số lượng sách:
          </label>
          <div>{getBookCountBadge(category.bookCount)}</div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Mô tả:
        </label>
        <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          {category.description || "Chưa có mô tả"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ngày tạo:
          </label>
          <p className="text-gray-900 dark:text-white">
            {formatDate(category.created_at)}
          </p>
        </div>
        {category.updated_at && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Cập nhật lần cuối:
            </label>
            <p className="text-gray-900 dark:text-white">
              {formatDate(category.updated_at)}
            </p>
          </div>
        )}
      </div>
    </div>
  );

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
                <FaTags className="mr-2 sm:mr-3 text-blue-600 dark:text-blue-400 text-xl sm:text-2xl" />
                <span className="hidden sm:inline">Quản lý danh mục</span>
                <span className="sm:hidden">Danh mục</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                <span className="hidden sm:inline">
                  Quản lý các danh mục sách trong thư viện
                </span>
                <span className="sm:hidden">Danh mục sách</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <button
                onClick={fetchCategories}
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
                onClick={handleCreateCategory}
                className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <FaPlus className="mr-1 sm:mr-2 text-sm" />
                <span className="hidden sm:inline">Thêm danh mục</span>
                <span className="sm:hidden">Thêm</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tổng danh mục</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <FaTags className="text-4xl text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Có sách</p>
                <p className="text-3xl font-bold">{stats.withBooks}</p>
              </div>
              <FaBook className="text-4xl text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-100">Danh mục trống</p>
                <p className="text-3xl font-bold">{stats.empty}</p>
              </div>
              <FaListAlt className="text-4xl text-gray-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Tổng sách</p>
                <p className="text-3xl font-bold">{stats.totalBooks}</p>
              </div>
              <FaChartBar className="text-4xl text-purple-200" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="withBooks">Có sách</option>
                <option value="empty">Trống</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="name">Sắp xếp theo tên</option>
                <option value="bookCount">Sắp xếp theo số sách</option>
                <option value="created_at">Sắp xếp theo ngày tạo</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
              >
                {sortOrder === "asc" ? (
                  <>
                    <FaSortAmountUp className="mr-2" />
                    Tăng dần
                  </>
                ) : (
                  <>
                    <FaSortAmountDown className="mr-2" />
                    Giảm dần
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            {searchTerm || filterBy !== "all" ? (
              <p>
                Hiển thị {filteredCategories.length} / {categories.length} danh
                mục
                {searchTerm && ` với từ khóa "${searchTerm}"`}
              </p>
            ) : (
              <p>Hiển thị tất cả {categories.length} danh mục</p>
            )}
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div
                key={category.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                      <FaListAlt className="text-white" size={20} />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                        {category.name}
                      </h3>
                      <div className="mt-1">
                        {getBookCountBadge(category.bookCount)}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {category.description || "Chưa có mô tả"}
                </p>

                <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <p>Tạo: {formatDate(category.created_at)}</p>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleViewCategory(category)}
                    className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                    title="Xem chi tiết"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="p-2 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                    title="Chỉnh sửa"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteCategory(category.id, category.name)
                    }
                    className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                    title="Xóa"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center">
                <FaTags
                  className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
                  size={64}
                />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm || filterBy !== "all"
                    ? "Không tìm thấy danh mục nào"
                    : "Chưa có danh mục nào"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {searchTerm || filterBy !== "all"
                    ? "Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm"
                    : "Hãy tạo danh mục đầu tiên cho thư viện"}
                </p>
                {!searchTerm && filterBy === "all" && (
                  <button
                    onClick={handleCreateCategory}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                  >
                    <FaPlus className="mr-2" />
                    Tạo danh mục đầu tiên
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <Modal
          show={showCreateModal}
          onClose={closeAllModals}
          title="Tạo danh mục mới"
          size="md"
        >
          <CategoryForm />
        </Modal>

        <Modal
          show={showEditModal}
          onClose={closeAllModals}
          title="Chỉnh sửa danh mục"
          size="md"
        >
          <CategoryForm />
        </Modal>

        <Modal
          show={showViewModal}
          onClose={() => setShowViewModal(false)}
          title={`Chi tiết danh mục: ${selectedCategory?.name}`}
          size="lg"
        >
          {selectedCategory && <CategoryDetail category={selectedCategory} />}
        </Modal>
      </div>
    </div>
  );
};

export default CategoryManagePage;
