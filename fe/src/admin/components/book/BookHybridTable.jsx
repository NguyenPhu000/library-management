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
import HybridTable from "../common/HybridTable";

const BookHybridTable = ({
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

  // Define columns for table
  const columns = [
    {
      header: "STT",
      accessor: "index",
      className: "text-center w-16",
      cellClassName: "text-center",
      render: (book, index) => startIndex + index + 1,
      hideInMobile: true,
    },
    {
      header: "Hình ảnh",
      accessor: "cover_image",
      className: "w-20",
      cellClassName: "px-6 py-4",
      render: (book) => (
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
      ),
      hideInMobile: true,
    },
    {
      header: "Thông tin sách",
      accessor: "title",
      render: (book) => (
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
      ),
    },
    {
      header: "Tác giả & NXB",
      accessor: "author",
      render: (book) => (
        <div className="text-sm text-gray-900 dark:text-white">
          <div className="flex items-center mb-1">
            <FaUser className="mr-1 text-gray-400" />
            <span className="font-medium">{truncateText(book.author, 30)}</span>
          </div>
          <div className="flex items-center">
            <FaBuilding className="mr-1 text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400">
              {truncateText(book.publisher, 25)}
            </span>
          </div>
        </div>
      ),
      hideInMobile: true,
    },
    {
      header: "Số lượng",
      accessor: "available_copies",
      className: "text-center",
      cellClassName: "text-center",
      render: (book) => (
        <div className="text-sm text-gray-900 dark:text-white">
          <div className="flex items-center justify-center">
            <FaCopy className="mr-1 text-gray-400" />
            <span className="font-medium">
              {book.available_copies}/{book.total_copies}
            </span>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Có sẵn/Tổng số
          </div>
        </div>
      ),
    },
    {
      header: "Trạng thái",
      accessor: "status",
      className: "text-center",
      cellClassName: "text-center",
      render: (book) => getStatusBadge(book),
    },
    {
      header: "Danh mục",
      accessor: "categories",
      render: (book) => (
        <div className="max-w-xs">{getCategoriesBadges(book.categories)}</div>
      ),
      hideInMobile: true,
    },
    {
      header: "Thao tác",
      accessor: "actions",
      className: "text-center",
      cellClassName: "text-center",
      render: (book) => (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => onView(book)}
            className="action-btn text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            title="Xem chi tiết"
          >
            <FaEye size={16} />
          </button>
          <button
            onClick={() => onEdit(book)}
            className="action-btn text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
            title="Chỉnh sửa"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={() => handleDelete(book)}
            className="action-btn text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
            title="Xóa"
          >
            <FaTrash size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Custom mobile card renderer
  const renderMobileCard = (book, index) => (
    <div className="responsive-card">
      {/* Card Header */}
      <div className="responsive-card-header">
        <span className="text-sm font-medium text-gray-900 dark:text-white">
          #{startIndex + index + 1}
        </span>
        {getStatusBadge(book)}
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
            <div className="mt-2">{getCategoriesBadges(book.categories)}</div>
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
  );

  return (
    <HybridTable
      columns={columns}
      data={books}
      loading={loading}
      emptyMessage="Không có sách nào"
      renderMobileCard={renderMobileCard}
      keyField="book_id"
      mobileBreakpoint="lg"
    />
  );
};

export default BookHybridTable;
