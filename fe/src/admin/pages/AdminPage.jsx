import React, { useState, useEffect } from "react";
import {
  FaBook,
  FaUsers,
  FaUserTag,
  FaMoneyBillWave,
  FaExclamationTriangle,
  FaSync,
  FaEdit,
  FaCheck,
  FaBan,
} from "react-icons/fa";
import adminBookService from "../services/adminBookService";
import adminUserService from "../services/adminUserService";
import adminMemberService from "../services/adminMemberService";
import adminLoanService from "../services/adminLoanService";
import adminPaymentService from "../services/adminPaymentService";
import Swal from "sweetalert2";

const DashboardCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} text-white mr-4`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

const AdminPage = () => {
  const [stats, setStats] = useState({
    books: 0,
    users: 0,
    members: 0,
    loans: 0,
    payments: 0,
    overdueLoans: 0,
    recentBooks: [],
    recentPayments: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch all stats in parallel
        const [
          bookStats,
          userStats,
          memberStats,
          loanStats,
          paymentStats,
          overdueLoans,
        ] = await Promise.all([
          adminBookService.getBookStats(),
          adminUserService.getUserStats(),
          adminMemberService.getMemberStats(),
          adminLoanService.getLoanStats(),
          adminPaymentService.getPaymentStats(),
          adminLoanService.getOverdueLoans(),
        ]);

        setStats({
          books: bookStats.totalBooks || 0,
          users: userStats.totalUsers || 0,
          members: memberStats.totalMembers || 0,
          loans: loanStats.totalLoans || 0,
          payments: paymentStats.totalPayments || 0,
          overdueLoans: overdueLoans.length || 0,
          recentBooks: bookStats.recentBooks || [],
          recentPayments: paymentStats.recentPayments || [],
        });
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        setError(
          "Không thể tải dữ liệu bảng điều khiển. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
        <p>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bảng Điều Khiển Quản Trị</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Tổng Số Sách"
          value={stats.books}
          icon={<FaBook size={24} />}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Người Dùng"
          value={stats.users}
          icon={<FaUsers size={24} />}
          color="bg-green-500"
        />
        <DashboardCard
          title="Thành Viên"
          value={stats.members}
          icon={<FaUserTag size={24} />}
          color="bg-purple-500"
        />
        <DashboardCard
          title="Lượt Mượn Sách"
          value={stats.loans}
          icon={<FaBook size={24} />}
          color="bg-yellow-500"
        />
        <DashboardCard
          title="Thanh Toán"
          value={stats.payments}
          icon={<FaMoneyBillWave size={24} />}
          color="bg-indigo-500"
        />
        <DashboardCard
          title="Sách Quá Hạn"
          value={stats.overdueLoans}
          icon={<FaExclamationTriangle size={24} />}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Sách Mới Nhất</h2>
          {stats.recentBooks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên sách
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tác giả
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày thêm
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentBooks.map((book) => (
                    <tr key={book.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {book.title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {book.author}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(book.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Không có sách mới nào.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Thanh Toán Gần Đây</h2>
          {stats.recentPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số tiền
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {stats.recentPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {payment.user?.username || "N/A"}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {payment.amount.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.status === "completed"
                            ? "Hoàn thành"
                            : payment.status === "pending"
                            ? "Đang xử lý"
                            : "Đã hủy"}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {new Date(payment.createdAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">Không có thanh toán gần đây.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const MemberManagePage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    member_id: "",
    member_code: "",
    join_date: "",
    expiry_date: "",
    max_loans: 0,
    current_loans: 0,
    status: "Active",
  });

  const fetchMembers = async (page = 1) => {
    try {
      setLoading(true);
      const response = await adminMemberService.getAllMembers({
        page,
        limit: 10,
      });

      if (response && response.data) {
        setMembers(response.data);
        setTotalPages(response.totalPages || 1);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching members:", error);
      setError("Không thể tải danh sách thành viên. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers(1);
  }, []);

  const handlePageChange = (page) => {
    fetchMembers(page);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setFormData({
      member_id: member.member_id,
      member_code: member.member_code,
      join_date: formatDateForInput(member.join_date),
      expiry_date: formatDateForInput(member.expiry_date),
      max_loans: member.max_loans,
      current_loans: member.current_loans,
      status: member.status,
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminMemberService.updateMember(formData.member_id, formData);
      setIsModalOpen(false);
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Cập nhật thành viên thành công",
      });
      fetchMembers(currentPage);
    } catch (error) {
      console.error("Error updating member:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể cập nhật thành viên. Vui lòng thử lại sau.",
      });
    }
  };

  const handleSyncMembers = async () => {
    try {
      setLoading(true);
      await adminMemberService.syncMembers();
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Đồng bộ thành viên thành công",
      });
      fetchMembers(1);
    } catch (error) {
      console.error("Error syncing members:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Không thể đồng bộ thành viên. Vui lòng thử lại sau.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Helper function to format date for input fields
  const formatDateForInput = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thành viên</h1>
        <button
          onClick={handleSyncMembers}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
          disabled={loading}
        >
          <FaSync className={`mr-2 ${loading ? "animate-spin" : ""}`} />
          Đồng bộ thành viên
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Tên đăng nhập
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Mã thành viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Ngày hết hạn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Số sách tối đa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Đang mượn
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="9" className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  </td>
                </tr>
              ) : members.length > 0 ? (
                members.map((member, index) => (
                  <tr key={member.member_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.User ? member.User.username : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.member_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(member.join_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(member.expiry_date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {member.max_loans}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                      {member.current_loans}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {member.status === "Active" ? (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Không hoạt động
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center"
                      >
                        <FaEdit className="mr-1" /> Sửa
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Không có dữ liệu thành viên
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {totalPages > 1 && (
          <div className="flex justify-center p-4">
            <nav className="flex items-center">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-l border ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                Trước
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 border-t border-b ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white text-blue-600 hover:bg-blue-50"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-r border ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white text-blue-600 hover:bg-blue-50"
                }`}
              >
                Sau
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modal Chỉnh Sửa Thành Viên */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                Chỉnh Sửa Thành Viên
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <input
                type="hidden"
                name="member_id"
                value={formData.member_id}
              />

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  value={selectedMember?.User?.username || ""}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Mã Thành Viên
                </label>
                <input
                  type="text"
                  name="member_code"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.member_code}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Ngày Tham Gia
                </label>
                <input
                  type="date"
                  name="join_date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  value={formData.join_date}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Ngày Hết Hạn
                </label>
                <input
                  type="date"
                  name="expiry_date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.expiry_date}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Số Lượng Mượn Tối Đa
                </label>
                <input
                  type="number"
                  name="max_loans"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.max_loans}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Số Lượng Mượn Hiện Tại
                </label>
                <input
                  type="number"
                  name="current_loans"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-700"
                  value={formData.current_loans}
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Trạng Thái
                </label>
                <select
                  name="status"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Hoạt Động</option>
                  <option value="Inactive">Không Hoạt Động</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagePage;
