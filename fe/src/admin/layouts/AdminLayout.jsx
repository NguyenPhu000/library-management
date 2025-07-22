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
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

const AdminLayout = () => {
  const { currentUser, loading, logout, checkAuth } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("adminSidebarOpen");
    return saved ? JSON.parse(saved) : false; // Mặc định thu gọn
  });
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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest(".user-menu-container")) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

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
    localStorage.setItem("adminSidebarOpen", JSON.stringify(!sidebarOpen));
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

  const getUserDisplayName = () => {
    const firstName = currentUser?.first_name || "";
    const lastName = currentUser?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName || currentUser?.username || "Admin";
  };

  const getUserInitials = () => {
    const firstName = currentUser?.first_name || "";
    const lastName = currentUser?.last_name || "";
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    return currentUser?.username?.charAt(0)?.toUpperCase() || "A";
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Enhanced Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-16"
        } flex flex-col transition-all duration-300 ease-out fixed h-full z-30 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg`}
      >
        {/* Logo Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <Link to="/admin" className="flex items-center group">
            {sidebarOpen ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">L</span>
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                    Góc Thư Viện
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    v2.0.0
                  </p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 dark:from-blue-500 dark:to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-200 shadow-sm">
                <span className="text-white font-bold text-sm">L</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 sidebar-scroll">
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
                  <div key={item.path} className="relative group">
                    <Link
                      to={item.path}
                      className={`flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 shadow-sm"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full"></div>
                      )}
                      <span
                        className={`${
                          isActive
                            ? item.color
                            : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                        } transition-colors duration-200 ${
                          sidebarOpen ? "ml-2" : ""
                        }`}
                      >
                        {item.icon}
                      </span>
                      {sidebarOpen && (
                        <span className="ml-3 truncate font-medium">
                          {item.label}
                        </span>
                      )}
                    </Link>

                    {/* Tooltip for collapsed sidebar */}
                    {!sidebarOpen && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700"></div>
                      </div>
                    )}
                  </div>
                );
              })}
          </nav>
        </div>

        {/* Elegant Toggle Button */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={toggleSidebar}
            className="w-full flex items-center justify-center p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 group"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-200">
              {sidebarOpen ? (
                <FaAngleLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
              ) : (
                <FaAngleRight className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
              )}
            </div>
            {sidebarOpen && (
              <span className="ml-3 text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                Thu gọn
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } transition-all duration-300 ease-out`}
      >
        {/* Enhanced Header with User Menu */}
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between h-full px-6">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Trang quản lý thư viện
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <button className="relative p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
                <FaBell className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">3</span>
                </span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
              >
                {darkMode ? (
                  <FaSun className="w-5 h-5 text-yellow-500 group-hover:text-yellow-600 transition-colors duration-200" />
                ) : (
                  <FaMoon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                )}
              </button>

              {/* Settings */}
              <button className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group">
                <FaCog className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
              </button>

              {/* User Menu - Moved to top right */}
              <div className="relative user-menu-container">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-sm group-hover:scale-105 transition-transform duration-200">
                    {getUserInitials()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {getUserDisplayName()}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentUser?.adminType === "admin"
                        ? "Super Admin"
                        : "Admin"}
                    </p>
                  </div>
                  <FaChevronDown
                    className={`w-4 h-4 text-gray-400 transition-all duration-200 ${
                      userMenuOpen
                        ? "rotate-180 text-blue-600 dark:text-blue-400"
                        : "group-hover:text-gray-600 dark:group-hover:text-gray-300"
                    }`}
                  />
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                          {getUserInitials()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {currentUser?.email}
                          </p>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 mt-1">
                            {currentUser?.adminType === "admin"
                              ? "Super Admin"
                              : "Admin"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/home"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaHome className="w-4 h-4 mr-3 text-gray-400" />
                        Về trang chủ
                      </Link>
                      <Link
                        to="/admin/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <FaUser className="w-4 h-4 mr-3 text-gray-400" />
                        Hồ sơ cá nhân
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          handleLogout();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <FaSignOutAlt className="w-4 h-4 mr-3" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                )}
              </div>
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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
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
