import { createContext, useContext, useState, useCallback } from "react";
import adminUserService from "../services/adminUserService";
import Swal from "sweetalert2";

const UserAdminContext = createContext();

export const UserAdminProvider = ({ children }) => {
  // Users state
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersPerPage] = useState(10);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [searchCriteria, setSearchCriteria] = useState("username");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    role: "member",
  });

  // Fetch users với pagination và search
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        page: currentPage,
        limit: usersPerPage,
        search: searchTerm,
        status: statusFilter,
      };

      const response = await adminUserService.getAllUsers(
        params.page,
        params.limit
      );

      if (response.success) {
        // Map từ snake_case sang camelCase để tương thích với FE
        const mappedUsers = (response.users || []).map((user) => ({
          id: user.user_id || user.id,
          username: user.username,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          address: user.address,
          gender: user.gender,
          role: user.role,
          isActive: user.is_active,
          createdAt: user.created_at || user.createdAt,
          updatedAt: user.updated_at || user.updatedAt,
        }));

        setUsers(mappedUsers);
        setTotalPages(response.totalPages || response.total_pages || 1);
        setTotalUsers(response.totalUsers || response.total_users || 0);
      } else {
        throw new Error(
          response.message || "Không thể tải danh sách người dùng"
        );
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      let errorMessage = "Lỗi khi tải danh sách người dùng";

      if (error.response?.status === 500) {
        errorMessage =
          "Lỗi server (500). Vui lòng kiểm tra và khởi động lại backend server.";
      } else if (error.response?.status === 404) {
        errorMessage = "API endpoint không tìm thấy (404)";
      } else if (error.response?.status === 401) {
        errorMessage = "Không có quyền truy cập (401). Vui lòng đăng nhập lại.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, usersPerPage, searchTerm, statusFilter]);

  // Create user
  const createUser = async (userData) => {
    try {
      setLoading(true);
      const response = await adminUserService.createUser(userData);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Tạo người dùng thành công!",
          timer: 1500,
          showConfirmButton: false,
        });

        setShowCreateModal(false);
        resetForm();
        await fetchUsers();
        return true;
      } else {
        throw new Error(response.message || "Tạo người dùng thất bại");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể tạo người dùng",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update user
  const updateUser = async (userId, userData) => {
    try {
      setLoading(true);
      const response = await adminUserService.updateUser(userId, userData);

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Cập nhật người dùng thành công!",
          timer: 1500,
          showConfirmButton: false,
        });

        setShowEditModal(false);
        setSelectedUser(null);
        resetForm();
        await fetchUsers();
        return true;
      } else {
        throw new Error(response.message || "Cập nhật người dùng thất bại");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể cập nhật người dùng",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const deleteUser = async (userId, userName) => {
    try {
      const result = await Swal.fire({
        title: "Xác nhận xóa",
        text: `Bạn có chắc chắn muốn xóa người dùng "${userName}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc2626",
        cancelButtonColor: "#6b7280",
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        setLoading(true);
        const response = await adminUserService.deleteUser(userId);

        if (response.success) {
          await Swal.fire({
            icon: "success",
            title: "Đã xóa!",
            text: "Người dùng đã được xóa thành công.",
            timer: 1500,
            showConfirmButton: false,
          });

          await fetchUsers();
          return true;
        } else {
          throw new Error(response.message || "Xóa người dùng thất bại");
        }
      }
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể xóa người dùng",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Toggle user active status
  const toggleUserStatus = async (userId, currentStatus, userName) => {
    try {
      const action = currentStatus ? "vô hiệu hóa" : "kích hoạt";
      const result = await Swal.fire({
        title: `Xác nhận ${action}`,
        text: `Bạn có chắc chắn muốn ${action} người dùng "${userName}"?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: currentStatus ? "#dc2626" : "#059669",
        cancelButtonColor: "#6b7280",
        confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        setLoading(true);
        const response = await adminUserService.toggleUserActive(userId);

        if (response.success) {
          await Swal.fire({
            icon: "success",
            title: "Thành công",
            text: `Đã ${action} người dùng thành công!`,
            timer: 1500,
            showConfirmButton: false,
          });

          await fetchUsers();
          return true;
        } else {
          throw new Error(response.message || `${action} người dùng thất bại`);
        }
      }
      return false;
    } catch (error) {
      console.error("Error toggling user status:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể cập nhật trạng thái người dùng",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Sync users
  const syncUsers = async () => {
    try {
      setLoading(true);
      const response = await adminUserService.syncUsers();

      if (response.success) {
        await Swal.fire({
          icon: "success",
          title: "Thành công",
          text: "Đồng bộ dữ liệu người dùng thành công!",
          timer: 1500,
          showConfirmButton: false,
        });

        await fetchUsers();
        return true;
      } else {
        throw new Error(response.message || "Đồng bộ dữ liệu thất bại");
      }
    } catch (error) {
      console.error("Error syncing users:", error);
      await Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể đồng bộ dữ liệu người dùng",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Form helpers
  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      gender: "",
      role: "member",
    });
  };

  const openCreateModal = () => {
    resetForm();
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username || "",
      password: "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      gender: user.gender?.toString() || "",
      role: user.role || "member",
    });
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedUser(null);
    resetForm();
  };

  // Search helpers
  const handleSearch = (term, criteria = "username") => {
    setSearchTerm(term);
    setSearchCriteria(criteria);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchCriteria("username");
    setCurrentPage(1);
  };

  // Pagination helpers
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(Math.max(1, currentPage - 1));
  const goToNextPage = () =>
    setCurrentPage(Math.min(totalPages, currentPage + 1));

  const value = {
    // State
    users,
    loading,
    error,
    currentPage,
    totalPages,
    totalUsers,
    usersPerPage,
    searchTerm,
    searchCriteria,
    statusFilter,
    showCreateModal,
    showEditModal,
    selectedUser,
    formData,

    // Actions
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    syncUsers,

    // Form actions
    setFormData,
    resetForm,
    openCreateModal,
    openEditModal,
    closeModals,

    // Search actions
    handleSearch,
    clearSearch,
    setStatusFilter,

    // Pagination actions
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    setCurrentPage,
  };

  return (
    <UserAdminContext.Provider value={value}>
      {children}
    </UserAdminContext.Provider>
  );
};

export const useUserAdmin = () => {
  const context = useContext(UserAdminContext);
  if (!context) {
    throw new Error("useUserAdmin phải được sử dụng trong UserAdminProvider");
  }
  return context;
};

export default UserAdminProvider;
