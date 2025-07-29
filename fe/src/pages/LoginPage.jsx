import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faSignInAlt,
  faEye,
  faEyeSlash,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Kiểm tra nếu đang đăng nhập từ trang admin
  const isAdminLogin =
    from.startsWith("/admin") || location.search === "?admin=true";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Nhập tài khoản và mật khẩu",
      });
      return;
    }
    try {
      setSubmitting(true);
      const result = await login(username, password);
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Đăng nhập thành công",
          showConfirmButton: false,
          timer: 1500,
        });

        // Kiểm tra nếu đăng nhập từ trang admin
        if (isAdminLogin) {
          // Kiểm tra quyền admin
          if (result.user && result.user.role === "admin") {
            // Nếu là admin, chuyển đến trang admin
            navigate("/admin", { replace: true });
          } else {
            // Nếu không phải admin, hiển thị thông báo lỗi
            Swal.fire({
              icon: "error",
              title: "Không có quyền truy cập",
              text: "Bạn không có quyền truy cập vào trang quản trị",
            });
            // Chuyển về trang chủ
            navigate("/home", { replace: true });
          }
        } else {
          // Đăng nhập thông thường
          if (result.redirectUrl) {
            navigate(result.redirectUrl, { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        }
      } else {
        Swal.fire({
          icon: "error",
          title: "Đăng nhập thất bại",
          text: result.message || "Sai tên đăng nhập hoặc mật khẩu",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: err.message || "Đã xảy ra lỗi khi đăng nhập",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Left side - Image and branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/uploads/coverBook.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/50 dark:bg-black/60"></div>
        </div>

        {/* Overlay content */}
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="mb-8">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mr-4 border border-white/30">
                <FontAwesomeIcon icon={faHome} className="text-white text-xl" />
              </div>
              <h1 className="text-3xl font-bold">Thư Viện</h1>
            </div>

            <h2 className="text-5xl font-bold mb-6 leading-tight">
              Tìm Kho Tàng
              <br />
              Tri Thức Của Bạn
            </h2>
            <p className="text-lg text-white/90 leading-relaxed max-w-md">
              Khám phá hàng nghìn cuốn sách tuyệt vời — nhanh chóng, dễ dàng,
              đáng tin cậy.
            </p>
          </div>

          {/* Progress indicators */}
          <div className="flex space-x-2">
            <div className="w-8 h-1 bg-white rounded-full"></div>
            <div className="w-4 h-1 bg-white/60 rounded-full"></div>
            <div className="w-4 h-1 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-2xl transition-colors duration-300">
          {/* Header with Sign In button */}
          <div className="flex justify-between items-center mb-8">
            <div className="lg:hidden flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5E936C] to-[#3E5F44] rounded-lg flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faHome} className="text-white text-sm" />
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                Thư Viện
              </span>
            </div>
            <div className="hidden lg:block">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5E936C] to-[#3E5F44] rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faHome} className="text-white text-sm" />
              </div>
            </div>
            <button className="bg-gradient-to-r from-[#5E936C] to-[#93DA97] text-white px-6 py-2 rounded-full text-sm font-medium hover:from-[#3E5F44] hover:to-[#5E936C] transition-all duration-300 shadow-lg">
              Sign In
            </button>
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#93DA97] to-[#E8FFD7] bg-clip-text text-transparent mb-3">
              Chào Mừng Trở Lại Thư Viện!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
              Đăng nhập vào tài khoản của bạn
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">
                {isAdminLogin ? "Tài khoản quản trị" : "Tên tài khoản của bạn"}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E936C] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                placeholder={isAdminLogin ? "admin123" : "member123"}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 transition-colors duration-300">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5E936C] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-300"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#5E936C] focus:ring-[#93DA97] border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 transition-colors duration-300"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-200 transition-colors duration-300"
                >
                  Ghi nhớ tôi
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-[#93DA97] hover:text-[#E8FFD7] transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#3E5F44] to-[#5E936C] text-white py-3 px-4 rounded-lg font-medium hover:from-[#5E936C] hover:to-[#93DA97] focus:outline-none focus:ring-2 focus:ring-[#5E936C] focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang đăng nhập...
                </div>
              ) : (
                "Đăng nhập"
              )}
            </button>

            {/* Sign up link for non-admin login */}
            {!isAdminLogin && (
              <div className="text-center mt-6">
                <span className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  Chưa có tài khoản?{" "}
                </span>
                <Link
                  to="/register"
                  className="text-[#93DA97] hover:text-[#E8FFD7] font-medium transition-colors duration-300"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Back to home for admin login */}
            {isAdminLogin && (
              <div className="text-center mt-6">
                <Link
                  to="/"
                  className="text-[#93DA97] hover:text-[#E8FFD7] font-medium transition-colors"
                >
                  ← Quay lại trang chủ
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
