import { Link } from "react-router-dom";
import { useState } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa"; // Import icons
import SearchBar from "../sections/SearchBar";
const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const logoutUrl = `${import.meta.env.VITE_API_BASE_URL}/logout`;
  return (
    <header className="bg-black text-white py-5 px-8 flex items-center justify-between shadow-md sticky top-0 z-50">
      {/* Logo */}
      <Link
        to="/"
        className="text-3xl font-bold tracking-tight flex items-center space-x-2 hover:scale-105 transition-transform duration-300 cursor-pointer"
      >
        <span className="text-lightGreen">Góc</span>
        <span className="text-white">Thư</span>
        <span className="text-lightGreen">Viện</span>
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex space-x-8 text-lg font-medium">
        <Link
          to="/"
          className="hover:text-lightGreen border-b-2 border-transparent hover:border-lightGreen transition-colors duration-300 pb-1"
        >
          Trang Chủ
        </Link>
        <Link
          to="/books"
          className="hover:text-lightGreen border-b-2 border-transparent hover:border-lightGreen transition-colors duration-300 pb-1"
        >
          Danh Sách
        </Link>
        <Link
          to="/contact"
          className="hover:text-lightGreen border-b-2 border-transparent hover:border-lightGreen transition-colors duration-300 pb-1"
        >
          Liên Hệ
        </Link>
      </nav>

      {/* Search & User */}
      <div className="flex items-center space-x-6">
        {/* Search Bar */}
        <SearchBar />

        {/* User Icon + Dropdown */}
        <div className="relative">
          <FaUserCircle
            className="text-3xl cursor-pointer text-gray-400 hover:text-lightGreen transition-colors hover:animate-pulse"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          />

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-gray-900 border-2 border-gray-700 rounded-lg shadow-lg py-2 z-10">
              <Link
                to="/profile"
                className="flex justify-start items-center block px-4 py-2 text-white hover:text-gray-300 hover:bg-gray-800 transition duration-200"
              >
                <i className="fa-solid fa-id-card mr-2 text-gray-300"></i> Hồ sơ
              </Link>
              <Link
                to="/borrowed"
                className="flex justify-start items-center block px-4 py-2 text-white hover:text-lightGreen hover:bg-gray-800 transition duration-200"
              >
                <i className="fa-solid fa-book mr-2 text-lightGreen"></i>
                Sách đang mượn
              </Link>
              <Link
                to="/history"
                className="flex justify-start items-center block px-4 py-2 text-white hover:text-blue-500 hover:bg-gray-800 transition duration-200"
              >
                <i className="fa-solid fa-book-open mr-2 text-blue-500"></i>
                Lịch sử Mượn
              </Link>

              <Link
                to="/settings"
                className="flex justify-start items-center block px-4 py-2 text-white hover:text-gray-400 hover:bg-gray-800 transition duration-200"
              >
                <i className="fa-solid fa-gear mr-2 text-gray-400"></i> Cài đặt
              </Link>
              <Link
                to={logoutUrl}
                className="flex justify-start items-center w-full text-left px-4 py-2 text-white hover:text-red-500 hover:bg-gray-800 transition duration-200"
              >
                <i className="fa-solid fa-sign-out-alt mr-2 text-red-500"></i>{" "}
                Đăng xuất
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
