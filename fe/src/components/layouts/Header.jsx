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
      className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
    >
      {Icon && (
        <Icon className="mr-2 h-5 w-5 text-gray-400 group-hover:text-lightGreen transition-colors duration-200" />
      )}
      <span className="font-medium">{children}</span>
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
          className="flex items-center w-full px-4 py-3 text-sm text-red-400 hover:bg-red-900/50 hover:text-red-300 transition-all duration-200 ease-in-out group"
        >
          {Icon && (
            <Icon
              className="mr-3 h-5 w-5 text-red-500 group-hover:text-red-400 transition-colors duration-200"
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
        className="flex items-center w-full px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
      >
        {Icon && (
          <Icon
            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-lightGreen transition-colors duration-200"
            aria-hidden="true"
          />
        )}
        {children}
      </Link>
    );
  };

  return (
    <header className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-4 px-6 md:px-10 flex items-center justify-between shadow-lg sticky top-0 z-50 border-b border-gray-700/50">
      {/* Logo */}
      <Link
        to="/"
        className="text-2xl md:text-3xl font-bold tracking-tight flex items-center space-x-1.5 hover:opacity-90 transition-opacity duration-300 cursor-pointer"
      >
        <span className="text-lightGreen">Góc</span>
        <span className="text-white">Thư</span>
        <span className="text-lightGreen">Viện</span>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center space-x-2">
        <NavLink to="/" icon={FiHome}>
          Trang Chủ
        </NavLink>
        <NavLink to="/books" icon={FiList}>
          Danh Sách
        </NavLink>
        <NavLink to="/contact" icon={FiPhone}>
          {" "}
          {/* Updated Icon */}
          Liên Hệ
        </NavLink>
      </nav>

      {/* Search & User */}
      <div className="flex items-center space-x-4 md:space-x-6">
        {/* Search Bar */}
        <SearchBar />

        {/* User Icon + Dropdown or Login Button */}
        {currentUser ? (
          // Đã đăng nhập - Hiển thị avatar và dropdown
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center justify-center text-gray-400 hover:text-lightGreen focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-lightGreen rounded-full transition-colors duration-200"
              aria-label="User menu"
              aria-haspopup="true"
            >
              <div className="flex items-center">
                <FaUserCircle className="h-8 w-8" />
                <span className="ml-2 text-sm text-gray-300 hidden md:block">
                  {currentUser.fullName || currentUser.username}
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div
                className="absolute right-0 mt-3 w-60 origin-top-right bg-gray-800/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-fade-in-down"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div className="py-1" role="none">
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
                  <div className="border-t border-gray-700 my-1"></div>
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
          // Chưa đăng nhập - Hiển thị nút đăng nhập
          <Link
            to="/login"
            className="flex items-center px-3 py-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200 ease-in-out group"
          >
            <FiLogIn className="mr-2 h-5 w-5 text-gray-400 group-hover:text-lightGreen transition-colors duration-200" />
            <span className="font-medium">Đăng nhập</span>
          </Link>
        )}
      </div>
      {/* Basic CSS for fade-in animation (add to your global CSS or index.css) */}
      <style jsx global>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.2s ease-out;
        }
      `}</style>
    </header>
  );
};

export default Header;
