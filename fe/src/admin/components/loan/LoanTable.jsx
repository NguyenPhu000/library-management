import React from "react";
import {
  FaUndo,
  FaCheck,
  FaTimes,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaBan,
  FaExclamationTriangle,
} from "react-icons/fa";
import HybridTable from "../common/HybridTable";
import { useLoanAdmin } from "../../contexts/LoanAdminContext";

const LoanTable = () => {
  const {
    loans,
    loading,
    returnBook,
    approveRenewal,
    rejectRenewal,
    approveRequest,
    confirmPickup,
    confirmReturn,
    confirmPickupWithCode,
  } = useLoanAdmin();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const formatCurrency = (amount) => {
    if (!amount) return "0";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const isOverdue = (loan) => {
    if (!loan || loan.status === "returned" || loan.returned) return false;
    if (loan.status !== "borrowed" || !loan.due_date) return false;
    return new Date(loan.due_date) < new Date();
  };

  const getRenewalStatusBadge = (status) => {
    const badges = {
      pending: (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
          <FaClock className="mr-1" />
          Chờ duyệt
        </span>
      ),
      approved: (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
          <FaCheckCircle className="mr-1" />
          Đã duyệt
        </span>
      ),
      rejected: (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
          <FaTimesCircle className="mr-1" />
          Từ chối
        </span>
      ),
      none: (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 rounded-full">
          <FaBan className="mr-1" />
          Không yêu cầu
        </span>
      ),
    };
    return badges[status] || badges.none;
  };

  const getStatusBadge = (loan) => {
    // PICKUP CODE WORKFLOW: Xử lý theo trạng thái mới
    switch (loan.status) {
      case "requested":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
            <FaClock className="mr-1" />
            Chờ duyệt
          </span>
        );
      case "pending_pickup":
        // Kiểm tra mã có hết hạn không
        const isExpired =
          loan.hold_until && new Date(loan.hold_until) < new Date();
        return (
          <span
            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
              isExpired
                ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
            }`}
          >
            <FaClock className="mr-1" />
            {isExpired ? "🎫 Mã hết hạn" : "🎫 Chờ nhận sách"}
          </span>
        );
      case "":
        // Backend trả về status rỗng nhưng có pickup_code = pending_pickup
        if (loan.pickup_code) {
          const isExpiredEmpty =
            loan.hold_until && new Date(loan.hold_until) < new Date();
          return (
            <span
              className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                isExpiredEmpty
                  ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
              }`}
            >
              <FaClock className="mr-1" />
              {isExpiredEmpty ? "🎫 Mã hết hạn" : "🎫 Chờ nhận sách"}
            </span>
          );
        }
        break;
      case "approved":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
            <FaCheckCircle className="mr-1" />
            Đã duyệt - Chờ nhận
          </span>
        );
      case "borrowed":
        const isOverdue =
          loan.status === "borrowed" &&
          loan.due_date &&
          new Date(loan.due_date) < new Date();
        if (isOverdue) {
          return (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
              <FaExclamationTriangle className="mr-1" />
              Quá hạn
            </span>
          );
        }
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
            <FaClock className="mr-1" />
            Đang mượn
          </span>
        );
      case "returned":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
            <FaCheck className="mr-1" />
            Đã trả
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 rounded-full">
            <FaTimes className="mr-1" />
            Bị từ chối
          </span>
        );
      default:
        // Legacy compatibility
        if (loan.returned) {
          return (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full">
              <FaCheck className="mr-1" />
              Đã trả
            </span>
          );
        } else {
          return (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full">
              <FaClock className="mr-1" />
              Đang mượn
            </span>
          );
        }
    }
  };

  const columns = [
    {
      header: "STT",
      accessor: "serial",
      render: (_loan, index) => (
        <div className="font-medium text-gray-900 dark:text-white">
          #{index + 1}
        </div>
      ),
      className: "w-20",
    },
    {
      header: "Thành viên",
      accessor: "member_code",
      render: (loan) => (
        <div className="space-y-1">
          <div className="font-medium text-blue-600 dark:text-blue-400">
            {loan.Member?.member_code || "N/A"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {(() => {
              const user = loan.Member?.User;
              if (!user) return "N/A";

              // Try to construct full name from first_name and last_name
              const fullName = `${user.first_name || ""} ${
                user.last_name || ""
              }`.trim();
              if (fullName) return fullName;

              // Fallback to username
              if (user.username) return user.username;

              return "N/A";
            })()}
          </div>
          {loan.Member?.User?.email && (
            <div className="text-xs text-gray-400 dark:text-gray-500 truncate max-w-32">
              {loan.Member?.User?.email}
            </div>
          )}
        </div>
      ),
      className: "w-40",
    },
    {
      header: "Sách",
      accessor: "book_title",
      render: (loan) => (
        <div className="space-y-1">
          <div className="font-medium text-gray-900 dark:text-white line-clamp-2">
            {loan.Book?.title || "N/A"}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
            {loan.Book?.author || "N/A"}
          </div>
          {loan.Book?.isbn && (
            <div className="text-xs text-gray-400 dark:text-gray-500 font-mono">
              ISBN: {loan.Book.isbn}
            </div>
          )}
        </div>
      ),
      className: "w-48",
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (loan) => (
        <div className="space-y-2">
          {getStatusBadge(loan)}
          {/* Pickup Code Display */}
          {loan.pickup_code && (
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded font-mono">
                {loan.pickup_code}
              </code>
            </div>
          )}
          {/* Renewal Status */}
          {loan.renewal_status && loan.renewal_status !== "none" && (
            <div>{getRenewalStatusBadge(loan.renewal_status)}</div>
          )}
        </div>
      ),
      className: "w-40",
    },
    {
      header: "Thời gian",
      accessor: "dates",
      render: (loan) => (
        <div className="space-y-1 text-xs">
          <div className="text-gray-600 dark:text-gray-400">
            <span className="font-medium">Yêu cầu:</span>{" "}
            {formatDate(loan.request_date)}
          </div>
          {loan.approved_date && (
            <div className="text-green-600 dark:text-green-400">
              <span className="font-medium">Duyệt:</span>{" "}
              {formatDate(loan.approved_date)}
            </div>
          )}
          {loan.loan_date && (
            <div className="text-blue-600 dark:text-blue-400">
              <span className="font-medium">Nhận:</span>{" "}
              {formatDate(loan.loan_date)}
            </div>
          )}
          {loan.due_date && (
            <div
              className={`${
                isOverdue(loan)
                  ? "text-red-600 dark:text-red-400 font-semibold"
                  : "text-yellow-600 dark:text-yellow-400"
              }`}
            >
              <span className="font-medium">Hạn trả:</span>{" "}
              {formatDate(loan.due_date)}
            </div>
          )}
          {loan.return_date && (
            <div className="text-gray-600 dark:text-gray-400">
              <span className="font-medium">Trả:</span>{" "}
              {formatDate(loan.return_date)}
            </div>
          )}
          {/* Hold until for approved/pending_pickup */}
          {loan.hold_until &&
            (loan.status === "approved" ||
              loan.status === "pending_pickup") && (
              <div className="text-purple-600 dark:text-purple-400">
                <span className="font-medium">Giữ đến:</span>{" "}
                {formatDate(loan.hold_until)}
              </div>
            )}
        </div>
      ),
      className: "w-48",
    },
    {
      header: "Chi tiết",
      accessor: "details",
      render: (loan) => (
        <div className="space-y-1 text-xs">
          {/* Fine Amount */}
          {loan.fine_amount && parseFloat(loan.fine_amount) > 0 && (
            <div className="text-red-600 dark:text-red-400 font-medium">
              Phạt: {formatCurrency(loan.fine_amount)}
            </div>
          )}

          {/* Renew Count - luôn hiển thị để người quản lý dễ quan sát */}
          <div className="text-blue-600 dark:text-blue-400">
            Gia hạn: {loan.renew_count}/1 lần
          </div>

          {/* Approver */}
          {loan.approver && (
            <div className="text-gray-600 dark:text-gray-400">
              Duyệt bởi:{" "}
              {(() => {
                const user = loan.approver?.User;
                if (!user) return "N/A";

                // Try to construct full name from first_name and last_name
                const fullName = `${user.first_name || ""} ${
                  user.last_name || ""
                }`.trim();
                if (fullName) return fullName;

                // Fallback to username
                if (user.username) return user.username;

                return "N/A";
              })()}
            </div>
          )}

          {/* Rejection reason */}
          {loan.rejection_reason && (
            <div
              className="text-red-600 dark:text-red-400 max-w-32 truncate"
              title={loan.rejection_reason}
            >
              Lý do từ chối: {loan.rejection_reason}
            </div>
          )}

          {/* Notes */}
          {loan.notes && (
            <div
              className="text-gray-600 dark:text-gray-400 max-w-32 truncate"
              title={loan.notes}
            >
              Ghi chú: {loan.notes}
            </div>
          )}
        </div>
      ),
      className: "w-40",
    },
    {
      header: "Hành động",
      accessor: "actions",
      render: (loan) => {
        const canApprove = loan.status === "requested";
        const canConfirmPickup =
          loan.status === "approved" ||
          (loan.status === "pending_pickup" && loan.pickup_code);
        const canConfirmReturn = loan.status === "borrowed";
        const canApproveRenewal =
          loan.status === "borrowed" && loan.renewal_status === "requested";

        return (
          <div className="flex flex-wrap gap-1">
            {/* Approve Request */}
            {canApprove && (
              <button
                onClick={() => approveRequest(loan.loan_id)}
                className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                title="Duyệt yêu cầu"
              >
                <FaCheck className="w-3 h-3" />
              </button>
            )}

            {/* Confirm Pickup */}
            {canConfirmPickup && (
              <button
                onClick={() =>
                  loan.pickup_code
                    ? confirmPickupWithCode(loan.pickup_code)
                    : confirmPickup(loan.loan_id)
                }
                className="px-2 py-1 text-xs bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
                title="Xác nhận thành viên nhận sách"
              >
                <FaCheckCircle className="w-3 h-3" />
              </button>
            )}

            {/* Confirm Return */}
            {canConfirmReturn && (
              <button
                onClick={() => confirmReturn(loan.loan_id, loan.pickup_code)}
                className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
                title="Xác nhận trả sách"
              >
                <FaUndo className="w-3 h-3" />
              </button>
            )}

            {/* Approve Renewal */}
            {canApproveRenewal && (
              <>
                <button
                  onClick={() => approveRenewal(loan.loan_id)}
                  className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded transition-colors"
                  title="Duyệt gia hạn"
                >
                  <FaCheck className="w-3 h-3" />
                </button>
                <button
                  onClick={() => rejectRenewal(loan.loan_id)}
                  className="px-2 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                  title="Từ chối gia hạn"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </>
            )}
          </div>
        );
      },
      className: "w-32",
    },
  ];

  const renderMobileCard = (loan, index) => {
    /* ------------ Xác định quyền thao tác cho mobile ------------ */
    const canConfirmPickup =
      loan.status === "approved" ||
      (loan.status === "pending_pickup" && loan.pickup_code);
    const canConfirmReturn = loan.status === "borrowed";
    const canApproveRenewal = loan.renewal_status === "pending";

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              #{index + 1}
            </span>
            {getStatusBadge(loan)}
          </div>
          {isOverdue(loan) && (
            <FaExclamationTriangle className="text-red-500" />
          )}
        </div>

        {/* Main Info */}
        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Thành viên
            </span>
            <div className="font-medium text-blue-600 dark:text-blue-400">
              {loan.Member?.member_code || "N/A"}
            </div>
          </div>

          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Sách
            </span>
            <div className="font-medium text-gray-900 dark:text-white">
              {loan.Book?.title || "N/A"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Ngày mượn
              </span>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {formatDate(loan.loan_date)}
              </div>
            </div>
            <div>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Hạn trả
              </span>
              <div
                className={`text-sm font-medium ${
                  isOverdue(loan)
                    ? "text-red-600 dark:text-red-400"
                    : "text-gray-600 dark:text-gray-400"
                }`}
              >
                {formatDate(loan.due_date)}
              </div>
            </div>
          </div>

          {loan.returned && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Ngày trả
                </span>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {formatDate(loan.return_date)}
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                  Phí phạt
                </span>
                <div
                  className={`text-sm font-medium ${
                    loan.fine_amount && loan.fine_amount > 0
                      ? "text-red-600 dark:text-red-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {formatCurrency(loan.fine_amount || 0)}
                </div>
              </div>
            </div>
          )}

          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Gia hạn
            </span>
            <div className="mt-1">
              {getRenewalStatusBadge(loan.renewal_status)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          {/* ✅ Xác nhận nhận sách */}
          {canConfirmPickup && (
            <button
              onClick={() =>
                loan.pickup_code
                  ? confirmPickupWithCode(loan.pickup_code)
                  : confirmPickup(loan.loan_id)
              }
              className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 rounded-md transition-colors"
            >
              <FaCheckCircle className="mr-2" />
              Xác nhận thành viên nhận sách
            </button>
          )}

          {/* 🔄 Trả sách */}
          {canConfirmReturn && (
            <button
              onClick={() => confirmReturn(loan.loan_id, loan.pickup_code)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 rounded-md transition-colors"
            >
              <FaUndo className="mr-2" />
              Trả sách
            </button>
          )}

          {/* 📄 Duyệt/Từ chối gia hạn */}
          {canApproveRenewal && (
            <>
              <button
                onClick={() => approveRenewal(loan.loan_id)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-green-700 bg-green-100 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 rounded-md transition-colors"
              >
                <FaCheck className="mr-2" />
                Duyệt gia hạn
              </button>
              <button
                onClick={() => rejectRenewal(loan.loan_id)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 rounded-md transition-colors"
              >
                <FaTimes className="mr-2" />
                Từ chối
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <HybridTable
      columns={columns}
      data={loans}
      loading={loading}
      emptyMessage="Không có phiếu mượn nào"
      renderMobileCard={renderMobileCard}
      keyField="loan_id"
      mobileBreakpoint="lg"
    />
  );
};

export default LoanTable;
