import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Header = ({ onMenuButtonClick }) => {
  const { currentUser, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await Swal.fire({
        title: "Đăng xuất?",
        text: "Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Đăng xuất",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#d33",
      });

      if (result.isConfirmed) {
        await logout();
        navigate("/login");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.",
      });
    }
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={onMenuButtonClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Center: Search bar */}
        <div className="flex-1 mx-4 hidden md:block">
          <h1 className="text-xl font-semibold text-gray-800">
            Quản lý thư viện SERN
          </h1>
        </div>

        {/* Right: User menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center focus:outline-none"
          >
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
              {currentUser?.fullName?.charAt(0) || "A"}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
              {currentUser?.fullName || "Admin"}
            </span>
            <svg
              className="ml-1 h-5 w-5 text-gray-400 hidden md:block"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                }}
              >
                Hồ sơ
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                }}
              >
                Cài đặt
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                  handleLogout();
                }}
              >
                Đăng xuất
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
