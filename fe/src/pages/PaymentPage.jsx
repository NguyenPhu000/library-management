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
      <div className="font-poppins p-4 bg-gray-900 text-white flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-lightGreen border-t-transparent mb-2"></div>
          <span className="text-sm">Đang tải danh sách thanh toán...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white flex items-center justify-center min-h-[40vh]">
        <div className="text-red-500 bg-red-100 p-3 rounded-md">
          <p className="font-bold">Lỗi:</p>
          <p>{error}</p>
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
    <div className="font-poppins bg-gray-900 text-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 mb-8 border border-gray-700 shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center text-white">
          <FontAwesomeIcon
            icon={faCreditCard}
            className="mr-3 text-emerald-400"
          />
          Danh sách Thanh Toán
        </h1>
        {/* Search */}
        <div className="relative w-full md:w-72">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
          />
          <input
            type="text"
            placeholder="Tìm kiếm thành viên, phương thức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-12 pr-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 bg-gray-800 rounded-xl overflow-hidden shadow-lg">
          <thead className="bg-gray-700 text-gray-300">
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
          <tbody className="divide-y divide-gray-700">
            {filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => {
                const statusInfo = getStatusInfo(payment.status);
                return (
                  <tr
                    key={payment.payment_id}
                    className="hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <td className="px-4 py-3 text-sm">
                      {payment.Member.member_code}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {payment.User.username}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {payment.Loan.fine_amount?.toLocaleString() || 0}
                    </td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {new Date(payment.payment_date).toLocaleDateString(
                        "vi-VN"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm hidden md:table-cell">
                      {getMethodLabel(payment.payment_method)}
                    </td>
                    <td className="px-4 py-3 text-sm">
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
                  className="px-4 py-6 text-center text-sm text-gray-400"
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
