import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useUserAdmin } from "../../contexts/UserAdminContext";

const UserForm = ({ isEdit = false }) => {
  const {
    formData,
    setFormData,
    selectedUser,
    showCreateModal,
    showEditModal,
    closeModals,
    createUser,
    updateUser,
    loading,
  } = useUserAdmin();

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isOpen = isEdit ? showEditModal : showCreateModal;
  const title = isEdit
    ? "Chỉnh Sửa Thông Tin Người Dùng"
    : "Tạo Người Dùng Mới";

  // Reset errors when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username là bắt buộc";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username phải có ít nhất 3 ký tự";
    }

    // Password validation (required for create, optional for edit)
    if (!isEdit && !formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Tên là bắt buộc";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Họ là bắt buộc";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Vai trò là bắt buộc";
    }

    // Gender validation
    if (formData.gender === "") {
      newErrors.gender = "Giới tính là bắt buộc";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      let success = false;

      if (isEdit && selectedUser) {
        success = await updateUser(selectedUser.id, formData);
      } else {
        success = await createUser(formData);
      }

      if (success) {
        closeModals();
      }
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={closeModals}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="Username"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.username ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mật khẩu {!isEdit && <span className="text-red-500">*</span>}
                {isEdit && (
                  <span className="text-gray-500 text-xs">
                    (Để trống nếu không đổi)
                  </span>
                )}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={
                  isEdit ? "Nhập mật khẩu mới (tùy chọn)" : "Mật khẩu"
                }
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Tên"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Họ"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Email"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Điện Thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Điện Thoại"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                disabled={isSubmitting}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Địa Chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Địa Chỉ"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
              />
            </div>

            {/* Role & Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Vai Trò <span className="text-red-500">*</span>
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                    errors.role ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn...</option>
                  <option value="admin">Quản Trị Viên</option>
                  <option value="member">Thành Viên</option>
                </select>
                {errors.role && (
                  <p className="mt-1 text-sm text-red-600">{errors.role}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Giới Tính <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Chọn...</option>
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeModals}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              disabled={isSubmitting}
            >
              Đóng
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
                </div>
              ) : isEdit ? (
                "Cập Nhật"
              ) : (
                "Tạo Mới"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
