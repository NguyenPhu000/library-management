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
import { formatCoverImage } from "../../../utils/imageHelper";
import Swal from "sweetalert2";

const BookTable = ({
  books,
  onEdit,
  onDelete,
  onView,
  startIndex = 0,
  loading = false,
}) => {
  console.log("📚 BookTable render:", {
    books: books,
    booksLength: books?.length,
    booksType: typeof books,
    isArray: Array.isArray(books),
    loading: loading,
    startIndex: startIndex,
    sampleBook: books?.[0],
  });

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

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
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
    );
  }

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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      {/* Mobile scroll indicator */}
      <div className="block md:hidden bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-sm text-blue-800 dark:text-blue-300 border-b border-blue-200 dark:border-blue-800">
        <div className="flex items-center">
          <span className="mr-2">💡</span>
          Vuốt sang trái để xem thêm thông tin
        </div>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 min-w-[800px]">
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
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
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
                        src={formatCoverImage(book.cover_image)}
                        alt={book.title}
                        className="h-20 w-16 object-cover rounded-md border border-gray-200 dark:border-gray-600"
                        onError={() => handleImageError(book.book_id)}
                      />
                    ) : (
                      <div className="h-20 w-16 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex items-center justify-center">
                        <FaImage className="text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                  </div>
                </td>

                {/* Thông tin sách */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {truncateText(book.title, 40)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ISBN: {book.isbn || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FaCalendarAlt className="mr-1" />
                      {book.publication_year || "N/A"}
                    </div>
                  </div>
                </td>

                {/* Tác giả & NXB */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                      <FaUser className="mr-1 text-gray-400" />
                      {truncateText(book.author, 30)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FaBuilding className="mr-1 text-gray-400" />
                      {truncateText(book.publisher, 30)}
                    </div>
                  </div>
                </td>

                {/* Số lượng */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-900 dark:text-white flex items-center">
                      <FaCopy className="mr-1 text-gray-400" />
                      Tổng: {book.total_copies || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                      <FaBookOpen className="mr-1 text-gray-400" />
                      Còn: {book.available_copies || 0}
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
                      className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => onEdit(book)}
                      className="p-2 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-900/20 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(book)}
                      className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
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
    </div>
  );
};

export default BookTable;
