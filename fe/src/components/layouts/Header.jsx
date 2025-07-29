import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faBook,
  faClock,
  faCreditCard,
  faSignOutAlt,
  faHome,
  faList,
  faPhone,
  faSignInAlt,
  faCog,
  faUserCircle,
  faBars,
  faTimes,
  faBookOpen,
  faChevronDown,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import SearchBar from "../sections/SearchBar";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Xử lý đăng xuất
  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Đăng xuất?",
        text: "Bạn có chắc chắn muốn đăng xuất?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đăng xuất",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        await logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const NavLink = ({ to, children, icon, onClick, isMobile = false }) => (
    <Link
      to={to}
      onClick={() => {
        if (onClick) onClick();
        if (isMobile) setIsMobileMenuOpen(false);
      }}
      className={`flex items-center ${
        isMobile
          ? "px-4 py-3 border-l-4 border-transparent hover:border-[#5E936C] hover:bg-gray-200 dark:hover:bg-gray-800/50"
          : "px-4 py-2 rounded-lg"
      } text-gray-600 dark:text-gray-300 hover:text-[#5E936C] dark:hover:text-[#E8FFD7] hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-300 ease-in-out group`}
    >
      {icon && (
        <FontAwesomeIcon
          icon={icon}
          className={`${
            isMobile ? "mr-4 text-lg" : "mr-2"
          } text-gray-500 dark:text-gray-400 group-hover:text-[#5E936C] dark:group-hover:text-[#93DA97] transition-colors duration-300`}
        />
      )}
      <span className="font-medium">{children}</span>
    </Link>
  );

  const DropdownItem = ({ to, children, icon, onClick, isLogout = false }) => {
    if (isLogout) {
      return (
        <button
          onClick={() => {
            setIsDropdownOpen(false);
            onClick && onClick();
          }}
          className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 transition-all duration-300 ease-in-out group"
        >
          {icon && (
            <FontAwesomeIcon
              icon={icon}
              className="mr-3 text-red-600 dark:text-red-500 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors duration-300"
            />
          )}
          {children}
        </button>
      );
    }

    return (
      <Link
        to={to}
        onClick={() => setIsDropdownOpen(false)}
        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-[#5E936C] dark:hover:text-[#E8FFD7] transition-all duration-300 ease-in-out group"
      >
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-[#5E936C] dark:group-hover:text-[#93DA97] transition-colors duration-300"
          />
        )}
        {children}
      </Link>
    );
  };

  return (
    <header className="bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 text-gray-900 dark:text-white shadow-2xl sticky top-0 z-50 border-b border-gray-300 dark:border-gray-700/30 backdrop-blur-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#5E936C] to-[#93DA97] rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-[#5E936C]/30 transition-all duration-300 group-hover:scale-105">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-white text-lg"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#2D4A32] via-[#5E936C] to-[#3E5F44] dark:from-[#E8FFD7] dark:via-[#93DA97] dark:to-[#5E936C] bg-clip-text text-transparent">
              Góc Thư Viện
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink to="/home" icon={faHome}>
              Trang Chủ
            </NavLink>
            <NavLink to="/books" icon={faList}>
              Danh Sách
            </NavLink>
            <NavLink to="/contact" icon={faPhone}>
              Liên Hệ
            </NavLink>
            {currentUser && currentUser.role === "admin" && (
              <NavLink to="/admin" icon={faCog}>
                Quản lý
              </NavLink>
            )}
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Search Bar - Hidden on mobile */}
            <div className="hidden sm:block">
              <SearchBar />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800/50 border-2 border-gray-300 dark:border-gray-600/50 hover:border-[#5E936C] hover:bg-gray-300 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-400 hover:text-[#5E936C] dark:hover:text-[#93DA97] transition-all duration-300 group"
              title={
                darkMode ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối"
              }
            >
              <FontAwesomeIcon
                icon={darkMode ? faSun : faMoon}
                className="text-lg group-hover:scale-110 transition-transform duration-300"
              />
            </button>

            {/* User Section */}
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800/50 border-2 border-gray-300 dark:border-gray-600/50 hover:border-[#5E936C] dark:hover:border-[#93DA97]/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-all duration-300 group shadow-lg hover:shadow-xl"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#5E936C] to-[#93DA97] rounded-full flex items-center justify-center">
                    <FontAwesomeIcon
                      icon={faUserCircle}
                      className="text-white text-lg"
                    />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {currentUser.fullName || currentUser.username}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                      {currentUser.role}
                    </div>
                  </div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-gray-500 dark:text-gray-400 text-sm transition-transform duration-300 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border border-gray-300 dark:border-gray-700/50 rounded-2xl shadow-2xl ring-1 ring-black/5 dark:ring-black/20 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-[#5E936C] to-[#93DA97] rounded-full flex items-center justify-center">
                          <FontAwesomeIcon
                            icon={faUserCircle}
                            className="text-white text-lg"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {currentUser.fullName || currentUser.username}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {currentUser.role}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      {currentUser.role === "admin" ? (
                        <>
                          <DropdownItem to="/admin" icon={faCog}>
                            Quản lý thư viện
                          </DropdownItem>
                        </>
                      ) : (
                        <>
                          <DropdownItem to="/profile" icon={faUser}>
                            Hồ sơ
                          </DropdownItem>
                          <DropdownItem to="/loans" icon={faBook}>
                            Sách đang mượn
                          </DropdownItem>
                          <DropdownItem to="/history" icon={faClock}>
                            Lịch sử mượn
                          </DropdownItem>
                          <DropdownItem to="/payments" icon={faCreditCard}>
                            Thanh toán
                          </DropdownItem>
                        </>
                      )}
                      <div className="border-t border-gray-200 dark:border-gray-700/50 my-2"></div>
                      <DropdownItem
                        onClick={handleLogout}
                        icon={faSignOutAlt}
                        isLogout={true}
                      >
                        Đăng xuất
                      </DropdownItem>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-[#5E936C]/30 hover:scale-105"
              >
                <FontAwesomeIcon icon={faSignInAlt} />
                <span>Đăng nhập</span>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800/50 border-2 border-gray-300 dark:border-gray-600/50 hover:border-[#5E936C] dark:hover:border-[#93DA97]/50 text-gray-600 dark:text-gray-400 hover:text-[#5E936C] dark:hover:text-[#93DA97] transition-all duration-300"
            >
              <FontAwesomeIcon
                icon={isMobileMenuOpen ? faTimes : faBars}
                className="text-lg"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-100 dark:bg-gray-900/95 backdrop-blur-xl border-t border-gray-300 dark:border-gray-700/50">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <div className="sm:hidden mb-4">
              <SearchBar />
            </div>

            <NavLink to="/home" icon={faHome} isMobile>
              Trang Chủ
            </NavLink>
            <NavLink to="/books" icon={faList} isMobile>
              Danh Sách
            </NavLink>
            <NavLink to="/contact" icon={faPhone} isMobile>
              Liên Hệ
            </NavLink>
            {currentUser && currentUser.role === "admin" && (
              <NavLink to="/admin" icon={faCog} isMobile>
                Quản lý
              </NavLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
