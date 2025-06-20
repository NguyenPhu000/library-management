import React, { useState, useEffect } from "react";
import {
  FaListAlt,
  FaSearch,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSync,
  FaEye,
  FaBook,
} from "react-icons/fa";
import adminCategoryService from "../services/adminCategoryService";
import Swal from "sweetalert2";

const CategoryManagePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Form state cho tạo/chỉnh sửa category
  const [formData, setFormData] = useState({
    categoryName: "",
    description: "",
  });

  // Load categories khi component mount hoặc khi tìm kiếm
  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await adminCategoryService.getAllCategories();

      if (response.success) {
        let filteredCategories = response.categories || [];

        // Lọc theo tìm kiếm
        if (searchTerm) {
          filteredCategories = filteredCategories.filter(
            (category) =>
              category.categoryName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              category.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
        }

        setCategories(filteredCategories);
      } else {
        console.error("API response not successful:", response);
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tải danh sách danh mục. Vui lòng thử lại.",
      });
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateCategory = () => {
    setFormData({
      categoryName: "",
      description: "",
    });
    setShowCreateModal(true);
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    setFormData({
      categoryName: category.categoryName || "",
      description: category.description || "",
    });
    setShowEditModal(true);
  };

  const handleViewCategory = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa danh mục "${categoryName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await adminCategoryService.deleteCategory(categoryId);
        if (response.success) {
          Swal.fire("Đã xóa!", "Danh mục đã được xóa thành công.", "success");
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
        });
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.categoryName) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Vui lòng nhập tên danh mục.",
      });
      return;
    }

    try {
      let response;
      if (showCreateModal) {
        response = await adminCategoryService.createCategory(formData);
      } else {
        response = await adminCategoryService.updateCategory(
          selectedCategory.id,
          formData
        );
      }

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Thành công",
          text: `${showCreateModal ? "Tạo" : "Cập nhật"} danh mục thành công!`,
          timer: 1500,
          showConfirmButton: false,
        });
        setShowCreateModal(false);
        setShowEditModal(false);
        fetchCategories();
      } else {
        throw new Error(
          response.message ||
            `${showCreateModal ? "Tạo" : "Cập nhật"} danh mục thất bại`
        );
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text:
          error.message ||
          `Không thể ${
            showCreateModal ? "tạo" : "cập nhật"
          } danh mục. Vui lòng thử lại.`,
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const CategoryModal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  const CategoryForm = () => (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.categoryName}
          onChange={(e) =>
            setFormData({ ...formData, categoryName: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mô tả
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={() => {
            setShowCreateModal(false);
            setShowEditModal(false);
          }}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
        >
          Hủy
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          {showCreateModal ? "Tạo mới" : "Cập nhật"}
        </button>
      </div>
    </form>
  );

  const CategoryDetail = ({ category }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Tên danh mục:
        </label>
        <p className="text-gray-900">{category.categoryName}</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mô tả:
        </label>
        <p className="text-gray-900">
          {category.description || "Chưa có mô tả"}
        </p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Số lượng sách:
        </label>
        <p className="text-gray-900">{category.bookCount || 0} cuốn</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Ngày tạo:
        </label>
        <p className="text-gray-900">{formatDate(category.createdAt)}</p>
      </div>
      {category.updatedAt && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cập nhật lần cuối:
          </label>
          <p className="text-gray-900">{formatDate(category.updatedAt)}</p>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaListAlt className="mr-3 text-blue-600" />
            Quản lý danh mục
          </h1>
          <p className="text-gray-600 mt-1">
            Tổng số: {categories.length} danh mục
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button
            onClick={fetchCategories}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <FaSync className="mr-2" />
            Làm mới
          </button>
          <button
            onClick={handleCreateCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <FaPlus className="mr-2" />
            Thêm danh mục
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="relative max-w-md">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FaListAlt className="text-blue-600" size={20} />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.categoryName}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaBook className="mr-1" />
                      {category.bookCount || 0} sách
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {category.description || "Chưa có mô tả"}
              </p>

              <div className="text-xs text-gray-500 mb-4">
                Tạo: {formatDate(category.createdAt)}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleViewCategory(category)}
                  className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100"
                  title="Xem chi tiết"
                >
                  <FaEye />
                </button>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-yellow-600 hover:text-yellow-900 p-2 rounded-full hover:bg-yellow-100"
                  title="Chỉnh sửa"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() =>
                    handleDeleteCategory(category.id, category.categoryName)
                  }
                  className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100"
                  title="Xóa"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <FaListAlt className="mx-auto text-gray-300" size={48} />
            <p className="mt-4 text-gray-500">
              {searchTerm
                ? "Không tìm thấy danh mục nào phù hợp"
                : "Chưa có danh mục nào"}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <CategoryModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo danh mục mới"
      >
        <CategoryForm />
      </CategoryModal>

      <CategoryModal
        show={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Chỉnh sửa danh mục"
      >
        <CategoryForm />
      </CategoryModal>

      <CategoryModal
        show={showViewModal}
        onClose={() => setShowViewModal(false)}
        title="Chi tiết danh mục"
      >
        {selectedCategory && <CategoryDetail category={selectedCategory} />}
      </CategoryModal>
    </div>
  );
};

export default CategoryManagePage;
