import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaBook,
  FaListAlt,
  FaUsers,
  FaMoneyBill,
  FaExchangeAlt,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import Footer from "../components/layout/Footer";
import Swal from "sweetalert2";

const AdminLayout = () => {
  const { currentUser, loading, logout, checkAuth } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const verifyAdmin = async () => {
      // Nếu chưa có thông tin user, thử lấy lại từ token
      if (!currentUser) {
        await checkAuth();
      }
    };

    verifyAdmin();
  }, [checkAuth, currentUser]);

  // Hiển thị loading khi đang kiểm tra xác thực
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Kiểm tra quyền admin
  if (!currentUser) {
    console.log("No user found, redirecting to login");
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== "admin") {
    console.log("User is not admin, redirecting to login");
    // Hiển thị thông báo không có quyền truy cập
    Swal.fire({
      icon: "error",
      title: "Không có quyền truy cập",
      text: "Bạn không có quyền truy cập vào trang quản trị",
      confirmButtonText: "Đăng nhập lại",
    }).then(() => {
      logout();
    });
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Các menu item cho sidebar
  const menuItems = [
    { path: "/admin", icon: <FaTachometerAlt />, label: "Dashboard" },
    { path: "/admin/books", icon: <FaBook />, label: "Quản lý sách" },
    { path: "/admin/categories", icon: <FaListAlt />, label: "Danh mục" },
    { path: "/admin/users", icon: <FaUsers />, label: "Người dùng" },
    { path: "/admin/members", icon: <FaUser />, label: "Thành viên" },
    { path: "/admin/loans", icon: <FaExchangeAlt />, label: "Quản lý mượn" },
    { path: "/admin/payments", icon: <FaMoneyBill />, label: "Thanh toán" },
  ];

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Đăng xuất?",
        text: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống quản trị?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đăng xuất",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        console.log("AdminLayout: Starting logout process...");
        await logout();
        console.log("AdminLayout: Logout completed");
      }
    } catch (error) {
      console.error("AdminLayout: Logout error:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi đăng xuất",
        text: "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } flex flex-col transition-all duration-300 ease-in-out fixed h-full z-10`}
      >
        {/* Logo và tiêu đề */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <Link to="/admin" className="flex items-center">
            {sidebarOpen ? (
              <h1 className="text-xl font-bold text-white">
                SERN Library Admin
              </h1>
            ) : (
              <span className="text-xl font-bold">S</span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="text-gray-300 hover:text-white"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Thông tin admin */}
        <div className="p-4 flex items-center border-b border-gray-700">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold mr-3">
            {currentUser?.firstName?.charAt(0) ||
              currentUser?.username?.charAt(0) ||
              "A"}
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-medium">
                {currentUser?.firstName || currentUser?.username}
              </p>
              <p className="text-sm text-gray-400">{currentUser?.email}</p>
            </div>
          )}
        </div>

        {/* Menu chính */}
        <div className="flex-grow overflow-y-auto pt-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/admin" &&
                  location.pathname.startsWith(item.path));

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center py-3 px-4 transition-colors duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {sidebarOpen && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Footer sidebar */}
        <div className="p-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded transition-colors duration-200"
          >
            <FaHome />
            {sidebarOpen && <span className="ml-3">Về trang chủ</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-700 hover:text-white rounded w-full text-left transition-colors duration-200"
          >
            <FaSignOutAlt />
            {sidebarOpen && <span className="ml-3">Đăng xuất</span>}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`flex flex-col flex-1 ${
          sidebarOpen ? "ml-64" : "ml-20"
        } transition-all duration-300 ease-in-out`}
      >
        <Header user={currentUser} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AdminLayout;
