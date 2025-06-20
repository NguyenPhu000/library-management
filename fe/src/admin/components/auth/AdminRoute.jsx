import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

/**
 * Component bảo vệ các route admin
 * Chỉ cho phép người dùng có role admin truy cập
 */
const AdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  // Hiển thị loading khi đang kiểm tra xác thực
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Kiểm tra người dùng đã đăng nhập và có quyền admin
  if (!currentUser) {
    // Chuyển hướng đến trang đăng nhập admin với thông tin về trang đang cố gắng truy cập
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Kiểm tra role admin
  if (currentUser.role !== "admin") {
    // Nếu đã đăng nhập nhưng không phải admin, chuyển về trang đăng nhập admin
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Nếu là admin, hiển thị nội dung được bảo vệ
  return children;
};

export default AdminRoute;
