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
  FaUserShield,
  FaCheckCircle,
  FaTimesCircle,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import Swal from "sweetalert2";
import { useUserAdmin } from "../../contexts/UserAdminContext";

const ResponsiveUserTable = () => {
  const {
    users,
    loading,
    currentPage,
    usersPerPage,
    openEditModal,
    deleteUser,
    toggleUserStatus,
  } = useUserAdmin();

  const getDisplayIndex = (index) => {
    return (currentPage - 1) * usersPerPage + index + 1;
  };

  const formatGender = (gender) => {
    return gender === "1" || gender === 1 || gender === true ? "Nam" : "Nữ";
  };
  const handleDelete = async (user) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: `Bạn có chắc chắn muốn xóa người dùng "${user.lastName} ${user.firstName}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (result.isConfirmed) {
      deleteUser(user.id, user.username);
    }
  };

  const getStatusBadge = (isActive) => {
    if (isActive) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
          <FaCheckCircle className="mr-1" />
          Hoạt động
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
          <FaTimesCircle className="mr-1" />
          Tạm khóa
        </span>
      );
    }
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
  if (!users || users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
        <FaUser
          className="mx-auto text-gray-300 dark:text-gray-600 mb-4"
          size={48}
        />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Không có người dùng nào
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Chưa có người dùng nào được thêm vào hệ thống.
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
                  Tài khoản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                  Vai trò
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Địa chỉ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider text-center">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  {/* STT */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {getDisplayIndex(index)}
                  </td>

                  {/* Họ và tên */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user.firstName?.charAt(0) ||
                              user.username?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.lastName} {user.firstName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Vai trò */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Member"}
                    </span>
                  </td>

                  {/* Liên hệ */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900 dark:text-white">
                        <FaEnvelope className="mr-2 text-gray-400" />
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                        >
                          {truncateText(user.email, 30)}
                        </a>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <FaPhone className="mr-2 text-gray-400" />
                        <span className="truncate">{user.phone}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            formatGender(user.gender) === "Nam"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                              : "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                          }`}
                        >
                          {formatGender(user.gender)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Địa chỉ */}
                  <td className="hidden lg:table-cell px-6 py-4 text-sm text-gray-900 dark:text-white">
                    <div
                      className="truncate max-w-[200px]"
                      title={user.address}
                    >
                      {user.address}
                    </div>
                  </td>

                  {/* Trạng thái */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      onClick={() =>
                        toggleUserStatus(user.id, user.isActive, user.username)
                      }
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        user.isActive
                          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                          : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                      }`}
                    >
                      {user.isActive ? (
                        <>
                          <FaToggleOn className="mr-1" />
                          Hoạt động
                        </>
                      ) : (
                        <>
                          <FaToggleOff className="mr-1" />
                          Tạm khóa
                        </>
                      )}
                    </button>
                  </td>

                  {/* Thao tác */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
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
        {users.map((user, index) => (
          <div
            key={user.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Card Header */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  #{getDisplayIndex(index)}
                </span>
                <button
                  onClick={() =>
                    toggleUserStatus(user.id, user.isActive, user.username)
                  }
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                    user.isActive
                      ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                      : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50"
                  }`}
                >
                  {user.isActive ? (
                    <>
                      <FaToggleOn className="mr-1" />
                      Hoạt động
                    </>
                  ) : (
                    <>
                      <FaToggleOff className="mr-1" />
                      Tạm khóa
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-4">
              <div className="flex space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.firstName?.charAt(0) || user.username?.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    {user.lastName} {user.firstName}
                  </h3>

                  <div className="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <span className="mr-2">@</span>
                      <span className="truncate">{user.username}</span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="mr-1 flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center">
                        <FaPhone className="mr-1 flex-shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
                            : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Member"}
                      </span>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          formatGender(user.gender) === "Nam"
                            ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300"
                            : "bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300"
                        }`}
                      >
                        {formatGender(user.gender)}
                      </span>
                    </div>
                    {user.address && (
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 flex-shrink-0" />
                        <span className="truncate" title={user.address}>
                          {user.address}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="flex-1 px-3 py-2 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors flex items-center justify-center"
                  >
                    <FaEdit className="mr-1" />
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(user)}
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

export default ResponsiveUserTable;
