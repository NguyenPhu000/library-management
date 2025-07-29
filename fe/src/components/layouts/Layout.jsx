import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdminFloatingButton from "../ui/AdminFloatingButton";
import { useTheme } from "../../contexts/ThemeContext";

const Layout = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } min-h-screen flex flex-col transition-colors duration-300`}
    >
      {/* Header */}
      <Header />

      {/* Nội dung chính */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Floating Button */}
      <AdminFloatingButton />
    </div>
  );
};

export default Layout;
