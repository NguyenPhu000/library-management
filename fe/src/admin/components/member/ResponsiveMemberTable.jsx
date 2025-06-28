import React from "react";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useMemberAdmin } from "../../contexts/MemberAdminContext";

const ResponsiveMemberTable = () => {
  const { members, loading, openEditModal, currentPage, itemsPerPage } =
    useMemberAdmin();

  // Helper functions
  const getDisplayIndex = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };
  const handleDelete = async (member) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa thành viên "${member.user?.lastName} ${member.user?.firstName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      // Note: Implementation depends on MemberAdminContext methods
      console.log("Delete member:", member.id);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        className:
          "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200",
        label: "Hoạt động",
      },
      Inactive: {
        className: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
        label: "Không hoạt động",
      },
    };

    const config = statusConfig[status] || {
      className:
        "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
      label: status || "N/A",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
      >
        <div
          className={`w-2 h-2 rounded-full mr-2 ${
            status === "Active" ? "bg-green-400" : "bg-red-400"
          }`}
        ></div>
        {config.label}
      </span>
    );
  };

  const isExpiringSoon = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry >= 0;
  };

  const isExpired = (expiryDate) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    return expiry < today;
  };

  const getExpiryStatus = (expiryDate) => {
    if (isExpired(expiryDate)) {
      return { color: "text-red-600", label: "Đã hết hạn", icon: FaClock };
    }
    if (isExpiringSoon(expiryDate)) {
      return { color: "text-yellow-600", label: "Sắp hết hạn", icon: FaClock };
    }
    return { color: "text-gray-900", label: "", icon: null };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const truncateText = (text, maxLength = 30) => {
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
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
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
  if (!members || members.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <FaUser
          className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          size={48}
        />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không có thành viên nào
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Chưa có thành viên nào được thêm vào hệ thống.
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thành viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mã thành viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ngày hết hạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                  Mượn tối đa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                  Đang mượn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {members && members.length > 0 ? (
                [...members].reverse().map((member, index) => {
                  const displayIndex = members.length - index;
                  const expiryStatus = getExpiryStatus(member.expiryDate);

                  return (
                    <tr
                      key={member.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      {/* STT */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-center">
                        {displayIndex}
                      </td>

                      {/* Thành viên */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {member.user?.firstName?.charAt(0) ||
                                  member.user?.username?.charAt(0) ||
                                  "M"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.user?.lastName} {member.user?.firstName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              @{member.user?.username}
                            </div>
                            {member.user?.email && (
                              <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                                {member.user.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Mã thành viên */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaIdCard className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-white font-mono">
                            {member.memberCode}
                          </span>
                        </div>
                      </td>

                      {/* Ngày tham gia */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCalendarAlt className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {formatDate(member.joinDate)}
                          </span>
                        </div>
                      </td>

                      {/* Ngày hết hạn */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FaCalendarAlt className="w-4 h-4 text-gray-400 dark:text-gray-500 mr-2 flex-shrink-0" />
                          <div
                            className={`text-sm ${expiryStatus.color} dark:text-white font-medium`}
                          >
                            {formatDate(member.expiryDate)}
                          </div>
                        </div>
                        {expiryStatus.label && (
                          <div className="flex items-center text-xs mt-1">
                            <FaClock className="mr-1 h-3 w-3" />
                            <span
                              className={`${expiryStatus.color} dark:text-white`}
                            >
                              {expiryStatus.label}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Mượn tối đa */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          {member.maxLoans}
                        </span>
                      </td>

                      {/* Đang mượn */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.currentLoans > 0
                              ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          {member.currentLoans}
                        </span>
                      </td>

                      {/* Trạng thái */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getStatusBadge(member.status)}
                      </td>

                      {/* Thao tác */}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => openEditModal(member)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-lg border border-blue-200 dark:border-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-600 transition-colors"
                          title="Chỉnh sửa thành viên"
                        >
                          <FaEdit className="mr-1 h-3 w-3" />
                          <span className="hidden sm:inline">Sửa</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-16 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <FaUser className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        Không có thành viên nào
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Hiện tại chưa có thành viên nào trong hệ thống.
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Hãy thử đồng bộ dữ liệu hoặc kiểm tra kết nối.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {members && members.length > 0 ? (
          [...members].reverse().map((member, index) => {
            const displayIndex = members.length - index;
            const expiryStatus = getExpiryStatus(member.expiryDate);

            return (
              <div
                key={member.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                {/* Card Header */}
                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      #{displayIndex}
                    </span>
                    {getStatusBadge(member.status)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4">
                  <div className="flex space-x-4">
                    {/* Member Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {member.user?.firstName?.charAt(0) ||
                            member.user?.username?.charAt(0) ||
                            "M"}
                        </span>
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        {member.user?.lastName} {member.user?.firstName}
                      </h3>

                      <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <span className="mr-2">@</span>
                          <span className="truncate">
                            {member.user?.username}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <FaIdCard className="mr-1 flex-shrink-0" />
                          <span className="font-mono">{member.memberCode}</span>
                        </div>
                        {member.user?.email && (
                          <div className="flex items-center">
                            <FaEnvelope className="mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {member.user.email}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1 flex-shrink-0" />
                          <span>Tham gia: {formatDate(member.joinDate)}</span>
                        </div>
                        <div className="flex items-center">
                          <FaCalendarAlt className="mr-1 flex-shrink-0" />
                          <span
                            className={`${expiryStatus.color} dark:text-white`}
                          >
                            Hết hạn: {formatDate(member.expiryDate)}
                          </span>
                        </div>
                        {expiryStatus.label && (
                          <div className="flex items-center">
                            <FaClock className="mr-1 flex-shrink-0" />
                            <span
                              className={`${expiryStatus.color} dark:text-white`}
                            >
                              {expiryStatus.label}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="mt-2 flex space-x-2">
                        <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                          Tối đa: {member.maxLoans}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                            member.currentLoans > 0
                              ? "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                          }`}
                        >
                          Đang mượn: {member.currentLoans}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => openEditModal(member)}
                      className="w-full px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors flex items-center justify-center"
                    >
                      <FaEdit className="mr-1" />
                      Chỉnh sửa thành viên
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <FaUser
              className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
              size={48}
            />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Không có thành viên nào
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Hiện tại chưa có thành viên nào trong hệ thống.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default ResponsiveMemberTable;
