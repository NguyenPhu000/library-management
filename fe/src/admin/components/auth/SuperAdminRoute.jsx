import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

const SuperAdminRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate to="/login?admin=true" state={{ from: location }} replace />
    );
  }

  if (!(currentUser.role === "admin" && currentUser.adminType === "admin")) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default SuperAdminRoute;
