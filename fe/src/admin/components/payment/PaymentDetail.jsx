import React, { useState } from "react";
import {
  FaTimes,
  FaMoneyBillWave,
  FaQrcode,
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaDownload,
  FaCopy,
  FaCheck,
  FaExternalLinkAlt,
  FaHistory,
} from "react-icons/fa";

const PaymentDetail = ({ isOpen, onClose, payment, onRefresh }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

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
      second: "2-digit",
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
        className={`px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const downloadQR = () => {
    if (payment.qr_code_url) {
      const link = document.createElement("a");
      link.href = payment.qr_code_url;
      link.download = `QR-Payment-${payment.payment_id}.png`;
      link.click();
    }
  };

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Chi tiết thanh toán #{payment.payment_id}
              </h2>
              <p className="text-blue-100 mt-1">
                Tạo lúc {formatDate(payment.payment_date)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors p-2"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("details")}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "details"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Chi tiết thanh toán
            </button>
            {payment.payment_method === "qrcode" && (
              <button
                onClick={() => setActiveTab("qr")}
                className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "qr"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                QR Code
              </button>
            )}
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "history"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              Lịch sử
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-6 py-6">
          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Status and Amount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Trạng thái thanh toán
                    </h3>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="text-3xl font-bold text-blue-600">
                    {formatCurrency(payment.amount)}
                  </div>
                  <p className="text-gray-600 mt-2">Số tiền thanh toán</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    {payment.payment_method === "cash" ? (
                      <FaMoneyBillWave
                        className="text-purple-600 mr-3"
                        size={24}
                      />
                    ) : (
                      <FaQrcode className="text-pink-600 mr-3" size={24} />
                    )}
                    <h3 className="text-lg font-semibold text-gray-900">
                      Phương thức thanh toán
                    </h3>
                  </div>
                  <div className="text-xl font-medium text-gray-900">
                    {payment.payment_method === "cash" ? "Tiền mặt" : "QR Code"}
                  </div>
                  <p className="text-gray-600 mt-2">
                    {payment.payment_method === "cash"
                      ? "Thanh toán trực tiếp tại quầy"
                      : "Thanh toán qua mã QR"}
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Member Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaUser className="mr-2 text-blue-600" />
                    Thông tin thành viên
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã thành viên:</span>
                      <span className="font-medium text-gray-900">
                        {payment.Member?.member_code || "N/A"}
                      </span>
                    </div>
                    {payment.User && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tên người dùng:</span>
                        <span className="font-medium text-gray-900">
                          {payment.User.username}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID thành viên:</span>
                      <span className="font-medium text-gray-900">
                        #{payment.member_id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Loan Info */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <FaFileAlt className="mr-2 text-green-600" />
                    Thông tin khoản vay
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mã khoản vay:</span>
                      <span className="font-medium text-gray-900">
                        #{payment.loan_id}
                      </span>
                    </div>
                    {payment.Loan && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phí phạt:</span>
                        <span className="font-medium text-red-600">
                          {formatCurrency(payment.Loan.fine_amount || 0)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">Loại phí:</span>
                      <span className="font-medium text-gray-900">
                        Phí phạt trả sách trễ
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description and Notes */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Mô tả và ghi chú
                </h3>
                <div className="space-y-4">
                  {payment.description && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Mô tả:</h4>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {payment.description}
                      </p>
                    </div>
                  )}
                  {payment.notes && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Ghi chú:
                      </h4>
                      <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                        {payment.notes}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Details */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin kỹ thuật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-mono text-gray-900">
                      {payment.payment_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày tạo:</span>
                    <span className="font-mono text-gray-900">
                      {formatDate(payment.payment_date)}
                    </span>
                  </div>
                  {payment.updated_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cập nhật cuối:</span>
                      <span className="font-mono text-gray-900">
                        {formatDate(payment.updated_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* QR Code Tab */}
          {activeTab === "qr" && payment.payment_method === "qrcode" && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Mã QR thanh toán
                </h3>
                <p className="text-gray-600">
                  Quét mã QR để thực hiện thanh toán
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                {/* QR Code Display */}
                <div className="flex-1 flex justify-center">
                  <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-gray-200">
                    {payment.qr_code_url ? (
                      <div className="text-center">
                        <img
                          src={payment.qr_code_url}
                          alt="QR Code"
                          className="w-64 h-64 mx-auto mb-4"
                        />
                        <div className="flex justify-center space-x-2">
                          <button
                            onClick={downloadQR}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <FaDownload className="mr-2" />
                            Tải xuống
                          </button>
                          <button
                            onClick={() =>
                              window.open(payment.qr_code_url, "_blank")
                            }
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
                          >
                            <FaExternalLinkAlt className="mr-2" />
                            Mở rộng
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg">
                        <div className="text-center">
                          <FaQrcode
                            className="mx-auto text-gray-400 mb-2"
                            size={48}
                          />
                          <p className="text-gray-500">Mã QR không khả dụng</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* QR Details */}
                <div className="flex-1 space-y-4">
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="font-semibold text-gray-900 mb-4">
                      Thông tin chuyển khoản
                    </h4>
                    <div className="space-y-3">
                      {payment.bank_account_no && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Số tài khoản:
                          </label>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="font-mono text-gray-900">
                              {payment.bank_account_no}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(payment.bank_account_no)
                              }
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm text-gray-600 mb-1">
                          Số tiền:
                        </label>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="font-bold text-green-600">
                            {formatCurrency(payment.amount)}
                          </span>
                          <button
                            onClick={() =>
                              copyToClipboard(payment.amount.toString())
                            }
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            {copied ? <FaCheck /> : <FaCopy />}
                          </button>
                        </div>
                      </div>

                      {payment.payment_content && (
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Nội dung chuyển khoản:
                          </label>
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                            <span className="font-mono text-gray-900">
                              {payment.payment_content}
                            </span>
                            <button
                              onClick={() =>
                                copyToClipboard(payment.payment_content)
                              }
                              className="text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              {copied ? <FaCheck /> : <FaCopy />}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {payment.qr_data && (
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        Dữ liệu QR
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                          {JSON.stringify(JSON.parse(payment.qr_data), null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <FaHistory className="mr-2" />
                  Lịch sử thanh toán
                </h3>
                <button
                  onClick={onRefresh}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Làm mới
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <div className="w-3 h-3 bg-blue-600 rounded-full mr-4"></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        Thanh toán được tạo
                      </h4>
                      <p className="text-sm text-gray-600">
                        Thanh toán #{payment.payment_id} được tạo với số tiền{" "}
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(payment.payment_date)}
                      </p>
                    </div>
                  </div>

                  {payment.status === "completed" && (
                    <div className="flex items-center p-4 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-600 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          Thanh toán hoàn thành
                        </h4>
                        <p className="text-sm text-gray-600">
                          Thanh toán đã được xác nhận và xử lý thành công
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {payment.updated_at
                            ? formatDate(payment.updated_at)
                            : "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  )}

                  {payment.status === "cancelled" && (
                    <div className="flex items-center p-4 bg-red-50 rounded-lg">
                      <div className="w-3 h-3 bg-red-600 rounded-full mr-4"></div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">
                          Thanh toán bị hủy
                        </h4>
                        <p className="text-sm text-gray-600">
                          Thanh toán đã bị hủy bỏ
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {payment.updated_at
                            ? formatDate(payment.updated_at)
                            : "Chưa cập nhật"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Thanh toán #{payment.payment_id} •{" "}
              {formatDate(payment.payment_date)}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
