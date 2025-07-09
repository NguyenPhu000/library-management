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
  FaBell,
  FaSearch,
  FaMoon,
  FaSun,
  FaCog,
  FaChevronDown,
  FaUserShield,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

const AdminLayout = () => {
  const { currentUser, loading, logout, checkAuth } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Kiểm tra xác thực khi component mount
  useEffect(() => {
    const verifyAdmin = async () => {
      if (!currentUser) {
        await checkAuth();
      }
    };
    verifyAdmin();
  }, [checkAuth, currentUser]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Hiển thị loading tinh tế
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-gray-900">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Kiểm tra quyền admin
  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (currentUser.role !== "admin") {
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  // Menu items với style tinh tế
  const menuItems = [
    {
      path: "/admin",
      icon: <FaTachometerAlt className="w-5 h-5" />,
      label: "Dashboard",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      path: "/admin/books",
      icon: <FaBook className="w-5 h-5" />,
      label: "Quản lý sách",
      color: "text-emerald-600 dark:text-emerald-400",
    },
    {
      path: "/admin/categories",
      icon: <FaListAlt className="w-5 h-5" />,
      label: "Danh mục",
      color: "text-orange-600 dark:text-orange-400",
    },
    {
      path: "/admin/users",
      icon: <FaUsers className="w-5 h-5" />,
      label: "Tài khoản",
      color: "text-purple-600 dark:text-purple-400",
      superAdminOnly: true,
    },
    {
      path: "/admin/members",
      icon: <FaUser className="w-5 h-5" />,
      label: "Thành viên",
      color: "text-pink-600 dark:text-pink-400",
    },
    {
      path: "/admin/loans",
      icon: <FaExchangeAlt className="w-5 h-5" />,
      label: "Quản lý mượn",
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      path: "/admin/payments",
      icon: <FaMoneyBill className="w-5 h-5" />,
      label: "Thanh toán",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      path: "/admin/admins",
      icon: <FaUserShield className="w-5 h-5" />,
      label: "Nhân sự",
      color: "text-cyan-600 dark:text-cyan-400",
      superAdminOnly: true,
    },
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
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#6b7280",
      });

      if (result.isConfirmed) {
        await logout();
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
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Elegant Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } flex flex-col transition-all duration-300 ease-in-out fixed h-full z-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm`}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className="flex items-center group">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">L</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Library Admin
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    v2.0.0
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="text-white font-semibold text-sm">L</span>
              </div>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            {sidebarOpen ? (
              <FaTimes className="w-4 h-4" />
            ) : (
              <FaBars className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {menuItems
              .filter(
                (item) =>
                  !(item.superAdminOnly && currentUser.adminType !== "admin")
              )
              .map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== "/admin" &&
                    location.pathname.startsWith(item.path));

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    <span
                      className={`${
                        isActive
                          ? item.color
                          : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                      } transition-colors`}
                    >
                      {item.icon}
                    </span>
                    {sidebarOpen && (
                      <span className="ml-3 truncate">{item.label}</span>
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* User Section */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {currentUser?.firstName?.charAt(0) ||
                  currentUser?.username?.charAt(0) ||
                  "A"}
              </div>
              {sidebarOpen && (
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {currentUser?.firstName || currentUser?.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {currentUser?.email}
                  </p>
                </div>
              )}
              {sidebarOpen && (
                <FaChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    userMenuOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            {/* User Dropdown */}
            {userMenuOpen && sidebarOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <FaHome className="w-4 h-4 mr-3" />
                  Về trang chủ
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FaSignOutAlt className="w-4 h-4 mr-3" />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } transition-all duration-300 ease-in-out`}
      >
        {/* Clean Header */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Trang quản lý thư viện
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* Search */}
              <div className="relative hidden md:block">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-10 pr-4 py-2 w-64 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-colors"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FaBell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">3</span>
                </span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {darkMode ? (
                  <FaSun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <FaMoon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Settings */}
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <FaCog className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          <Outlet />
        </main>

        {/* Minimal Footer */}
        <footer className="h-12 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Library Admin System
            </p>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-xs text-green-600 dark:text-green-400">
                Online
              </span>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500">v2.0.0</div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
