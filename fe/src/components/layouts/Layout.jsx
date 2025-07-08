import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdminFloatingButton from "../ui/AdminFloatingButton";

const Layout = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
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
