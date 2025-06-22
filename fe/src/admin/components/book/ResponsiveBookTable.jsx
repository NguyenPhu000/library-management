import React, { useState } from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaBook,
  FaBookOpen,
  FaUser,
  FaCalendarAlt,
  FaTags,
  FaImage,
  FaCopy,
  FaBuilding,
} from "react-icons/fa";
import Swal from "sweetalert2";

const ResponsiveBookTable = ({
  books,
  onEdit,
  onDelete,
  onView,
  startIndex = 0,
  loading = false,
}) => {
  const [imageErrors, setImageErrors] = useState({});

  const handleImageError = (bookId) => {
    setImageErrors((prev) => ({ ...prev, [bookId]: true }));
  };

  const handleDelete = async (book) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa sách "${book.title}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      onDelete(book.book_id, book.title);
    }
  };

  const getStatusBadge = (book) => {
    if (book.available_copies > 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <FaBookOpen className="mr-1" />
          Còn sách
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <FaBook className="mr-1" />
          Hết sách
        </span>
      );
    }
  };

  const getCategoriesBadges = (categories) => {
    if (!categories || categories.length === 0) {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
          Chưa phân loại
        </span>
      );
    }

    return (
      <div className="flex flex-wrap gap-1">
        {categories.slice(0, 2).map((category, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
          >
            <FaTags className="mr-1" />
            {category.name}
          </span>
        ))}
        {categories.length > 2 && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            +{categories.length - 2} khác
          </span>
        )}
      </div>
    );
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "N/A";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Desktop loading */}
        <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700"></div>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="h-16 bg-gray-100 dark:bg-gray-750"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile loading */}
        <div className="md:hidden space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse"
            >
              <div className="flex space-x-4">
                <div className="w-16 h-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!books || books.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <FaBook
          className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          size={48}
        />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không có sách nào
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Chưa có sách nào được thêm vào hệ thống.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  STT
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hình ảnh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thông tin sách
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tác giả & NXB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Số lượng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Danh mục
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {books.map((book, index) => (
                <tr
                  key={book.book_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  {/* STT */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {startIndex + index + 1}
                  </td>

                  {/* Hình ảnh */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex-shrink-0 h-20 w-16">
                      {book.cover_image && !imageErrors[book.book_id] ? (
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="h-20 w-16 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                          onError={() => handleImageError(book.book_id)}
                        />
                      ) : (
                        <div className="h-20 w-16 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                          <FaImage className="text-gray-400 dark:text-gray-500" />
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Thông tin sách */}
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <div className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                        {book.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <div className="flex items-center">
                          <FaBook className="mr-1" />
                          ISBN: {book.isbn || "N/A"}
                        </div>
                        <div className="flex items-center mt-1">
                          <FaCalendarAlt className="mr-1" />
                          {book.publication_year || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Tác giả & NXB */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center mb-1">
                        <FaUser className="mr-1 text-gray-400" />
                        <span className="font-medium">
                          {truncateText(book.author, 30)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FaBuilding className="mr-1 text-gray-400" />
                        <span className="text-gray-500 dark:text-gray-400">
                          {truncateText(book.publisher, 25)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Số lượng */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center">
                        <FaCopy className="mr-1 text-gray-400" />
                        <span className="font-medium">
                          {book.available_copies}/{book.total_copies}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Có sẵn/Tổng số
                      </div>
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(book)}
                  </td>

                  {/* Danh mục */}
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      {getCategoriesBadges(book.categories)}
                    </div>
                  </td>

                  {/* Thao tác */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => onView(book)}
                        className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                        title="Xem chi tiết"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => onEdit(book)}
                        className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(book)}
                        className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        title="Xóa"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {books.map((book, index) => (
          <div
            key={book.book_id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  #{startIndex + index + 1}
                </span>
                {getStatusBadge(book)}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="flex space-x-4">
                {/* Book Image */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-20">
                    {book.cover_image && !imageErrors[book.book_id] ? (
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                        onError={() => handleImageError(book.book_id)}
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 dark:bg-gray-600 rounded-md flex items-center justify-center">
                        <FaImage className="text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {book.title}
                  </h3>

                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <FaUser className="mr-1 flex-shrink-0" />
                      <span className="truncate">{book.author}</span>
                    </div>
                    <div className="flex items-center">
                      <FaBuilding className="mr-1 flex-shrink-0" />
                      <span className="truncate">{book.publisher}</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="mr-1 flex-shrink-0" />
                      <span>{book.publication_year}</span>
                      <span className="mx-2">•</span>
                      <FaCopy className="mr-1 flex-shrink-0" />
                      <span>
                        {book.available_copies}/{book.total_copies}
                      </span>
                    </div>
                  </div>

                  {/* Categories */}
                  <div className="mt-2">
                    {getCategoriesBadges(book.categories)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-2">
                  <button
                    onClick={() => onView(book)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center"
                  >
                    <FaEye className="mr-1" />
                    Xem
                  </button>
                  <button
                    onClick={() => onEdit(book)}
                    className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center"
                  >
                    <FaEdit className="mr-1" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(book)}
                    className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center"
                  >
                    <FaTrash className="mr-1" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ResponsiveBookTable;
