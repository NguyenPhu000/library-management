import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBook,
  FaUsers,
  FaExchangeAlt,
  FaMoneyBill,
  FaChartBar,
  FaArrowUp,
  FaArrowDown,
  FaUserTag,
  FaCalendarAlt,
} from "react-icons/fa";
import adminBookService from "../services/adminBookService";
import adminUserService from "../services/adminUserService";
import adminLoanService from "../services/adminLoanService";
import adminPaymentService from "../services/adminPaymentService";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalMembers: 0,
    totalLoans: 0,
    totalPayments: 0,
    pendingReturns: 0,
    recentLoans: [],
    recentReturns: [],
    topBooks: [],
    monthlyStats: {
      loans: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      returns: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        // Fetch all statistics in parallel
        const [booksResponse, usersResponse, loansResponse, paymentsResponse] =
          await Promise.all([
            adminBookService.getBookStats(),
            adminUserService.getUserStats(),
            adminLoanService.getLoanStats(),
            adminPaymentService.getPaymentStats(),
          ]);

        setStats({
          totalBooks: booksResponse.data.totalBooks || 0,
          totalUsers: usersResponse.data.totalUsers || 0,
          totalMembers: usersResponse.data.totalMembers || 0,
          totalLoans: loansResponse.data.totalLoans || 0,
          totalPayments: paymentsResponse.data.totalPayments || 0,
          pendingReturns: loansResponse.data.pendingReturns || 0,
          recentLoans: loansResponse.data.recentLoans || [],
          recentReturns: loansResponse.data.recentReturns || [],
          topBooks: booksResponse.data.topBooks || [],
          monthlyStats: {
            loans: loansResponse.data.monthlyLoans || Array(12).fill(0),
            returns: loansResponse.data.monthlyReturns || Array(12).fill(0),
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Thống kê chính */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tổng số sách */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Tổng số sách</p>
              <p className="text-2xl font-bold">{stats.totalBooks}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaBook className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/books"
              className="text-blue-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Tổng số thành viên */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Tổng số thành viên</p>
              <p className="text-2xl font-bold">{stats.totalMembers}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaUserTag className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/members"
              className="text-green-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Tổng lượt mượn */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Tổng lượt mượn</p>
              <p className="text-2xl font-bold">{stats.totalLoans}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaExchangeAlt className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/loans"
              className="text-purple-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>

        {/* Tổng số thanh toán */}
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Tổng số thanh toán</p>
              <p className="text-2xl font-bold">
                {stats.totalPayments.toLocaleString("vi-VN")} đ
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FaMoneyBill className="text-orange-500 text-xl" />
            </div>
          </div>
          <div className="mt-4">
            <Link
              to="/admin/payments"
              className="text-orange-500 text-sm hover:underline"
            >
              Xem chi tiết
            </Link>
          </div>
        </div>
      </div>

      {/* Các thống kê phụ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Danh sách mượn gần đây */}
        <div className="bg-white rounded-lg shadow-md col-span-1 lg:col-span-2">
          <div className="border-b px-6 py-3">
            <h2 className="font-bold text-lg">Lượt mượn gần đây</h2>
          </div>
          <div className="p-6">
            {stats.recentLoans.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thành viên
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sách
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày mượn
                      </th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hạn trả
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {stats.recentLoans.map((loan) => (
                      <tr key={loan.loan_id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {loan.member?.first_name} {loan.member?.last_name}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                          {loan.book?.title}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(loan.loan_date)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium 
                            ${
                              new Date(loan.due_date) < new Date()
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {formatDate(loan.due_date)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                Không có lượt mượn nào gần đây
              </p>
            )}
            <div className="mt-4 text-right">
              <Link
                to="/admin/loans"
                className="text-blue-500 hover:underline text-sm"
              >
                Xem tất cả lượt mượn
              </Link>
            </div>
          </div>
        </div>

        {/* Top sách được mượn nhiều nhất */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b px-6 py-3">
            <h2 className="font-bold text-lg">Sách mượn nhiều nhất</h2>
          </div>
          <div className="p-6">
            {stats.topBooks.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.topBooks.map((book, index) => (
                  <li key={book.book_id} className="py-3 flex items-center">
                    <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {book.title}
                      </p>
                      <p className="text-xs text-gray-500">{book.author}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {book.loan_count} lượt mượn
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-4">Không có dữ liệu</p>
            )}
            <div className="mt-4 text-right">
              <Link
                to="/admin/books"
                className="text-blue-500 hover:underline text-sm"
              >
                Xem tất cả sách
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê tháng */}
      <div className="bg-white rounded-lg shadow-md mb-8">
        <div className="border-b px-6 py-3">
          <h2 className="font-bold text-lg">Thống kê theo tháng</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Tổng mượn hôm nay</h3>
                <FaCalendarAlt className="text-blue-500" />
              </div>
              <p className="text-2xl font-bold">
                {
                  stats.recentLoans.filter(
                    (loan) =>
                      new Date(loan.loan_date).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Chờ trả</h3>
                <FaExchangeAlt className="text-orange-500" />
              </div>
              <p className="text-2xl font-bold">{stats.pendingReturns}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">Quá hạn</h3>
                <FaExchangeAlt className="text-red-500" />
              </div>
              <p className="text-2xl font-bold">
                {
                  stats.recentLoans.filter(
                    (loan) =>
                      new Date(loan.due_date) < new Date() && !loan.return_date
                  ).length
                }
              </p>
            </div>
          </div>

          {/* Biểu đồ thống kê - trong thực tế bạn có thể sử dụng thư viện như Chart.js hoặc Recharts */}
          <div className="mt-6 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              Biểu đồ thống kê mượn/trả sách theo tháng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
