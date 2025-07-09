import React, { useState, useEffect } from "react";
import { FiUsers, FiUserCheck, FiRefreshCw } from "react-icons/fi";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import AdminService from "../services/adminService";
import StatCard from "../components/common/StatCard";
import AdminTable from "../components/admin/AdminTable";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
// Đã bỏ ThemeContext, tạm thời không dùng dark mode

const AdminManagePage = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    librarians: 0,
  });

  const { currentUser } = useAuth();

  // Kiểm tra quyền truy cập
  if (currentUser?.adminType !== "admin") {
    Swal.fire({
      icon: "error",
      title: "Không có quyền truy cập",
      text: "Bạn không có quyền truy cập vào trang quản lý nhân sự",
      confirmButtonText: "Quay lại Dashboard",
    });
    return <Navigate to="/admin" replace />;
  }

  const fetchAdmins = async () => {
    try {
      setIsLoading(true);
      const res = await AdminService.getAllAdmins();
      const adminArray = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || res?.admins || [];
      setAdmins(adminArray);
      updateStats(adminArray);
    } catch (error) {
      toast.error("Không thể tải danh sách admin");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStats = (list) => {
    setStats({
      total: list.length,
      admins: list.filter((a) => a.admin_type === "admin").length,
      librarians: list.filter((a) => a.admin_type === "librarian").length,
    });
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchAdmins();
    setIsRefreshing(false);
  };

  const handleUpdateType = async (id, newType) => {
    try {
      await AdminService.updateAdminType(id, newType);
      toast.success("Cập nhật quyền thành công");
      fetchAdmins();
    } catch (error) {
      toast.error("Không thể cập nhật quyền");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 dark:text-white">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Quản lý nhân sự</h1>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 shadow-sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <FiRefreshCw className={`${isRefreshing ? "animate-spin" : ""}`} />
            Làm mới
          </motion.button>
          {/* Đã loại bỏ chức năng thêm nhân sự */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<FiUsers className="w-8 h-8" />}
          title="Tổng nhân sự"
          value={stats.total}
          color="blue"
        />
        <StatCard
          icon={<FiUserCheck className="w-8 h-8" />}
          title="Quản trị viên"
          value={stats.admins}
          color="green"
        />
        <StatCard
          icon={<FiUserCheck className="w-8 h-8" />}
          title="Thủ thư"
          value={stats.librarians}
          color="purple"
        />
      </div>

      {/* Admin Table */}
      <div className="rounded-lg shadow-sm bg-white dark:bg-gray-800">
        <AdminTable
          admins={admins}
          isLoading={isLoading}
          onUpdateType={handleUpdateType}
        />
      </div>

      {/* Đã loại bỏ chức năng thêm nhân sự */}
    </div>
  );
};

export default AdminManagePage;
