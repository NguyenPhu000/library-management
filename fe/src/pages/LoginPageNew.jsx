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
    <div className="min-h-screen flex bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500">
      {/* Left side - Image and branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600"><defs><linearGradient id="sunset" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23ff7e5f;stop-opacity:1" /><stop offset="50%" style="stop-color:%23feb47b;stop-opacity:1" /><stop offset="100%" style="stop-color:%23ff6b6b;stop-opacity:1" /></linearGradient></defs><rect width="800" height="600" fill="url(%23sunset)"/><polygon points="0,400 100,380 200,390 300,370 400,385 500,375 600,380 700,370 800,375 800,600 0,600" fill="%23333" opacity="0.3"/><polygon points="50,450 150,440 250,445 350,435 450,440 550,430 650,435 750,425 800,430 800,600 0,600" fill="%23555" opacity="0.4"/></svg>')`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-red-600/20"></div>
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Header with Sign In button */}
          <div className="flex justify-between items-center mb-8">
            <div className="lg:hidden flex items-center">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faHome} className="text-white text-sm" />
              </div>
              <span className="text-lg font-semibold text-gray-800">
                Thư Viện
              </span>
            </div>
            <div className="hidden lg:block">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faHome} className="text-white text-sm" />
              </div>
            </div>
            <button className="bg-gray-800 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-700 transition-colors">
              Sign In
            </button>
          </div>

          {/* Welcome text */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-gray-800 mb-3">
              Chào Mừng Trở Lại Thư Viện!
            </h2>
            <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {isAdminLogin ? "Tài khoản quản trị" : "Email của bạn"}
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                placeholder={
                  isAdminLogin ? "admin123" : "info.madhu78@gmail.com"
                }
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-800 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
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
                  className="h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Ghi nhớ tôi
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-orange-500 hover:text-orange-600 transition-colors"
              >
                Quên mật khẩu?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gray-800 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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

            {/* Or login with social */}
            <div className="text-center">
              <span className="text-gray-500 text-sm">hoặc Đăng nhập với</span>
            </div>

            {/* Social Login Buttons - tạm thời disable */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                disabled
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Tiếp tục với Google
              </button>
              <button
                type="button"
                disabled
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Tiếp tục với Facebook
              </button>
            </div>

            {/* Sign up link for non-admin login */}
            {!isAdminLogin && (
              <div className="text-center mt-6">
                <span className="text-gray-600">Chưa có tài khoản? </span>
                <Link
                  to="/register"
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
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
                  className="text-orange-500 hover:text-orange-600 font-medium transition-colors"
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
