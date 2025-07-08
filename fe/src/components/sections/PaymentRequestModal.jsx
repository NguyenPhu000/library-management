import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Modal from "react-modal";
import { usePayment } from "../../contexts/PaymentContext";
import { useLoan } from "../../contexts/LoanContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faTimes } from "@fortawesome/free-solid-svg-icons";
import { getPaymentById } from "../../services/paymentService";
import { motion } from "framer-motion";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const PaymentRequestModal = ({ isOpen, onRequestClose, loanId }) => {
  const { createPaymentRequest, getPendingQrPayment } = usePayment();
  const { getLoanDetail } = useLoan();
  const [loanDetail, setLoanDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [qrPayment, setQrPayment] = useState(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initData = async () => {
      if (!loanId) return;

      setLoading(true);
      try {
        const detail = await getLoanDetail(loanId);
        if (isMounted) {
          setLoanDetail(detail);
          // Nếu phát hiện payment pending cũ, chỉ thông báo chứ không hiển thị lại QR
          const pending = getPendingQrPayment(loanId);
          if (pending) {
            Swal.fire({
              icon: "info",
              title: "Phiên thanh toán cũ đã kết thúc",
              text: "Vui lòng tạo yêu cầu thanh toán mới để nhận mã QR mới.",
              confirmButtonColor: "#97bc62",
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết khoản vay:", error);
        if (isMounted) {
          Swal.fire({
            icon: "error",
            title: "Lỗi",
            text: "Không thể tải thông tin khoản vay. Vui lòng thử lại sau.",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initData();

    return () => {
      isMounted = false;
    };
  }, [loanId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loanDetail || !loanId) return;

    if (!paymentMethod) {
      Swal.fire({
        icon: "warning",
        title: "Lỗi",
        text: "Vui lòng chọn phương thức thanh toán",
      });
      return;
    }

    // Hỏi xác nhận trước khi gửi
    const { isConfirmed } = await Swal.fire({
      title: "Xác nhận tạo yêu cầu thanh toán",
      text:
        paymentMethod === "cash"
          ? "Yêu cầu sẽ được gửi và chờ thủ thư xác nhận."
          : "Bạn sẽ nhận mã QR để thanh toán. Tiếp tục?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Tiếp tục",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#97bc62",
    });

    if (!isConfirmed) return;

    try {
      setLoading(true);
      const paymentPayload = {
        loan_id: loanId,
        payment_method: paymentMethod,
        amount: loanDetail.fine_amount,
      };

      if (!paymentPayload.amount || paymentPayload.amount <= 0) {
        throw new Error("Số tiền phạt không hợp lệ");
      }

      const newPayment = await createPaymentRequest(paymentPayload);

      if (paymentMethod === "qrcode") {
        if (
          !newPayment.qr_code_url &&
          !newPayment.qr_data &&
          !newPayment.payment_content
        ) {
          throw new Error("Không thể tạo mã QR. Vui lòng thử lại sau.");
        }
        setQrPayment(newPayment);
      } else {
        await Swal.fire({
          icon: "success",
          title: "Đã gửi yêu cầu thanh toán",
          text: "Vui lòng chờ thủ thư xác nhận và thu phí.",
          confirmButtonColor: "#97bc62",
        });
        onRequestClose();
      }
    } catch (error) {
      console.error("Lỗi khi tạo yêu cầu thanh toán:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text:
          error.message ||
          "Không thể tạo yêu cầu thanh toán. Vui lòng thử lại sau.",
        confirmButtonColor: "#97bc62",
      });
    } finally {
      setLoading(false);
    }
  };

  // Poll payment status when QR payment exists
  useEffect(() => {
    let intervalId;
    if (qrPayment && qrPayment.payment_id) {
      intervalId = setInterval(async () => {
        try {
          const updated = await getPaymentById(qrPayment.payment_id);
          setQrPayment(updated);
          if (updated.status === "APPROVED") {
            clearInterval(intervalId);
          }
        } catch (err) {
          console.error("Lỗi kiểm tra trạng thái thanh toán:", err);
        }
      }, 5000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [qrPayment]);

  const isMobile = screenWidth < 768;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Thanh toán tiền phạt"
      className="bg-gray-900 p-4 rounded-lg w-full max-w-md mx-auto mt-20"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75 flex justify-center z-50"
      ariaHideApp={false}
    >
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lightGreen text-lg font-bold">
          <FontAwesomeIcon icon={faCreditCard} className="mr-2" />
          Thanh toán tiền phạt
        </h2>
        <button
          onClick={onRequestClose}
          className="text-gray-400 hover:text-white"
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-lightGreen border-t-transparent rounded-full"></div>
          <p className="mt-2 text-white text-sm">Đang tải...</p>
        </div>
      ) : loanDetail ? (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="bg-gray-800 p-3 rounded-md space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Sách:</span>
              <span className="text-white font-medium">
                {loanDetail.Book?.title || "N/A"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Ngày mượn:</span>
              <span className="text-white">
                {new Date(loanDetail.loan_date).toLocaleDateString("vi-VN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Ngày trả:</span>
              <span className="text-white">
                {loanDetail.return_date
                  ? new Date(loanDetail.return_date).toLocaleDateString("vi-VN")
                  : "Chưa trả"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Số ngày trễ hạn:</span>
              <span className="text-white">
                {loanDetail.overdue_days || 0} ngày
              </span>
            </div>
            <div className="flex justify-between font-medium border-t border-gray-700 pt-2 mt-2">
              <span className="text-red-400">Tiền phạt:</span>
              <span className="text-red-400">
                {loanDetail.fine_amount?.toLocaleString("vi-VN") || 0} VND
              </span>
            </div>
          </div>

          <div>
            <label className="block text-white text-xs mb-1">
              Phương thức thanh toán:
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-md text-white text-sm focus:outline-none focus:ring-1 focus:ring-lightGreen"
            >
              <option value="cash">Tiền mặt</option>
              <option value="qrcode">QR Code</option>
            </select>
          </div>

          {!qrPayment && (
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                className="bg-lightGreen text-gray-900 px-4 py-1.5 rounded-md font-medium text-sm hover:bg-opacity-90 transition duration-200"
              >
                Xác nhận thanh toán
              </button>
              <button
                type="button"
                onClick={onRequestClose}
                className="ml-2 bg-gray-700 text-white px-4 py-1.5 rounded-md font-medium text-sm hover:bg-gray-600 transition duration-200"
              >
                Hủy bỏ
              </button>
            </div>
          )}

          {qrPayment && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-6 relative"
            >
              {/* QR Code Container */}
              <div className="bg-[#1a1f2e] rounded-xl p-6 border border-gray-700/50">
                <div className="flex flex-col items-center">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 rounded-full bg-lightGreen animate-pulse"></div>
                    <h3 className="text-lightGreen font-semibold">
                      Quét mã QR để thanh toán
                    </h3>
                  </div>

                  {/* QR Code */}
                  <div className="relative group">
                    {qrPayment.qr_code_url ||
                    qrPayment.qr_data ||
                    qrPayment.payment_content ? (
                      <>
                        <div className="absolute inset-0 bg-lightGreen/5 rounded-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative">
                          <img
                            src={
                              qrPayment.qr_code_url ||
                              `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
                                qrPayment.qr_data ||
                                  qrPayment.payment_content ||
                                  ""
                              )}`
                            }
                            alt="QR Code Payment"
                            className="w-64 h-64 p-2 bg-white rounded-lg shadow-lg transform group-hover:scale-[1.02] transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-lightGreen/0 to-lightGreen/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      </>
                    ) : (
                      <div className="w-64 h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-2 border-lightGreen border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-gray-400 text-sm">
                            Đang tạo mã QR...
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Payment Info */}
                  <div className="mt-4 w-full">
                    <div className="flex justify-between items-center py-2 px-4 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-400">Số tiền:</span>
                      <span className="text-lightGreen font-medium">
                        {Number(qrPayment.amount).toLocaleString("vi-VN")} VND
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="mt-4 w-full">
                    <div
                      className={`flex items-center justify-center gap-2 py-2 px-4 rounded-lg ${
                        qrPayment.status === "APPROVED"
                          ? "bg-green-500/10 text-green-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {qrPayment.status === "APPROVED" ? (
                        <>
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            <FontAwesomeIcon
                              icon={faCircleCheck}
                              className="text-lg"
                            />
                          </motion.div>
                          <span className="font-medium">
                            Đã thanh toán thành công
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-medium">
                            Đang chờ thanh toán...
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Bank Info */}
                  {qrPayment.bank_info && (
                    <div className="mt-4 w-full text-center">
                      <p className="text-gray-400 text-sm">
                        Ngân hàng:{" "}
                        <span className="text-white">
                          {qrPayment.bank_info}
                        </span>
                      </p>
                    </div>
                  )}

                  {/* Help Text */}
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-xs">
                      Sử dụng ứng dụng ngân hàng để quét mã QR và thanh toán
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </form>
      ) : (
        <div className="text-center py-4 text-red-500">
          Không thể tải thông tin khoản vay
        </div>
      )}
    </Modal>
  );
};

export default PaymentRequestModal;
