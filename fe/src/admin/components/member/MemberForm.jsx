import React, { useState, useEffect } from "react";
import { FaTimes, FaSave, FaUser, FaCalendar, FaHashtag } from "react-icons/fa";
import { useMemberAdmin } from "../../contexts/MemberAdminContext";

const MemberForm = () => {
  const {
    isEditModalOpen,
    selectedMember,
    closeEditModal,
    updateMember,
    loading,
  } = useMemberAdmin();

  const [formData, setFormData] = useState({
    memberId: "",
    expiryDate: "",
    maxLoans: 5,
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes or selected member changes
  useEffect(() => {
    if (isEditModalOpen && selectedMember) {
      setFormData({
        memberId: selectedMember.memberId || "",
        expiryDate: selectedMember.expiryDate
          ? new Date(selectedMember.expiryDate).toISOString().split("T")[0]
          : "",
        maxLoans: selectedMember.maxLoans || 5,
        status: selectedMember.status || "Active",
      });
      setErrors({});
    } else {
      setFormData({
        memberId: "",
        expiryDate: "",
        maxLoans: 5,
        status: "Active",
      });
      setErrors({});
    }
  }, [isEditModalOpen, selectedMember]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.expiryDate) {
      newErrors.expiryDate = "Vui lòng chọn ngày hết hạn";
    } else {
      const expiryDate = new Date(formData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (expiryDate < today) {
        newErrors.expiryDate = "Ngày hết hạn không được là ngày trong quá khứ";
      }
    }

    if (!formData.maxLoans || formData.maxLoans < 1) {
      newErrors.maxLoans = "Số lượng mượn tối đa phải lớn hơn 0";
    } else if (formData.maxLoans > 20) {
      newErrors.maxLoans = "Số lượng mượn tối đa không được vượt quá 20";
    }

    if (!formData.status) {
      newErrors.status = "Vui lòng chọn trạng thái";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await updateMember(formData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxLoans" ? parseInt(value) || 0 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (!isEditModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <FaUser className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                Chỉnh sửa thành viên
              </h2>
              <p className="text-sm text-gray-500">
                Cập nhật thông tin thành viên
              </p>
            </div>
          </div>
          <button
            onClick={closeEditModal}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            disabled={loading}
          >
            <FaTimes className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Member Info */}
        {selectedMember && (
          <div className="p-6 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-12 w-12">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {selectedMember.user?.firstName?.charAt(0) ||
                      selectedMember.user?.username?.charAt(0) ||
                      "M"}
                  </span>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-lg font-semibold text-gray-900">
                  {selectedMember.user
                    ? `${selectedMember.user.lastName} ${selectedMember.user.firstName}`
                    : "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  @{selectedMember.user?.username || "N/A"}
                </div>
                <div className="text-sm text-gray-500">
                  {selectedMember.memberCode}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Ngày tham gia:</span>
                <div className="font-medium">
                  {formatDate(selectedMember.joinDate)}
                </div>
              </div>
              <div>
                <span className="text-gray-500">Đang mượn:</span>
                <div className="font-medium">
                  {selectedMember.currentLoans} cuốn
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Expiry Date */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaCalendar className="w-4 h-4 mr-2 text-gray-400" />
              Ngày hết hạn
            </label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                errors.expiryDate ? "border-red-300" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.expiryDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
            )}
          </div>

          {/* Max Loans */}
          <div>
            <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FaHashtag className="w-4 h-4 mr-2 text-gray-400" />
              Số lượng mượn tối đa
            </label>
            <input
              type="number"
              name="maxLoans"
              value={formData.maxLoans}
              onChange={handleInputChange}
              min="1"
              max="20"
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                errors.maxLoans ? "border-red-300" : "border-gray-300"
              }`}
              disabled={loading}
            />
            {errors.maxLoans && (
              <p className="mt-1 text-sm text-red-600">{errors.maxLoans}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Thành viên có thể mượn tối đa từ 1-20 cuốn sách
            </p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors ${
                errors.status ? "border-red-300" : "border-gray-300"
              }`}
              disabled={loading}
            >
              <option value="Active">Hoạt động</option>
              <option value="Inactive">Không hoạt động</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={closeEditModal}
              disabled={loading}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;
