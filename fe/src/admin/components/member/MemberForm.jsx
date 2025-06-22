import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useMemberAdmin } from "../../contexts/MemberAdminContext";

const MemberForm = () => {
  const {
    isEditModalOpen,
    closeEditModal,
    editingMember,
    updateMember,
    loading,
  } = useMemberAdmin();

  const [formData, setFormData] = useState({
    member_id: "",
    username: "",
    member_code: "",
    join_date: "",
    expiry_date: "",
    max_loans: "",
    current_loans: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingMember) {
      setFormData({
        member_id: editingMember.id || "",
        username: editingMember.user?.username || "",
        member_code: editingMember.memberCode || "",
        join_date: editingMember.joinDate
          ? editingMember.joinDate.split("T")[0]
          : "",
        expiry_date: editingMember.expiryDate
          ? editingMember.expiryDate.split("T")[0]
          : "",
        max_loans: editingMember.maxLoans || "",
        current_loans: editingMember.currentLoans || "",
        status: editingMember.status || "Active",
      });
      setErrors({});
    }
  }, [editingMember]);

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.member_code.trim()) {
      newErrors.member_code = "Mã thành viên không được trống";
    }

    if (!formData.expiry_date) {
      newErrors.expiry_date = "Ngày hết hạn không được trống";
    }

    if (!formData.max_loans || formData.max_loans < 1) {
      newErrors.max_loans = "Số lượng mượn tối đa phải lớn hơn 0";
    }

    if (!formData.status) {
      newErrors.status = "Trạng thái không được trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        member_id: formData.member_id,
        member_code: formData.member_code,
        expiry_date: formData.expiry_date,
        max_loans: parseInt(formData.max_loans),
        current_loans: parseInt(formData.current_loans),
        status: formData.status,
      };

      console.log("MemberForm: Submitting update data:", updateData);
      await updateMember(updateData);
      closeEditModal();
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  const handleClose = () => {
    setFormData({
      member_id: "",
      username: "",
      member_code: "",
      join_date: "",
      expiry_date: "",
      max_loans: "",
      current_loans: "",
      status: "Active",
    });
    setErrors({});
    closeEditModal();
  };

  if (!isEditModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h5 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Chỉnh Sửa Thành Viên
          </h5>
          <button
            onClick={handleClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hidden field - member_id */}
            <input type="hidden" name="member_id" value={formData.member_id} />

            {/* Username - Disabled giống EJS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                value={formData.username}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Member Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mã Thành Viên
              </label>
              <input
                type="text"
                name="member_code"
                value={formData.member_code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.member_code
                    ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.member_code && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.member_code}
                </p>
              )}
            </div>

            {/* Join Date - Disabled giống EJS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày Tham Gia
              </label>
              <input
                type="date"
                value={formData.join_date}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Ngày Hết Hạn
              </label>
              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.expiry_date
                    ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.expiry_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.expiry_date}
                </p>
              )}
            </div>

            {/* Max Loans */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số Lượng Mượn Tối Đa
              </label>
              <input
                type="number"
                name="max_loans"
                value={formData.max_loans}
                onChange={handleChange}
                min="1"
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.max_loans
                    ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              />
              {errors.max_loans && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.max_loans}
                </p>
              )}
            </div>

            {/* Current Loans - Disabled giống EJS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Số Lượng Mượn Hiện Tại
              </label>
              <input
                type="number"
                value={formData.current_loans}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Trạng Thái
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.status
                    ? "border-red-300 dark:border-red-600 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
              >
                <option value="Active">Hoạt Động</option>
                <option value="Inactive">Không Hoạt Động</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.status}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MemberForm;
