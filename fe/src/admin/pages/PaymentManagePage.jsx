import React, { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2"; // Thêm SweetAlert2
import { toast } from "react-toastify";
import {
  FaMoneyBillWave,
  FaPlus,
  FaFileExport,
  FaSyncAlt,
  FaChartBar,
  FaFilter,
  FaSearch,
} from "react-icons/fa";

import PaymentStats from "../components/payment/PaymentStats";
import PaymentFilter from "../components/payment/PaymentFilter";
import PaymentTable from "../components/payment/PaymentTable";
import PaymentDetail from "../components/payment/PaymentDetail";
import ConfirmPaymentModal from "../components/payment/ConfirmPaymentModal";
import adminPaymentService from "../services/adminPaymentService";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentManagePage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    offset: 0,
  });
  const [sortConfig, setSortConfig] = useState({
    key: "payment_date",
    direction: "desc",
  });

  // Modal states
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(true);

  // Fetch payments with filters, pagination, and sorting
  const fetchPayments = useCallback(
    async (page = 1, newFilters = filters) => {
      try {
        setLoading(true);
        const params = {
          page,
          limit: pagination.limit,
          sort: sortConfig.key,
          order: sortConfig.direction,
          ...newFilters,
        };

        const response = await adminPaymentService.getAllPayments(
          params.page,
          params.limit,
          params.status
        );

        if (response.success) {
          setPayments(response.payments || []);
          setPagination({
            currentPage: response.currentPage || page,
            totalPages: response.totalPages || 1,
            totalCount: response.totalCount || 0,
            limit: response.limit || pagination.limit,
            offset: response.offset || 0,
          });
        } else {
          toast.error("Không thể tải danh sách thanh toán");
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast.error("Lỗi khi tải danh sách thanh toán");
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.limit, sortConfig]
  );

  // Initial load
  useEffect(() => {
    fetchPayments();
  }, []);

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    fetchPayments(1, newFilters);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchPayments(page);
  };

  // Handle sorting
  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    // Refetch with new sort
    setTimeout(() => fetchPayments(pagination.currentPage), 0);
  };

  // Handle payment actions
  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowDetailModal(true);
  };

  const handleConfirmPayment = async (paymentId, data) => {
    try {
      const response = await adminPaymentService.confirmPayment(
        paymentId,
        data
      );
      if (response.success) {
        toast.success("Xác nhận thanh toán thành công!");
        fetchPayments(pagination.currentPage);
        setShowConfirmModal(false);
      } else {
        toast.error(response.message || "Không thể xác nhận thanh toán");
      }
    } catch (error) {
      console.error("Error confirming payment:", error);
      toast.error("Lỗi khi xác nhận thanh toán");
    }
  };

  const handleCancelPayment = async (paymentId, data) => {
    try {
      const response = await adminPaymentService.cancelPayment(
        paymentId,
        data.reason
      );
      if (response.success) {
        toast.success("Hủy thanh toán thành công!");
        fetchPayments(pagination.currentPage);
        setShowConfirmModal(false);
      } else {
        toast.error(response.message || "Không thể hủy thanh toán");
      }
    } catch (error) {
      console.error("Error canceling payment:", error);
      toast.error("Lỗi khi hủy thanh toán");
    }
  };

  const handleEditPayment = (payment) => {
    setSelectedPayment(payment);
    setShowConfirmModal(true);
  };

  const handleDeletePayment = async (paymentId) => {
    const { isConfirmed } = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này sẽ xóa vĩnh viễn thanh toán này!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Có, xóa!",
      cancelButtonText: "Không",
    });

    if (isConfirmed) {
      try {
        const response = await adminPaymentService.deletePayment(paymentId);
        if (response.success) {
          await Swal.fire(
            "Đã xóa!",
            "Thanh toán đã được xóa thành công.",
            "success"
          );
          fetchPayments(pagination.currentPage);
        } else {
          Swal.fire(
            "Lỗi!",
            response.message || "Không thể xóa thanh toán",
            "error"
          );
        }
      } catch (error) {
        console.error("Error deleting payment:", error);
        Swal.fire("Lỗi!", "Lỗi khi xóa thanh toán", "error");
      }
    }
  };

  const handleExportData = async () => {
    try {
      toast.info("Đang xuất dữ liệu...");
      // Implement export functionality
      const response = await adminPaymentService.generateIncomeReport(
        new Date().getFullYear(),
        new Date().getMonth() + 1
      );

      if (response.success) {
        // Create and download file
        const blob = new Blob([JSON.stringify(response.data, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `payment-report-${
          new Date().toISOString().split("T")[0]
        }.json`;
        link.click();
        window.URL.revokeObjectURL(url);

        toast.success("Xuất dữ liệu thành công!");
      } else {
        toast.error("Không thể xuất dữ liệu");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Lỗi khi xuất dữ liệu");
    }
  };

  const handleRefresh = () => {
    fetchPayments(pagination.currentPage);
    toast.info("Đã làm mới dữ liệu");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-gray-200">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 dark:text-gray-200 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FaMoneyBillWave className="text-blue-600 mr-3" size={24} />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Quản lý thanh toán
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Quản lý thu chi và thanh toán của hệ thống
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowStatsPanel(!showStatsPanel)}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                  showStatsPanel
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <FaChartBar className="mr-2" />
                Thống kê
              </button>
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 transition-colors flex items-center"
              >
                <FaFileExport className="mr-2" />
                Xuất báo cáo
              </button>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-800 transition-colors flex items-center"
              >
                <FaSyncAlt className="mr-2" />
                Làm mới
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Statistics Panel */}
          {showStatsPanel && (
            <div className="transition-all duration-300 ease-in-out">
              <PaymentStats />
            </div>
          )}

          {/* Filters */}
          <PaymentFilter
            onFilterChange={handleFilterChange}
            onExport={handleExportData}
            loading={loading}
          />

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 dark:text-gray-200 rounded-lg shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Thao tác nhanh
              </h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Tổng: {pagination.totalCount} thanh toán
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={() => handleFilterChange({ status: "pending" })}
                className="p-4 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900 dark:hover:bg-yellow-800 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                      Chờ xác nhận
                    </p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">
                      {payments.filter((p) => p.status === "pending").length}
                    </p>
                  </div>
                  <FaFilter className="text-yellow-600" />
                </div>
              </button>

              <button
                onClick={() => handleFilterChange({ status: "completed" })}
                className="p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900 dark:hover:bg-green-800 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-200">
                      Đã hoàn thành
                    </p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-300">
                      {
                        payments.filter(
                          (p) =>
                            p.status === "completed" || p.status === "APPROVED"
                        ).length
                      }
                    </p>
                  </div>
                  <FaFilter className="text-green-600" />
                </div>
              </button>

              <button
                onClick={() => handleFilterChange({ paymentMethod: "cash" })}
                className="p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900 dark:hover:bg-purple-800 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200">
                      Tiền mặt
                    </p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
                      {
                        payments.filter((p) => p.payment_method === "cash")
                          .length
                      }
                    </p>
                  </div>
                  <FaMoneyBillWave className="text-purple-600" />
                </div>
              </button>

              <button
                onClick={() => handleFilterChange({ paymentMethod: "qrcode" })}
                className="p-4 bg-pink-50 hover:bg-pink-100 dark:bg-pink-900 dark:hover:bg-pink-800 rounded-lg transition-colors text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-pink-800 dark:text-pink-200">
                      QR Code
                    </p>
                    <p className="text-2xl font-bold text-pink-600 dark:text-pink-300">
                      {
                        payments.filter((p) => p.payment_method === "qrcode")
                          .length
                      }
                    </p>
                  </div>
                  <FaSearch className="text-pink-600" />
                </div>
              </button>
            </div>
          </div>

          {/* Payment Table */}
          <PaymentTable
            payments={payments}
            loading={loading}
            onView={handleViewPayment}
            onConfirm={(id) => {
              const payment = payments.find((p) => p.payment_id === id);
              setSelectedPayment(payment);
              setShowConfirmModal(true);
            }}
            onCancel={(id) => {
              const payment = payments.find((p) => p.payment_id === id);
              setSelectedPayment(payment);
              setShowConfirmModal(true);
            }}
            onEdit={handleEditPayment}
            onDelete={handleDeletePayment}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSort={handleSort}
            sortConfig={sortConfig}
          />
        </div>
      </div>

      {/* Modals */}
      <PaymentDetail
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onRefresh={() => fetchPayments(pagination.currentPage)}
      />

      <ConfirmPaymentModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
        onConfirm={handleConfirmPayment}
        onCancel={handleCancelPayment}
        loading={loading}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default PaymentManagePage;
