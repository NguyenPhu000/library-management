import React from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaListAlt,
  FaBook,
  FaPlus,
  FaTags,
} from "react-icons/fa";

const CategoryGrid = ({
  categories = [],
  onEdit,
  onDelete,
  onView,
  onCreate,
  loading = false,
}) => {
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get book count badge
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
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
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <FaListAlt className="mr-2 text-blue-600 dark:text-blue-400" />
          Danh sách danh mục
        </h3>
        <button
          onClick={onCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center font-medium"
        >
          <FaPlus className="mr-2" />
          Thêm danh mục
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.length > 0 ? (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 hover:scale-105"
            >
              {/* Category Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center flex-1">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                    <FaListAlt className="text-white" size={20} />
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <h3
                      className="text-lg font-semibold text-gray-900 dark:text-white truncate"
                      title={category.name}
                    >
                      {category.name}
                    </h3>
                    <div className="mt-1">
                      {getBookCountBadge(category.bookCount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p
                  className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 min-h-[60px]"
                  title={category.description || "Chưa có mô tả"}
                >
                  {category.description || (
                    <span className="italic text-gray-400">Chưa có mô tả</span>
                  )}
                </p>
              </div>

              {/* Date Info */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-4 border-t border-gray-200 dark:border-gray-600 pt-3">
                <p className="flex items-center">
                  <span className="font-medium">Tạo:</span>
                  <span className="ml-1">
                    {formatDate(category.created_at)}
                  </span>
                </p>
                {category.updated_at &&
                  category.updated_at !== category.created_at && (
                    <p className="flex items-center mt-1">
                      <span className="font-medium">Sửa:</span>
                      <span className="ml-1">
                        {formatDate(category.updated_at)}
                      </span>
                    </p>
                  )}
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onView(category)}
                  className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                  title="Xem chi tiết"
                >
                  <FaEye size={16} />
                </button>
                <button
                  onClick={() => onEdit(category)}
                  className="p-2 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                  title="Chỉnh sửa"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  onClick={() => onDelete(category)}
                  className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
                  title="Xóa"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <FaTags
                className="mx-auto text-gray-300 dark:text-gray-500 mb-4"
                size={64}
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Chưa có danh mục nào
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Hãy tạo danh mục đầu tiên cho thư viện của bạn
              </p>
              <button
                onClick={onCreate}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto font-medium shadow-md hover:shadow-lg"
              >
                <FaPlus className="mr-2" />
                Tạo danh mục đầu tiên
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryGrid;
