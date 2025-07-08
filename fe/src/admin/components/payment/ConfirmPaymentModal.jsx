import React, { useState } from "react";
import {
  FaCheck,
  FaTimes,
  FaMoneyBillWave,
  FaQrcode,
  FaExclamationTriangle,
  FaUser,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";

const ConfirmPaymentModal = ({
  isOpen,
  onClose,
  payment,
  onConfirm,
  onCancel,
  loading,
}) => {
  const [action, setAction] = useState(""); // 'confirm' or 'cancel'
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [confirmAmount, setConfirmAmount] = useState("");

  React.useEffect(() => {
    if (payment) {
      setConfirmAmount(payment.amount.toString());
      setNotes(payment.notes || "");
    }
  }, [payment]);

  const handleClose = () => {
    setAction("");
    setReason("");
    setNotes("");
    setConfirmAmount("");
    onClose();
  };

  const handleConfirm = async () => {
    if (!confirmAmount || parseFloat(confirmAmount) <= 0) {
      alert("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    try {
      await onConfirm(payment.payment_id, {
        amount: parseFloat(confirmAmount),
        notes: notes.trim(),
      });
      handleClose();
    } catch (error) {
      console.error("Error confirming payment:", error);
    }
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      alert("Vui lòng nhập lý do hủy thanh toán");
      return;
    }

    try {
      await onCancel(payment.payment_id, {
        reason: reason.trim(),
        notes: notes.trim(),
      });
      handleClose();
    } catch (error) {
      console.error("Error canceling payment:", error);
    }
  };

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

  if (!isOpen || !payment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Chi tiết thanh toán #{payment.payment_id}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Payment Details */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Thông tin thanh toán
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Mã thanh toán:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      #{payment.payment_id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Số tiền:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Phương thức:</span>
                    <div className="flex items-center">
                      {payment.payment_method === "cash" ? (
                        <>
                          <FaMoneyBillWave className="text-purple-600 mr-1" />{" "}
                          Tiền mặt
                        </>
                      ) : (
                        <>
                          <FaQrcode className="text-pink-600 mr-1" /> QR Code
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Trạng thái:</span>
                    {getStatusBadge(payment.status)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Ngày tạo:</span>
                    <span className="text-sm text-gray-900">
                      {formatDate(payment.payment_date)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Member Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                  <FaUser className="mr-2" />
                  Thông tin thành viên
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Mã thành viên:
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {payment.Member?.member_code || "N/A"}
                    </span>
                  </div>
                  {payment.User && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Người dùng:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {payment.User.username}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Loan Info */}
              {payment.Loan && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Thông tin khoản vay
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Mã khoản vay:
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        #{payment.Loan.loan_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Phí phạt:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(payment.Loan.fine_amount || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* QR Code Info */}
              {payment.payment_method === "qrcode" && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Thông tin QR Code
                  </h3>
                  <div className="space-y-2">
                    {payment.bank_account_no && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">
                          Số tài khoản:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {payment.bank_account_no}
                        </span>
                      </div>
                    )}
                    {payment.payment_content && (
                      <div>
                        <span className="text-sm text-gray-600">Nội dung:</span>
                        <p className="text-sm text-gray-900 mt-1">
                          {payment.payment_content}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {payment.description && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Mô tả
                  </h3>
                  <p className="text-sm text-gray-900">{payment.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Selection */}
        {payment.status === "pending" && !action && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => setAction("confirm")}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <FaCheck className="mr-2" />
                Xác nhận thanh toán
              </button>
              <button
                onClick={() => setAction("cancel")}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
              >
                <FaTimes className="mr-2" />
                Hủy thanh toán
              </button>
            </div>
          </div>
        )}

        {/* Confirm Form */}
        {action === "confirm" && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <FaCheck className="text-green-600 mr-2" />
                <h3 className="text-lg font-medium text-green-900">
                  Xác nhận thanh toán
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền xác nhận
                  </label>
                  <input
                    type="number"
                    value={confirmAmount}
                    onChange={(e) => setConfirmAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Nhập số tiền"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú (tùy chọn)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Thêm ghi chú về việc xác nhận..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setAction("")}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Form */}
        {action === "cancel" && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="bg-red-50 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <FaExclamationTriangle className="text-red-600 mr-2" />
                <h3 className="text-lg font-medium text-red-900">
                  Hủy thanh toán
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lý do hủy <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Nhập lý do hủy thanh toán..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ghi chú thêm (tùy chọn)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    placeholder="Thêm ghi chú..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setAction("")}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {loading ? "Đang xử lý..." : "Xác nhận hủy"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Read-only mode for completed payments */}
        {payment.status !== "pending" && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="text-center text-gray-500">
              <p>Thanh toán này đã được xử lý và không thể chỉnh sửa.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmPaymentModal;
