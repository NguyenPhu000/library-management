import React from "react";
import { Link } from "react-router-dom";
import { FiSettings } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";

const AdminFloatingButton = () => {
  const { currentUser } = useAuth();

  // Chỉ hiển thị cho admin
  if (!currentUser || currentUser.role !== "admin") {
    return null;
  }

  return (
    <Link
      to="/admin"
      className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-110 group"
      title="Quản lý thư viện"
    >
      <FiSettings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
        A
      </div>
    </Link>
  );
};

export default AdminFloatingButton;
