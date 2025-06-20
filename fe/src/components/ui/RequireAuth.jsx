import { useLocation, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useEffect } from "react";
import Swal from "sweetalert2";

const RequireAuth = () => {
  const { currentUser, loading, error, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const loginUrl = "/login";

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
        navigate(loginUrl, { replace: true, state: { from: location } });
        return;
      }

      if (!currentUser) {
        const result = await Swal.fire({
          icon: "question",
          title: "Bạn chưa đăng nhập",
          text: "Bạn cần đăng nhập để sử dụng tính năng này. Bạn có muốn đăng nhập hoặc đăng ký tài khoản không?",
          showCancelButton: true,
          confirmButtonText: "Đăng nhập / Đăng ký",
          cancelButtonText: "Không, quay lại",
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
        });

        if (result.isConfirmed) {
          navigate(loginUrl, { replace: true, state: { from: location } });
        } else {
          navigate(-1); // Quay lại trang trước đó
        }
        return;
      }
    };

    handleRedirect();
  }, [loading, error, currentUser, logout, loginUrl, location, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  // Chỉ hiển thị nội dung khi đã xác thực thành công
  if (!currentUser) {
    return null;
  }

  return <Outlet />;
};

export default RequireAuth;
