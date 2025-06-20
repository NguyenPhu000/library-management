import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBook,
  FaUsers,
  FaMoneyBillWave,
  FaUserTag,
  FaList,
  FaChevronDown,
  FaChevronRight,
  FaBars,
} from "react-icons/fa";

const SidebarItem = ({ icon, label, to, children, isActive }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (children) {
    return (
      <div className="mb-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center w-full px-4 py-2 text-left text-sm ${
            isActive
              ? "bg-blue-700 text-white"
              : "text-gray-300 hover:bg-gray-700 hover:text-white"
          } rounded-md transition-colors duration-200`}
        >
          <span className="mr-3">{icon}</span>
          <span className="flex-1">{label}</span>
          {isOpen ? (
            <FaChevronDown className="ml-auto" />
          ) : (
            <FaChevronRight className="ml-auto" />
          )}
        </button>

        {isOpen && <div className="pl-4 mt-1 space-y-1">{children}</div>}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-2 text-sm ${
          isActive
            ? "bg-blue-700 text-white"
            : "text-gray-300 hover:bg-gray-700 hover:text-white"
        } rounded-md transition-colors duration-200 mb-1`
      }
    >
      <span className="mr-3">{icon}</span>
      <span>{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="fixed top-4 left-4 z-40 md:hidden bg-gray-800 text-white p-2 rounded-md"
      >
        <FaBars size={20} />
      </button>

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-200 md:hidden ${
          isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      ></div>

      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-white font-bold text-xl">ADMIN PANEL</span>
        </div>

        <div className="p-4 space-y-2 overflow-y-auto h-[calc(100%-4rem)]">
          <SidebarItem
            to="/admin"
            icon={<FaHome size={18} />}
            label="Dashboard"
          />

          <SidebarItem
            to="/admin/books"
            icon={<FaBook size={18} />}
            label="Quản lý sách"
          />

          <SidebarItem
            to="/"
            icon={<FaHome size={18} />}
            label="Về trang chủ"
          />

          <SidebarItem
            to="/admin/categories"
            icon={<FaList />}
            label="Danh mục"
          />

          <SidebarItem
            to="/admin/users"
            icon={<FaUsers />}
            label="Người dùng"
          />

          <SidebarItem
            to="/admin/members"
            icon={<FaUserTag />}
            label="Thành viên"
          />

          <SidebarItem
            to="/admin/loans"
            icon={<FaBook />}
            label="Quản lý mượn trả"
          />

          <SidebarItem
            to="/admin/payments"
            icon={<FaMoneyBillWave />}
            label="Thanh toán"
          />

          <div className="py-2 mt-6 border-t border-gray-700">
            <p className="px-4 text-xs text-gray-500 uppercase mb-2">
              Phát triển
            </p>
            <p className="px-4 py-2 text-xs text-gray-400">
              Các mục quản lý khác đang được phát triển và sẽ được thêm vào
              trong các bản cập nhật tiếp theo.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
