import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faCheck,
  faTimes,
  faSpinner,
  faInfoCircle,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import loanService from "../../../services/loanService";
import Swal from "sweetalert2";

const PickupCodeInput = ({ onConfirmSuccess }) => {
  const [pickupCode, setPickupCode] = useState("");
  const [validating, setValidating] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  // Format input to PICK-XXXX
  const formatPickupCode = (value) => {
    // Loại bỏ ký tự không phải chữ/số và in hoa
    const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();

    if (cleaned.length === 0) return "";

    let codePart = cleaned;

    // Nếu bắt đầu bằng PICK thì cắt phần còn lại sau tiền tố
    if (codePart.startsWith("PICK")) {
      codePart = codePart.slice(4); // Bỏ "PICK"
    }

    // Giữ tối đa 4 ký tự cho phần mã
    codePart = codePart.slice(0, 4);

    return codePart ? `PICK-${codePart}` : "PICK-";
  };

  const handleInputChange = (e) => {
    const formatted = formatPickupCode(e.target.value);
    setPickupCode(formatted);

    // Clear validation when user types
    if (validationResult) {
      setValidationResult(null);
    }
  };

  const validateCode = async () => {
    if (!pickupCode || pickupCode.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Mã không hợp lệ",
        text: "Vui lòng nhập đủ mã nhận sách (PICK-XXXX)",
      });
      return;
    }

    setValidating(true);
    try {
      const result = await loanService.validatePickupCode(pickupCode);

      if (result.success) {
        setValidationResult(result);
        Swal.fire({
          icon: "success",
          title: "Mã hợp lệ!",
          html: `
            <div class="validation-result">
              <p><strong>Thành viên:</strong> ${
                result.loan.Member.member_code
              }</p>
              <p><strong>Sách:</strong> ${result.loan.Book.title}</p>
              <p><strong>Ngày yêu cầu:</strong> ${new Date(
                result.loan.request_date
              ).toLocaleDateString("vi-VN")}</p>
            </div>
          `,
          showCancelButton: true,
          confirmButtonText: "Xác nhận đưa sách",
          cancelButtonText: "Hủy",
          confirmButtonColor: "#28a745",
        }).then((confirmResult) => {
          if (confirmResult.isConfirmed) {
            confirmPickup();
          }
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Mã không hợp lệ",
          text: result.message || "Không tìm thấy mã nhận sách này",
        });
      }
    } catch (error) {
      console.error("Validation error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống",
        text: error.message || "Không thể xác thực mã nhận sách",
      });
    } finally {
      setValidating(false);
    }
  };

  const confirmPickup = async () => {
    if (!validationResult) return;

    setConfirming(true);
    try {
      // TODO: Get admin ID from context instead of hardcoding
      const adminId = 1; // Temporary hardcode - should get from AdminContext
      const result = await loanService.confirmPickupWithCode(
        pickupCode,
        adminId
      );

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "✅ Đã xác nhận!",
          html: `
            <div class="success-result">
              <p>Sách đã được đưa cho thành viên thành công!</p>
              <p><strong>Hạn trả:</strong> ${new Date(
                result.loan.due_date
              ).toLocaleDateString("vi-VN")}</p>
              <p class="text-sm text-gray-600 mt-2">Thời gian mượn: 10 ngày</p>
            </div>
          `,
          confirmButtonText: "Tiếp tục",
        });

        // Reset form
        setPickupCode("");
        setValidationResult(null);

        // Callback for parent component
        if (onConfirmSuccess) {
          onConfirmSuccess(result);
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Không thể xác nhận",
          text: result.message || "Có lỗi xảy ra khi xác nhận đưa sách",
        });
      }
    } catch (error) {
      console.error("Confirm error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi hệ thống",
        text: error.message || "Không thể xác nhận đưa sách",
      });
    } finally {
      setConfirming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !validating && pickupCode.length >= 8) {
      validateCode();
    }
  };

  return (
    <div className="pickup-code-input-container">
      <div className="pickup-input-header">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
          🎫 Xác nhận mã nhận sách
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Nhập mã nhận sách từ thành viên để xác nhận đưa sách
        </p>
      </div>

      <div className="pickup-input-form">
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <input
              type="text"
              value={pickupCode}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="PICK-XXXX"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-center font-mono text-lg font-bold tracking-wider uppercase text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength={9}
              disabled={validating || confirming}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
              Định dạng: PICK-XXXX (4 ký tự)
            </p>
          </div>

          <button
            onClick={validateCode}
            disabled={
              !pickupCode || pickupCode.length < 8 || validating || confirming
            }
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              !pickupCode || pickupCode.length < 8 || validating || confirming
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl"
            }`}
          >
            {validating ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang kiểm tra...
              </div>
            ) : (
              "Kiểm tra mã"
            )}
          </button>
        </div>

        {/* Validation Result Display */}
        {validationResult && (
          <div className="validation-display bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-green-800 mb-2">
                  ✅ Mã hợp lệ
                </h4>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="font-medium">Thành viên:</span>{" "}
                    {validationResult.loan.Member.member_code}
                  </p>
                  <p>
                    <span className="font-medium">Sách:</span>{" "}
                    {validationResult.loan.Book.title}
                  </p>
                  <p>
                    <span className="font-medium">Tác giả:</span>{" "}
                    {validationResult.loan.Book.author}
                  </p>
                  <p>
                    <span className="font-medium">Ngày yêu cầu:</span>{" "}
                    {new Date(
                      validationResult.loan.request_date
                    ).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <button
                onClick={confirmPickup}
                disabled={confirming}
                className={`ml-4 px-4 py-2 rounded-lg font-medium transition-all ${
                  confirming
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {confirming ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang xác nhận...
                  </div>
                ) : (
                  "🚀 Xác nhận đưa sách"
                )}
              </button>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="instructions bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-800 mb-2">
            📋 Hướng dẫn sử dụng:
          </h4>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Nhận mã từ thành viên (định dạng PICK-XXXX)</li>
            <li>2. Nhập mã vào ô bên trên</li>
            <li>3. Nhấn "Kiểm tra mã" để xác thực</li>
            <li>4. Nếu hợp lệ, nhấn "Xác nhận đưa sách"</li>
            <li>5. Đưa sách cho thành viên</li>
          </ol>
        </div>
      </div>

      <style>{`
        .pickup-code-input-container {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }

        .pickup-input-header {
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 16px;
          margin-bottom: 20px;
        }

        @media (max-width: 768px) {
          .pickup-code-input-container {
            padding: 16px;
          }

          .flex.gap-3 {
            flex-direction: column;
          }

          .validation-display .flex {
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default PickupCodeInput;
