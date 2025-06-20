import React from "react";
import { FaEdit, FaTrash, FaClock, FaUser, FaIdCard } from "react-icons/fa";
import { useMemberAdmin } from "../../contexts/MemberAdminContext";

const MemberTable = () => {
  const {
    members,
    loading,
    openEditModal,
    deleteMember,
    currentPage,
    itemsPerPage,
  } = useMemberAdmin();

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
        <table className="min-w-[800px] lg:min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-12 lg:w-16">
                #
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[140px] lg:min-w-[160px]">
                Thành viên
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[120px]">
                Mã thành viên
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider min-w-[100px]">
                Ngày hết hạn
              </th>
              <th className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-24 lg:w-28">
                Mượn sách
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
            {members.length > 0 ? (
              members.map((member, index) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                >
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-xs lg:text-sm text-gray-500 text-center font-medium">
                    {getDisplayIndex(index)}
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
                          {member.user
                            ? `${member.user.lastName} ${member.user.firstName}`
                            : "N/A"}
                        </div>
                        <div className="text-xs lg:text-sm text-gray-500 truncate">
                          @{member.user?.username || "N/A"}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {member.user?.email || "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4">
                    <div className="flex items-center text-xs lg:text-sm">
                      <FaIdCard className="mr-2 h-3 w-3 text-purple-500 flex-shrink-0" />
                      <span className="font-mono font-medium text-gray-900">
                        {member.memberCode}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4">
                    <div className="space-y-1">
                      <div
                        className={`text-xs lg:text-sm font-medium ${
                          isExpired(member.expiryDate)
                            ? "text-red-600"
                            : isExpiringSoon(member.expiryDate)
                            ? "text-yellow-600"
                            : "text-gray-900"
                        }`}
                      >
                        {formatDate(member.expiryDate)}
                      </div>
                      {(isExpired(member.expiryDate) ||
                        isExpiringSoon(member.expiryDate)) && (
                        <div className="flex items-center text-xs">
                          <FaClock className="mr-1 h-3 w-3" />
                          <span
                            className={
                              isExpired(member.expiryDate)
                                ? "text-red-600 font-medium"
                                : "text-yellow-600 font-medium"
                            }
                          >
                            {isExpired(member.expiryDate)
                              ? "Đã hết hạn"
                              : "Sắp hết hạn"}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                    <div className="space-y-1">
                      <div className="text-xs lg:text-sm font-semibold text-gray-900">
                        {member.currentLoans}/{member.maxLoans}
                      </div>
                      <div
                        className={`text-xs ${
                          member.currentLoans >= member.maxLoans
                            ? "text-red-600 font-medium"
                            : "text-gray-500"
                        }`}
                      >
                        {member.currentLoans >= member.maxLoans
                          ? "Đã tối đa"
                          : "Có thể mượn"}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                    {getStatusBadge(member.status)}
                  </td>
                  <td className="px-2 lg:px-4 xl:px-6 py-2 lg:py-3 xl:py-4 text-center">
                    <div className="flex items-center justify-center space-x-1 lg:space-x-2">
                      <button
                        onClick={() => openEditModal(member)}
                        className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                        title="Chỉnh sửa"
                      >
                        <FaEdit className="lg:mr-1 h-3 w-3" />
                        <span className="hidden lg:inline">Sửa</span>
                      </button>
                      <button
                        onClick={() =>
                          deleteMember(
                            member.id,
                            member.user?.username || member.memberCode
                          )
                        }
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
                  colSpan="7"
                  className="px-6 py-16 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <FaUser className="w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Không có dữ liệu
                    </h3>
                    <p className="text-gray-500">
                      Không tìm thấy thành viên nào phù hợp với tiêu chí tìm
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

export default MemberTable;
