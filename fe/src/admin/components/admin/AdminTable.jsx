import React, { useState } from "react";
import { FiEdit2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const AdminTable = ({ admins = [], isLoading, onUpdateType }) => {
  // Nếu dữ liệu chưa phải array, cố gắng lấy từ các field phổ biến
  const adminList = Array.isArray(admins)
    ? admins
    : Array.isArray(admins.data)
    ? admins.data
    : Array.isArray(admins.admins)
    ? admins.admins
    : [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdmins = adminList.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(adminList.length / itemsPerPage));

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleChangeRole = (admin) => {
    const nextType = admin.admin_type === "admin" ? "librarian" : "admin";
    const question =
      admin.admin_type === "admin"
        ? "Bạn có muốn chuyển quyền Admin thành Thủ thư không?"
        : "Bạn có muốn chuyển Thủ thư thành Admin không?";

    Swal.fire({
      title: "Xác nhận",
      text: question,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Có",
      cancelButtonText: "Không",
    }).then((result) => {
      if (result.isConfirmed) {
        onUpdateType(admin.admin_id || admin.id, nextType);
      }
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-current border-r-transparent" />
      </div>
    );
  }

  // Empty state
  if (adminList.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500 dark:text-gray-400">
        Chưa có dữ liệu nhân sự.
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-left text-sm font-semibold">STT</th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Tài khoản
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Họ tên
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Phòng ban
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                Loại
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {currentAdmins.map((admin, index) => (
              <motion.tr
                key={admin.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-700/30"
              >
                <td className="px-6 py-4 text-sm">{startIndex + index + 1}</td>
                <td className="px-6 py-4 text-sm">
                  {admin.username ||
                    admin?.user?.username ||
                    admin?.User?.username ||
                    "-"}
                </td>
                <td className="px-6 py-4 text-sm">
                  {admin.fullName ||
                    `${admin?.User?.first_name || ""} ${
                      admin?.User?.last_name || ""
                    }`.trim() ||
                    `${admin?.user?.first_name || ""} ${
                      admin?.user?.last_name || ""
                    }`.trim() ||
                    "-"}
                </td>
                <td className="px-6 py-4 text-sm">{admin.department || "-"}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      admin.admin_type === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300"
                    }`}
                  >
                    {admin.admin_type === "admin" ? "Admin" : "Thủ thư"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChangeRole(admin)}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    <FiEdit2 className="w-4 h-4 mr-1" />
                    Chuyển quyền
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {startIndex + 1}-{Math.min(endIndex, adminList.length)}{" "}
            trong số {adminList.length} bản ghi
          </div>
          <div className="flex items-center space-x-2">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-lg text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {page}
              </button>
            ))}
            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTable;
