import React, { useState, useMemo } from "react";
import { usePayment } from "../contexts/PaymentContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const PaymentPage = () => {
  const { payments, loading, error } = usePayment();

  if (loading) {
    return (
      <div className="font-poppins p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center min-h-[40vh] transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
            Đang tải danh sách thanh toán...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-poppins p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center min-h-[40vh] transition-colors duration-300">
        <div className="text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 dark:text-red-400 font-medium transition-colors duration-300">
            {error}
          </p>
        </div>
      </div>
    );
  }

  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = useMemo(() => {
    if (!payments) return [];
    return payments.filter((p) => {
      const keyword = searchTerm.toLowerCase();
      return (
        p.User.username.toLowerCase().includes(keyword) ||
        (p.Member?.member_code || "").toLowerCase().includes(keyword) ||
        (p.payment_method || "").toLowerCase().includes(keyword)
      );
    });
  }, [payments, searchTerm]);

  const getStatusInfo = (status) => {
    switch (status) {
      case "PENDING":
        return {
          label: "Đang chờ xác nhận",
          color: "bg-yellow-500/20 text-yellow-400 border-yellow-400/30",
          icon: faClock,
        };
      case "APPROVED":
        return {
          label: "Đã xác nhận",
          color: "bg-emerald-500/20 text-emerald-400 border-emerald-400/30",
          icon: faCheckCircle,
        };
      case "REJECTED":
        return {
          label: "Từ chối",
          color: "bg-red-500/20 text-red-400 border-red-400/30",
          icon: faTimesCircle,
        };
      default:
        return {
          label: status,
          color: "bg-gray-700/50 text-gray-300 border-gray-600",
          icon: faTimesCircle,
        };
    }
  };

  const getMethodLabel = (method) => {
    if (!method) return "-";
    const m = method.toLowerCase();
    if (m === "cash") return "Tiền mặt";
    if (m === "qr" || m === "qr_code" || m === "qrcode") return "QR Code";
    return method;
  };

  return (
    <div className="font-poppins bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen p-4 md:p-6 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 mb-8 border border-gray-200 dark:border-gray-700 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors duration-300">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center text-gray-900 dark:text-white transition-colors duration-300">
          <FontAwesomeIcon
            icon={faCreditCard}
            className="mr-3 text-emerald-500"
          />
          Danh sách Thanh Toán
        </h1>
        {/* Search */}
        <div className="relative w-full md:w-72">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 transition-colors duration-300"
          />
          <input
            type="text"
            placeholder="Tìm kiếm thành viên, phương thức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg pl-12 pr-4 py-3 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-colors duration-300">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Mã thành viên
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Người dùng
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Tiền phạt
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Ngày thanh toán
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase hidden md:table-cell">
                Phương thức
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Số tiền
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700 transition-colors duration-300">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => {
                const statusInfo = getStatusInfo(payment.status);
                return (
                  <tr
                    key={payment.payment_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {payment.Member.member_code}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {payment.User.username}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {payment.Loan.fine_amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {new Date(payment.payment_date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {getMethodLabel(payment.payment_method)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100 transition-colors duration-300">
                      {payment.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusInfo.color} text-xs font-medium backdrop-blur-sm`}
                      >
                        <FontAwesomeIcon
                          icon={statusInfo.icon}
                          className="text-sm"
                        />
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300"
                >
                  Không có thanh toán nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;
