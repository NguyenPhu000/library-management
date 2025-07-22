import React from "react";
import { FaBook } from "react-icons/fa";

const CategoryDetail = ({ category }) => {
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

  return (
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
};

export default CategoryDetail;
