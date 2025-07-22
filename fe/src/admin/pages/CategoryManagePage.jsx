import React, { useState, useEffect } from "react";
import { FaTags, FaSync } from "react-icons/fa";
import adminCategoryService from "../services/adminCategoryService";
import Swal from "sweetalert2";

// Import components
import CategoryStats from "../components/category/CategoryStats";
import CategorySearchForm from "../components/category/CategorySearchForm";
import CategoryGrid from "../components/category/CategoryGrid";
import CategoryModal from "../components/category/CategoryModal";
import CategoryForm from "../components/category/CategoryForm";
import CategoryDetail from "../components/category/CategoryDetail";

const CategoryManagePage = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search and filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterBy, setFilterBy] = useState("all");

  // Modal state
  const [modals, setModals] = useState({
    create: false,
    edit: false,
    view: false,
  });
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const fetchCategories = async () => {
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
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Modal handlers
  const openModal = (type, category = null) => {
    setSelectedCategory(category);
    setModals((prev) => ({ ...prev, [type]: true }));
  };

  const closeModal = (type) => {
    setModals((prev) => ({ ...prev, [type]: false }));
    setSelectedCategory(null);
    setIsSubmitting(false);
  };

  const closeAllModals = () => {
    setModals({ create: false, edit: false, view: false });
    setSelectedCategory(null);
    setIsSubmitting(false);
  };

  // CRUD operations
  const handleCreateCategory = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await adminCategoryService.createCategory(formData);
      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Tạo danh mục thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        closeModal("create");
        fetchCategories();
      } else {
        throw new Error(response.message || "Tạo danh mục thất bại");
      }
    } catch (error) {
      console.error("Error creating category:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể tạo danh mục. Vui lòng thử lại.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await adminCategoryService.updateCategory(
        selectedCategory.id,
        formData
      );
      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Cập nhật danh mục thành công!",
          timer: 1500,
          showConfirmButton: false,
        });
        closeModal("edit");
        fetchCategories();
      } else {
        throw new Error(response.message || "Cập nhật danh mục thất bại");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể cập nhật danh mục. Vui lòng thử lại.",
        confirmButtonColor: "#3b82f6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (category) => {
    // Check if category has books
    if (category.bookCount > 0) {
      Swal.fire({
        icon: "warning",
        title: "Không thể xóa",
        text: `Danh mục "${category.name}" có ${category.bookCount} cuốn sách. Vui lòng xóa sách trước khi xóa danh mục.`,
        confirmButtonColor: "#3b82f6",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa danh mục "${category.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      try {
        const response = await adminCategoryService.deleteCategory(category.id);
        if (response.success) {
          await Swal.fire({
            icon: "success",
            title: "Đã xóa!",
            text: "Danh mục đã được xóa thành công.",
            timer: 1500,
            showConfirmButton: false,
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-6 text-xl font-medium text-gray-600 dark:text-gray-400">
            Đang tải dữ liệu danh mục...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl mr-4 shadow-lg">
                  <FaTags className="text-white text-2xl" />
                </div>
                <div>
                  <span>Quản lý danh mục</span>
                  <p className="text-sm font-normal text-gray-600 dark:text-gray-400 mt-1">
                    Quản lý các danh mục sách trong thư viện
                  </p>
                </div>
              </h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchCategories}
                disabled={loading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center font-medium shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
                Làm mới
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <CategoryStats categories={categories} />

        {/* Search and Filter Section */}
        <CategorySearchForm
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterBy={filterBy}
          setFilterBy={setFilterBy}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          totalCategories={categories.length}
          filteredCount={filteredCategories.length}
        />

        {/* Categories Grid */}
        <CategoryGrid
          categories={filteredCategories}
          onCreate={() => openModal("create")}
          onEdit={(category) => openModal("edit", category)}
          onDelete={handleDeleteCategory}
          onView={(category) => openModal("view", category)}
          loading={loading}
        />

        {/* Modals */}
        {/* Create Modal */}
        <CategoryModal
          show={modals.create}
          onClose={() => closeModal("create")}
          title="Tạo danh mục mới"
          size="md"
        >
          <CategoryForm
            mode="create"
            onSubmit={handleCreateCategory}
            onCancel={() => closeModal("create")}
            isSubmitting={isSubmitting}
            categories={categories}
          />
        </CategoryModal>

        {/* Edit Modal */}
        <CategoryModal
          show={modals.edit}
          onClose={() => closeModal("edit")}
          title={`Chỉnh sửa danh mục: ${selectedCategory?.name}`}
          size="md"
        >
          <CategoryForm
            mode="edit"
            initialData={selectedCategory}
            onSubmit={handleEditCategory}
            onCancel={() => closeModal("edit")}
            isSubmitting={isSubmitting}
            categories={categories}
          />
        </CategoryModal>

        {/* View Modal */}
        <CategoryModal
          show={modals.view}
          onClose={() => closeModal("view")}
          title={`Chi tiết danh mục: ${selectedCategory?.name}`}
          size="lg"
        >
          {selectedCategory && <CategoryDetail category={selectedCategory} />}
        </CategoryModal>
      </div>
    </div>
  );
};

export default CategoryManagePage;
