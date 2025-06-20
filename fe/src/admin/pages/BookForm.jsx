import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaSave, FaTimes, FaImage } from "react-icons/fa";
import adminBookService from "../services/adminBookService";
import adminCategoryService from "../services/adminCategoryService";
import Swal from "sweetalert2";

const BookForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    description: "",
    publication_year: currentYear,
    publisher: "",
    total_copies: 1,
    available_copies: 1,
    status: "available",
    category_id: [],
    cover_image: null,
    current_cover: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await adminCategoryService.getAllCategories();
        setCategories(response.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setSubmitError("Không thể tải danh mục. Vui lòng thử lại sau.");
      }
    };

    const fetchBook = async () => {
      if (!isEditMode) return;

      try {
        setLoading(true);
        const response = await adminBookService.getBookById(id);
        const book = response.data;

        // Map danh mục nếu có
        const categoryIds =
          book.categories && book.categories.length > 0
            ? book.categories.map((cat) => cat.category_id)
            : [];

        setFormData({
          title: book.title || "",
          author: book.author || "",
          isbn: book.isbn || "",
          description: book.description || "",
          publication_year: book.publication_year || currentYear,
          publisher: book.publisher || "",
          total_copies: book.total_copies || 1,
          available_copies: book.available_copies || 1,
          status: book.status || "available",
          category_id: categoryIds,
          cover_image: null,
          current_cover: book.cover_image || "",
        });

        if (book.cover_image) {
          setImagePreview(`/uploads/${book.cover_image}`);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
        setSubmitError("Không thể tải thông tin sách. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
    fetchBook();
  }, [id, isEditMode, currentYear]);

  const validateForm = () => {
    const errors = {};

    if (!formData.title.trim()) errors.title = "Vui lòng nhập tên sách";
    if (!formData.author.trim()) errors.author = "Vui lòng nhập tên tác giả";

    if (formData.publication_year) {
      const year = parseInt(formData.publication_year);
      if (isNaN(year) || year < 1000 || year > currentYear + 1) {
        errors.publication_year = `Năm xuất bản phải từ 1000 đến ${
          currentYear + 1
        }`;
      }
    }

    if (formData.total_copies) {
      const copies = parseInt(formData.total_copies);
      if (isNaN(copies) || copies < 0) {
        errors.total_copies = "Số lượng không được âm";
      }
    }

    if (formData.available_copies) {
      const available = parseInt(formData.available_copies);
      const total = parseInt(formData.total_copies);

      if (isNaN(available) || available < 0) {
        errors.available_copies = "Số lượng không được âm";
      } else if (available > total) {
        errors.available_copies = "Số lượng có sẵn không thể lớn hơn tổng số";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files, options } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, cover_image: file }));

        // Tạo preview ảnh
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === "select-multiple") {
      const selectedOptions = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setFormData((prev) => ({ ...prev, [name]: selectedOptions }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Xóa lỗi khi người dùng đã sửa
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Xử lý khi thay đổi tổng số để cập nhật số lượng có sẵn
  const handleTotalCopiesChange = (e) => {
    const total = parseInt(e.target.value);
    if (!isNaN(total) && total >= 0) {
      // Nếu đang thêm mới, đặt available = total
      if (!isEditMode) {
        setFormData((prev) => ({
          ...prev,
          total_copies: total,
          available_copies: total,
        }));
      } else {
        // Nếu đang sửa, giữ nguyên available hoặc cập nhật nếu available > total
        const available = parseInt(formData.available_copies);
        setFormData((prev) => ({
          ...prev,
          total_copies: total,
          available_copies: available > total ? total : available,
        }));
      }
    } else {
      setFormData((prev) => ({ ...prev, total_copies: e.target.value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      setSubmitError("");

      if (isEditMode) {
        await adminBookService.updateBook(id, formData);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Cập nhật sách thành công",
        }).then(() => {
          navigate("/admin/books");
        });
      } else {
        const response = await adminBookService.createBook(formData);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: "Thêm sách mới thành công",
        }).then(() => {
          navigate("/admin/books");
        });
      }
    } catch (error) {
      console.error("Error saving book:", error);
      setSubmitError(
        `Không thể ${
          isEditMode ? "cập nhật" : "thêm"
        } sách. Vui lòng thử lại sau.`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Link
            to="/admin/books"
            className="mr-4 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            {isEditMode ? "Chỉnh sửa sách" : "Thêm sách mới"}
          </h1>
        </div>
      </div>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {submitError}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cột bên trái */}
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="isbn"
                >
                  ISBN
                </label>
                <input
                  type="text"
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="Nhập ISBN"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="title"
                >
                  Tiêu Đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tiêu đề sách"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.title ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.title}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="author"
                >
                  Tác Giả <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder="Nhập tên tác giả"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.author ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {formErrors.author && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.author}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="publication_year"
                >
                  Năm Xuất Bản
                </label>
                <input
                  type="number"
                  id="publication_year"
                  name="publication_year"
                  value={formData.publication_year}
                  onChange={handleChange}
                  placeholder="Nhập năm xuất bản"
                  max={currentYear + 1}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.publication_year
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.publication_year && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.publication_year}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="publisher"
                >
                  Nhà Xuất Bản
                </label>
                <input
                  type="text"
                  id="publisher"
                  name="publisher"
                  value={formData.publisher}
                  onChange={handleChange}
                  placeholder="Nhập tên nhà xuất bản"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="description"
                >
                  Mô Tả
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Nhập mô tả sách"
                  rows="6"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ resize: "vertical", minHeight: "150px" }}
                ></textarea>
              </div>
            </div>

            {/* Cột bên phải */}
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="total_copies"
                >
                  Tổng Số Bản
                </label>
                <input
                  type="number"
                  id="total_copies"
                  name="total_copies"
                  value={formData.total_copies}
                  onChange={handleTotalCopiesChange}
                  min="0"
                  placeholder="Nhập tổng số lượng sách"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.total_copies
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {formErrors.total_copies && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.total_copies}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="available_copies"
                >
                  Số Bản Có Sẵn
                </label>
                <input
                  type="number"
                  id="available_copies"
                  name="available_copies"
                  value={formData.available_copies}
                  onChange={handleChange}
                  min="0"
                  max={formData.total_copies}
                  placeholder="Nhập số lượng sách có sẵn"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.available_copies
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={!isEditMode}
                />
                {formErrors.available_copies && (
                  <p className="mt-1 text-sm text-red-500">
                    {formErrors.available_copies}
                  </p>
                )}
                {!isEditMode && (
                  <p className="mt-1 text-sm text-gray-500">
                    Số bản có sẵn sẽ được đặt bằng tổng số bản khi tạo mới.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="status"
                >
                  Trạng Thái
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!isEditMode}
                >
                  <option value="available">Còn sách</option>
                  <option value="unavailable">Hết sách</option>
                </select>
                {!isEditMode && (
                  <p className="mt-1 text-sm text-gray-500">
                    Trạng thái sẽ được đặt tự động dựa trên số bản có sẵn.
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="category_id"
                >
                  Danh Mục
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  multiple
                  value={formData.category_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  size="5"
                >
                  {categories.map((category) => (
                    <option
                      key={category.category_id}
                      value={category.category_id}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Giữ Ctrl (hoặc Command trên Mac) để chọn nhiều danh mục.
                </p>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-medium mb-2"
                  htmlFor="cover_image"
                >
                  Ảnh Bìa
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <label
                      htmlFor="cover_image"
                      className="flex items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaImage className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Nhấp để tải ảnh</span>
                        </p>
                        <p className="text-xs text-gray-500">
                          PNG, JPG hoặc JPEG
                        </p>
                      </div>
                      <input
                        id="cover_image"
                        name="cover_image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleChange}
                      />
                    </label>
                  </div>
                  <div className="flex items-center justify-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Ảnh bìa sách"
                        className="max-h-40 max-w-full object-contain border rounded"
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                        Chưa có ảnh
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Link
              to="/admin/books"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
            >
              <FaTimes className="mr-2" /> Hủy
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center disabled:bg-blue-300"
            >
              <FaSave className="mr-2" />
              {loading ? "Đang xử lý..." : isEditMode ? "Cập nhật" : "Tạo sách"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm;
