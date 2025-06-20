import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaEdit, FaTrash, FaBookOpen } from "react-icons/fa";
import adminBookService from "../services/adminBookService";

const BookView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await adminBookService.getBookById(id);
        setBook(response.data);
      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Không thể tải thông tin sách. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    try {
      await adminBookService.deleteBook(id);
      navigate("/admin/books", {
        state: {
          notification: {
            type: "success",
            message: "Xóa sách thành công",
          },
        },
      });
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("Không thể xóa sách. Vui lòng thử lại sau.");
      setShowDeleteModal(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
        <p>{error}</p>
        <button
          onClick={() => navigate("/admin/books")}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">Không tìm thấy sách</h2>
        <p className="text-gray-600 mb-4">
          Sách bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Link
          to="/admin/books"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/admin/books"
            className="mr-4 text-gray-600 hover:text-blue-600"
          >
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold">Chi tiết sách</h1>
        </div>
        <div className="flex space-x-2">
          <Link
            to={`/admin/books/edit/${id}`}
            className="px-4 py-2 bg-blue-500 text-white rounded flex items-center hover:bg-blue-600"
          >
            <FaEdit className="mr-2" /> Chỉnh sửa
          </Link>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-500 text-white rounded flex items-center hover:bg-red-600"
          >
            <FaTrash className="mr-2" /> Xóa
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3 p-6 flex justify-center">
            <img
              src={book.image || "/placeholder-book.jpg"}
              alt={book.title}
              className="w-48 h-64 object-cover rounded-md shadow"
            />
          </div>
          <div className="md:w-2/3 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {book.title}
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              ISBN: {book.isbn || "N/A"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                  Tác giả
                </h3>
                <p className="text-gray-800">{book.author}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                  Năm xuất bản
                </h3>
                <p className="text-gray-800">{book.publishYear || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                  Danh mục
                </h3>
                <p className="text-gray-800">{book.category?.name || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                  Số lượng
                </h3>
                <p className="text-gray-800">{book.quantity || 0}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                  Số trang
                </h3>
                <p className="text-gray-800">{book.pageCount || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-1">
                  Ngôn ngữ
                </h3>
                <p className="text-gray-800">{book.language || "N/A"}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Mô tả
              </h3>
              <p className="text-gray-800">
                {book.description || "Không có mô tả"}
              </p>
            </div>

            <div className="flex space-x-2">
              <Link
                to={`/books/${book.slug || id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-500 text-white rounded flex items-center hover:bg-indigo-600"
              >
                <FaBookOpen className="mr-2" /> Xem trang công khai
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Xác nhận xóa</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa sách "{book.title}"? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Xóa sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookView;
