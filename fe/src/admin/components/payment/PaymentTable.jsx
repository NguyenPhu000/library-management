import React, { useState } from "react";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaQrcode,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEdit,
  FaTrash,
  FaDownload,
} from "react-icons/fa";

const PaymentTable = ({
  payments,
  loading,
  onView,
  onConfirm,
  onCancel,
  onEdit,
  onDelete,
  pagination,
  onPageChange,
  onSort,
  sortConfig,
}) => {
  const [selectedPayments, setSelectedPayments] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Chờ xác nhận",
      },
      completed: {
        color: "bg-green-100 text-green-800",
        label: "Đã hoàn thành",
      },
      APPROVED: { color: "bg-green-100 text-green-800", label: "Đã duyệt" },
      cancelled: { color: "bg-red-100 text-red-800", label: "Đã hủy" },
      failed: { color: "bg-red-100 text-red-800", label: "Thất bại" },
    };

    const config = statusConfig[status] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return <FaMoneyBillWave className="text-purple-600" />;
      case "qrcode":
        return <FaQrcode className="text-pink-600" />;
      default:
        return <FaMoneyBillWave className="text-gray-600" />;
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPayments(payments.map((p) => p.payment_id));
    } else {
      setSelectedPayments([]);
    }
  };

  const handleSelectPayment = (paymentId) => {
    setSelectedPayments((prev) =>
      prev.includes(paymentId)
        ? prev.filter((id) => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) {
      return <FaSort className="text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-blue-600" />
    ) : (
      <FaSortDown className="text-blue-600" />
    );
  };

  const handleSort = (column) => {
    onSort(column);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Danh sách thanh toán ({payments.length})
            </h3>
            {selectedPayments.length > 0 && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {selectedPayments.length} đã chọn
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {selectedPayments.length > 0 && (
              <>
                <button
                  onClick={() =>
                    selectedPayments.forEach((id) => onConfirm(id))
                  }
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  Xác nhận tất cả
                </button>
                <button
                  onClick={() => selectedPayments.forEach((id) => onCancel(id))}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  Hủy tất cả
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedPayments.length === payments.length &&
                    payments.length > 0
                  }
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("payment_id")}
              >
                <div className="flex items-center">
                  Mã thanh toán
                  {getSortIcon("payment_id")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("member_id")}
              >
                <div className="flex items-center">
                  Thành viên
                  {getSortIcon("member_id")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Số tiền
                  {getSortIcon("amount")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phương thức
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Trạng thái
                  {getSortIcon("status")}
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort("payment_date")}
              >
                <div className="flex items-center">
                  Ngày thanh toán
                  {getSortIcon("payment_date")}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.payment_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedPayments.includes(payment.payment_id)}
                    onChange={() => handleSelectPayment(payment.payment_id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    #{payment.payment_id}
                  </div>
                  {payment.Loan && (
                    <div className="text-xs text-gray-500">
                      Loan #{payment.Loan.loan_id}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {payment.Member?.member_code || "N/A"}
                  </div>
                  {payment.User && (
                    <div className="text-xs text-gray-500">
                      {payment.User.username}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(payment.amount)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getPaymentMethodIcon(payment.payment_method)}
                    <span className="ml-2 text-sm text-gray-900 capitalize">
                      {payment.payment_method === "cash"
                        ? "Tiền mặt"
                        : "QR Code"}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(payment.payment_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(payment)}
                      className="text-blue-600 hover:text-blue-900 transition-colors"
                      title="Xem chi tiết"
                    >
                      <FaEye />
                    </button>

                    {payment.status === "pending" && (
                      <>
                        <button
                          onClick={() => onConfirm(payment.payment_id)}
                          className="text-green-600 hover:text-green-900 transition-colors"
                          title="Xác nhận thanh toán"
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => onCancel(payment.payment_id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Hủy thanh toán"
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => onEdit(payment)}
                      className="text-yellow-600 hover:text-yellow-900 transition-colors"
                      title="Chỉnh sửa"
                    >
                      <FaEdit />
                    </button>

                    <button
                      onClick={() => onDelete(payment.payment_id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                      title="Xóa"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {payments.length === 0 && (
        <div className="px-6 py-12 text-center">
          <FaMoneyBillWave className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không có thanh toán nào
          </h3>
          <p className="text-gray-500">
            Chưa có dữ liệu thanh toán để hiển thị.
          </p>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Hiển thị {pagination.offset + 1} -{" "}
              {Math.min(
                pagination.offset + pagination.limit,
                pagination.totalCount
              )}
              trong tổng số {pagination.totalCount} thanh toán
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Trước
              </button>

              {[...Array(pagination.totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === pagination.totalPages ||
                  (page >= pagination.currentPage - 2 &&
                    page <= pagination.currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`px-3 py-1 border rounded-lg text-sm ${
                        page === pagination.currentPage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === pagination.currentPage - 3 ||
                  page === pagination.currentPage + 3
                ) {
                  return (
                    <span key={page} className="px-2 py-1 text-gray-500">
                      ...
                    </span>
                  );
                }
                return null;
              })}

              <button
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTable;
