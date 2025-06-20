import React from "react";
import { Link } from "react-router-dom";
import { FaBell, FaEnvelope, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../../../contexts/AuthContext";

const Header = ({ user }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý thư viện SERN
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Thông báo */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <FaBell className="text-gray-600" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
          </div>

          {/* Tin nhắn */}
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <FaEnvelope className="text-gray-600" />
              <span className="absolute top-0 right-0 bg-blue-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                5
              </span>
            </button>
          </div>

          {/* User dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 focus:outline-none">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
                {user?.firstName?.charAt(0) || "A"}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-700">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">Admin</p>
              </div>
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block">
              <Link
                to="/admin/profile"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaUser className="mr-2" /> Hồ sơ của tôi
              </Link>
              <button
                onClick={logout}
                className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
              >
                <FaSignOutAlt className="mr-2" /> Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
