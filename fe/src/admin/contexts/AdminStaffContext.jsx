import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import adminStaffService from "../services/adminStaffService";
import Swal from "sweetalert2";

const AdminStaffContext = createContext();

export const AdminStaffProvider = ({ children }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [adminsPerPage] = useState(10);

  const fetchAdmins = useCallback(
    async (page = currentPage) => {
      try {
        setLoading(true);
        setError(null);

        const response = await adminStaffService.getAllAdmins(
          page,
          adminsPerPage
        );

        if (response.success) {
          const mapped = (response.data || []).map((item) => ({
            id: item.admin_id || item.id,
            userId: item.user_id,
            username: item.User?.username,
            email: item.User?.email,
            fullName: `${item.User?.last_name || ""} ${
              item.User?.first_name || ""
            }`.trim(),
            adminType: item.admin_type,
            department: item.department,
            createdAt: item.created_at,
          }));

          setAdmins(mapped);
          setTotalPages(response.totalPages || 1);
          setTotalAdmins(response.totalItems || 0);
          setCurrentPage(response.currentPage || page);
        } else {
          throw new Error(response.message || "Không thể tải danh sách admin");
        }
      } catch (err) {
        console.error("Fetch admins error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [currentPage, adminsPerPage]
  );

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  const syncAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminStaffService.syncAdmins();
      if (res.success) {
        await Swal.fire("Thành công", "Đã đồng bộ admin", "success");
        fetchAdmins();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      await Swal.fire("Lỗi", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateAdmin = async (adminId, data = {}) => {
    try {
      setLoading(true);
      const res = await adminStaffService.updateAdmin(adminId, data);
      if (res.success) {
        await Swal.fire("Thành công", "Cập nhật thành công", "success");
        fetchAdmins();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      await Swal.fire("Lỗi", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteAdmin = async (adminId, username) => {
    try {
      const confirm = await Swal.fire({
        title: "Xác nhận xóa",
        text: `Xóa admin ${username}?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });
      if (!confirm.isConfirmed) return;

      setLoading(true);
      const res = await adminStaffService.deleteAdmin(adminId);
      if (res.success) {
        await Swal.fire("Đã xóa", "Xóa thành công", "success");
        fetchAdmins();
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      await Swal.fire("Lỗi", err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminStaffContext.Provider
      value={{
        admins,
        loading,
        error,
        currentPage,
        totalPages,
        totalAdmins,
        adminsPerPage,
        fetchAdmins,
        syncAdmins,
        updateAdmin,
        deleteAdmin,
      }}
    >
      {children}
    </AdminStaffContext.Provider>
  );
};

export const useAdminStaff = () => {
  const ctx = useContext(AdminStaffContext);
  if (!ctx) throw new Error("useAdminStaff must be used within provider");
  return ctx;
};
