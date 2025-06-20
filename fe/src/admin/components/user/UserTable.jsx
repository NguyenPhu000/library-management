import React from "react";
import { FaEdit, FaTrash, FaToggleOn, FaToggleOff } from "react-icons/fa";
import { useUserAdmin } from "../../contexts/UserAdminContext";

const UserTable = () => {
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

  const formatRole = (role) => {
    return role === "admin" ? "Quản Trị Viên" : "Thành Viên";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Mobile scroll hint */}
      <div className="lg:hidden mb-3 mx-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs">
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mr-2 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16l4-4m0 0l4-4m-4 4H3"
            />
          </svg>
          <span>Vuốt ngang để xem đầy đủ thông tin</span>
        </div>
      </div>
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-[700px] lg:min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-12 lg:w-16">
                #
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px] lg:min-w-[140px]">
                Người dùng
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-20 lg:w-24">
                Vai trò
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[150px] lg:min-w-[200px]">
                Liên hệ
              </th>
              <th className="hidden lg:table-cell px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider max-w-[150px] lg:max-w-[200px]">
                Địa chỉ
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-24 lg:w-28">
                Trạng thái
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-28 lg:w-32">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-xs lg:text-sm text-gray-500 text-center font-medium">
                    {getDisplayIndex(index)}
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-8 lg:h-10 w-8 lg:w-10">
                        <div className="h-8 lg:h-10 w-8 lg:w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-xs lg:text-sm">
                            {user.firstName?.charAt(0) ||
                              user.username?.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                        <div className="text-xs lg:text-sm font-semibold text-gray-900 truncate">
                          {user.lastName} {user.firstName}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-500 truncate">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Member"}
                    </span>
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4">
                    <div className="space-y-1">
                      <div className="flex items-center text-xs lg:text-sm text-gray-900">
                        <svg
                          className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2 text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 8l7.89 7.89a2 2 0 002.83 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <a
                          href={`mailto:${user.email}`}
                          className="hover:text-blue-600 transition-colors truncate"
                        >
                          {user.email}
                        </a>
                      </div>
                      <div className="flex items-center text-xs lg:text-sm text-gray-500">
                        <svg
                          className="w-3 lg:w-4 h-3 lg:h-4 mr-1 lg:mr-2 text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="truncate">{user.phone}</span>
                      </div>
                      <div className="lg:hidden mt-1">
                        <div
                          className="text-xs text-gray-500 truncate"
                          title={user.address}
                        >
                          📍 {user.address}
                        </div>
                      </div>
                      <div className="flex items-center text-xs lg:text-sm text-gray-500">
                        <span
                          className={`inline-flex items-center px-1.5 lg:px-2 py-0.5 rounded text-xs font-medium ${
                            formatGender(user.gender) === "Nam"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {formatGender(user.gender)}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-xs lg:text-sm text-gray-900 max-w-[150px] lg:max-w-[200px]">
                    <div className="truncate" title={user.address}>
                      {user.address}
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                    <button
                      onClick={() =>
                        toggleUserStatus(user.id, user.isActive, user.username)
                      }
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        user.isActive
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mr-2 ${
                          user.isActive ? "bg-green-400" : "bg-red-400"
                        }`}
                      ></div>
                      {user.isActive ? "Hoạt động" : "Tạm khóa"}
                    </button>
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                    <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                      <button
                        onClick={() => openEditModal(user)}
                        className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        title="Chỉnh sửa"
                      >
                        <FaEdit className="lg:mr-1 h-3 w-3" />
                        <span className="hidden lg:inline">Sửa</span>
                      </button>
                      <button
                        onClick={() => deleteUser(user.id, user.username)}
                        className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                        title="Xóa"
                      >
                        <FaTrash className="lg:mr-1 h-3 w-3" />
                        <span className="hidden lg:inline">Xóa</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-16 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <svg
                      className="w-16 h-16 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1"
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không có dữ liệu
                    </h3>
                    <p className="text-gray-500">
                      Không tìm thấy người dùng nào phù hợp với tiêu chí tìm
                      kiếm.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
