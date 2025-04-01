import { useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import Swal from "sweetalert2";

const RequireAuth = () => {
  const { user, loading, error, logout } = useAuth();
  const location = useLocation();
  const loginUrl = "http://localhost:8081/api/login";

  useEffect(() => {
    const handleRedirect = async () => {
      if (loading) return;

      if (error) {
        logout();
        await Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Vui lòng đăng nhập!",
        });
        window.location.href = loginUrl;
        return;
      }

      if (!user) {
        await Swal.fire({
          icon: "warning",
          title: "Cảnh báo",
          text: "Bạn cần đăng nhập để truy cập trang này!",
        });
        window.location.href = loginUrl;
        return;
      }
    };

    handleRedirect();
  }, [loading, error, user, logout, loginUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return <Outlet />;
};

export default RequireAuth;
