import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import {
  FiUser,
  FiBook,
  FiClock,
  FiCreditCard,
  FiLogOut,
  FiHome,
  FiList,
  FiPhone,
  FiLogIn,
  FiSettings,
} from "react-icons/fi";
import SearchBar from "../sections/SearchBar";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { currentUser, logout } = useAuth();
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
        customClass: {
          popup: "bg-library-surface",
          title: "text-library-text-primary",
          htmlContainer: "text-library-text-secondary",
        },
      });

      if (result.isConfirmed) {
        await logout();
        navigate("/login");
      }
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      className="flex items-center px-4 py-2 rounded-library text-library-text-secondary hover:bg-library-hover hover:text-library-primary transition-all duration-200 ease-in-out group"
    >
      {Icon && (
        <Icon className="mr-2 h-5 w-5 text-library-text-muted group-hover:text-library-primary transition-colors duration-200" />
      )}
      <span className="font-medium text-library-body">{children}</span>
    </Link>
  );

  const DropdownItem = ({
    to,
    children,
    icon: Icon,
    onClick,
    isLogout = false,
  }) => {
    if (isLogout) {
      return (
        <button
          onClick={() => {
            setIsDropdownOpen(false);
            onClick && onClick();
          }}
          className="flex items-center w-full px-4 py-3 text-sm text-library-error hover:bg-red-50 hover:text-red-700 transition-all duration-200 ease-in-out group"
        >
          {Icon && (
            <Icon
              className="mr-3 h-5 w-5 text-library-error group-hover:text-red-700 transition-colors duration-200"
              aria-hidden="true"
            />
          )}
          {children}
        </button>
      );
    }

    return (
      <Link
        to={to}
        onClick={() => setIsDropdownOpen(false)} // Close dropdown on item click
        className="flex items-center w-full px-4 py-3 text-sm text-library-text-secondary hover:bg-library-hover hover:text-library-text-primary transition-all duration-200 ease-in-out group"
      >
        {Icon && (
          <Icon
            className="mr-3 h-5 w-5 text-library-text-muted group-hover:text-library-primary transition-colors duration-200"
            aria-hidden="true"
          />
        )}
        {children}
      </Link>
    );
  };

  return (
    <header className="bg-library-surface border-b border-library-border text-library-text-primary py-4 px-6 md:px-10 flex items-center justify-between shadow-library-card sticky top-0 z-50 backdrop-blur-sm bg-library-surface/95">
      {/* Logo với library branding */}
      <Link
        to="/"
        className="text-2xl md:text-3xl font-heading font-bold tracking-tight flex items-center space-x-1.5 hover:opacity-80 transition-opacity duration-300 cursor-pointer"
      >
        <span className="text-library-primary">Góc</span>
        <span className="text-library-text-primary">Thư</span>
        <span className="text-library-primary">Viện</span>
      </Link>

      {/* Navigation với minimal styling */}
      <nav className="hidden md:flex items-center space-x-1">
        <NavLink to="/" icon={FiHome}>
          Trang Chủ
        </NavLink>
        <NavLink to="/books" icon={FiList}>
          Danh Sách
        </NavLink>
        <NavLink to="/contact" icon={FiPhone}>
          Liên Hệ
        </NavLink>
        {/* Admin-only navigation link */}
        {currentUser && currentUser.role === "admin" && (
          <NavLink to="/admin" icon={FiSettings}>
            Quản lý
          </NavLink>
        )}
      </nav>

      {/* Search & User với library theme */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Search Bar */}
        <SearchBar />

        {/* User Icon + Dropdown or Login Button */}
        {currentUser ? (
          // Đã đăng nhập - Hiển thị avatar và dropdown
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center text-library-text-muted hover:text-library-primary focus:outline-none focus:ring-2 focus:ring-library-primary-light focus:ring-opacity-50 rounded-full transition-colors duration-200 p-2"
              aria-label="User menu"
              aria-haspopup="true"
            >
              <div className="flex items-center">
                <FaUserCircle className="h-8 w-8" />
                <span className="ml-2 text-sm text-library-text-secondary hidden md:block font-medium">
                  {currentUser.fullName || currentUser.username}
                </span>
              </div>
            </button>

            {/* Dropdown Menu với library styling */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-3 w-60 origin-top-right bg-library-surface border border-library-border rounded-library-card shadow-library-card-hover ring-1 ring-library-border ring-opacity-5 focus:outline-none overflow-hidden animate-slide-up"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div className="py-1" role="none">
                  {/* Admin-only link */}
                  {currentUser.role === "admin" && (
                    <>
                      <DropdownItem to="/admin" icon={FiSettings}>
                        Quản lý thư viện
                      </DropdownItem>
                      <div className="border-t border-library-border my-1"></div>
                    </>
                  )}

                  {/* Member-only links */}
                  {currentUser.role === "member" && (
                    <>
                      <DropdownItem to="/profile" icon={FiUser}>
                        Hồ sơ
                      </DropdownItem>
                      <DropdownItem to="/loans" icon={FiBook}>
                        Sách đang mượn
                      </DropdownItem>
                      <DropdownItem to="/history" icon={FiClock}>
                        Lịch sử Mượn
                      </DropdownItem>
                      <DropdownItem to="/payments" icon={FiCreditCard}>
                        Thanh toán
                      </DropdownItem>
                      <div className="border-t border-library-border my-1"></div>
                    </>
                  )}

                  <DropdownItem
                    onClick={handleLogout}
                    icon={FiLogOut}
                    isLogout={true}
                  >
                    Đăng xuất
                  </DropdownItem>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Chưa đăng nhập - Hiển thị nút đăng nhập với library button style
          <Link
            to="/login"
            className="btn-library-primary flex items-center text-sm font-medium"
          >
            <FiLogIn className="mr-2 h-4 w-4" />
            <span>Đăng nhập</span>
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
