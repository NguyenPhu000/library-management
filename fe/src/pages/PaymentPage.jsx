import React from "react";
import { usePayment } from "../contexts/PaymentContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

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

  return (
    <div className="font-poppins p-3 md:p-4 bg-gray-900 text-white">
      <h1 className="text-lightGreen mb-3 text-xl font-bold">
        <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Danh sách thanh
        toán
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 rounded-md shadow-md bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Mã thành viên
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Tiền phạt
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Ngày thanh toán
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider hidden md:table-cell">
                Phương thức
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {payments.length > 0 ? (
              payments.map((payment) => (
                <tr
                  key={payment.payment_id}
                  className="hover:bg-gray-600 transition-colors duration-200"
                >
                  <td className="px-3 py-2 text-sm">
                    {payment.Member.member_code}
                  </td>
                  <td className="px-3 py-2 text-sm">{payment.User.username}</td>
                  <td className="px-3 py-2 text-sm">
                    {payment.Loan.fine_amount}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-sm">
                    {new Date(payment.payment_date).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-3 py-2 text-sm hidden md:table-cell">
                    {payment.payment_method}
                  </td>
                  <td className="px-3 py-2 text-sm">{payment.amount}</td>
                  <td
                    className={`px-3 py-2 whitespace-normal text-sm ${
                      payment.status === "PENDING"
                        ? "text-yellow-500"
                        : payment.status === "APPROVED"
                        ? "text-green-500"
                        : ""
                    }`}
                  >
                    {payment.status === "PENDING"
                      ? "Đang chờ xác nhận"
                      : payment.status === "APPROVED"
                      ? "Đã xác nhận"
                      : payment.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-3 py-4 text-center text-sm text-gray-400"
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
