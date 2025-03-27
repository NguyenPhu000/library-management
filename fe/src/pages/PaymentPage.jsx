import React from "react";
import { usePayment } from "../contexts/PaymentContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard } from "@fortawesome/free-solid-svg-icons";

const PaymentPage = () => {
  const { payments, loading, error } = usePayment();

  if (loading) {
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white">
        Đang tải danh sách thanh toán...
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-poppins p-4 bg-gray-900 text-white">
        Lỗi: {error}
      </div>
    );
  }

  return (
    <div className="font-poppins p-4 bg-gray-900 text-white">
      <h1 className="text-lightGreen mb-4 text-2xl font-bold">
        <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Danh sách thanh
        toán
      </h1>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 rounded-md shadow-md bg-gray-800">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Mã thành viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Tên người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Tiền phạt
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Ngày thanh toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Phương thức thanh toán
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Số tiền đã nhận
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-lightGreen uppercase tracking-wider">
                Trạng thái
              </th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {payments.map((payment) => (
              <tr
                key={payment.payment_id}
                className="hover:bg-gray-600 transition-colors duration-200"
              >
                <td>{payment.Member.member_code}</td>
                <td>{payment.User.username}</td>
                <td>{payment.Loan.fine_amount}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(payment.payment_date).toLocaleDateString("vi-VN")}
                </td>
                <td>{payment.payment_method}</td>
                <td>{payment.amount}</td>
                <td
                  className={
                    payment.status === "PENDING"
                      ? "text-yellow-500"
                      : payment.status === "APPROVED"
                      ? "text-green-500"
                      : ""
                  }
                >
                  {payment.status === "PENDING"
                    ? "Đang chờ xác nhận thanh toán"
                    : payment.status === "APPROVED"
                    ? "Đã xác nhận thanh toán"
                    : payment.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentPage;
