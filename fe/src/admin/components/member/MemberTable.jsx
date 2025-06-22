import React from "react";
import {
  FaEdit,
  FaClock,
  FaUser,
  FaIdCard,
  FaCalendarAlt,
} from "react-icons/fa";
import { useMemberAdmin } from "../../contexts/MemberAdminContext";

const MemberTable = () => {
  const { members, loading, openEditModal, currentPage, itemsPerPage } =
    useMemberAdmin();

  // Helper functions
  const getDisplayIndex = (index) => {
    return (currentPage - 1) * itemsPerPage + index + 1;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      Active: {
        className: "bg-green-100 text-green-800",
        label: "Hoạt động",
      },
      Inactive: {
        className: "bg-red-100 text-red-800",
        label: "Không hoạt động",
      },
    };

    const config = statusConfig[status] || {
      className: "bg-gray-100 text-gray-800",
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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Mobile scroll hint */}
      <div className="lg:hidden mb-3 mx-3 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 text-xs">
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
        <table className="min-w-[800px] lg:min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-12 lg:w-16">
                #
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[150px] lg:min-w-[180px]">
                Thành viên
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px] lg:min-w-[140px]">
                Mã thành viên
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[100px] lg:min-w-[120px]">
                Ngày tham gia
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px] lg:min-w-[140px]">
                Ngày hết hạn
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-20 lg:w-24">
                Mượn tối đa
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-20 lg:w-24">
                Đang mượn
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
            {members && members.length > 0 ? (
              [...members].reverse().map((member, index) => {
                const displayIndex = members.length - index;
                const expiryStatus = getExpiryStatus(member.expiryDate);

                return (
                  <tr
                    key={member.id}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                  >
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-xs lg:text-sm text-gray-500 text-center font-medium">
                      {displayIndex}
                    </td>
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 lg:h-10 w-8 lg:w-10">
                          <div className="h-8 lg:h-10 w-8 lg:w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-xs lg:text-sm">
                              {member.user?.firstName?.charAt(0) ||
                                member.user?.username?.charAt(0) ||
                                "M"}
                            </span>
                          </div>
                        </div>
                        <div className="ml-2 lg:ml-3 xl:ml-4 min-w-0 flex-1">
                          <div className="text-xs lg:text-sm font-semibold text-gray-900 truncate">
                            {member.user?.lastName} {member.user?.firstName}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-500 truncate">
                            @{member.user?.username}
                          </div>
                          {member.user?.email && (
                            <div className="text-xs text-gray-400 truncate">
                              {member.user.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4">
                      <div className="flex items-center">
                        <FaIdCard className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-xs lg:text-sm text-gray-900 font-mono">
                          {member.memberCode}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-xs lg:text-sm text-gray-900">
                          {formatDate(member.joinDate)}
                        </span>
                      </div>
                    </td>
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                        <div
                          className={`text-xs lg:text-sm ${expiryStatus.color} font-medium`}
                        >
                          {formatDate(member.expiryDate)}
                        </div>
                      </div>
                      {expiryStatus.label && (
                        <div className="flex items-center text-xs mt-1">
                          <FaClock className="mr-1 h-3 w-3" />
                          <span className={expiryStatus.color}>
                            {expiryStatus.label}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {member.maxLoans}
                      </span>
                    </td>
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          member.currentLoans > 0
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {member.currentLoans}
                      </span>
                    </td>
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                      {getStatusBadge(member.status)}
                    </td>
                    <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                      <button
                        onClick={() => openEditModal(member)}
                        className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-xs lg:text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
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
                  className="px-6 py-16 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FaUser className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không có thành viên nào
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Hiện tại chưa có thành viên nào trong hệ thống.
                    </p>
                    <p className="text-sm text-gray-400">
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
  );
};

export default MemberTable;
