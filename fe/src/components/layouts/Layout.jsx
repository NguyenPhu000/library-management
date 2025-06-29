import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import AdminFloatingButton from "../ui/AdminFloatingButton";

const Layout = () => {
  return (
    <div className="bg-library-background text-library-text-primary min-h-screen flex flex-col">
      {/* Header với library theme */}
      <Header />

      {/* Nội dung chính với proper spacing và typography */}
      <main className="flex-grow px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Footer với library styling */}
      <Footer />

      {/* Admin Floating Button - giữ nguyên functionality */}
      <AdminFloatingButton />
    </div>
  );
};

export default Layout;
