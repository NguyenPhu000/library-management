import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import authService from "../services/authService";
import "../styles/animations.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faUserPlus,
  faEye,
  faEyeSlash,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faVenusMars,
  faHome,
} from "@fortawesome/free-solid-svg-icons";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("1");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [receiveEmails, setReceiveEmails] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra dữ liệu
    if (
      !username ||
      !password ||
      !email ||
      !firstName ||
      !lastName ||
      !phone ||
      !address
    ) {
      Swal.fire({
        icon: "warning",
        title: "Thiếu thông tin",
        text: "Vui lòng điền đầy đủ thông tin đăng ký",
      });
      return;
    }

    if (!agreeTerms) {
      Swal.fire({
        icon: "warning",
        title: "Chưa đồng ý điều khoản",
        text: "Vui lòng đồng ý với điều khoản sử dụng và chính sách bảo mật",
      });
      return;
    }

    try {
      setSubmitting(true);
      const result = await authService.register({
        username,
        password,
        email,
        first_name: firstName,
        last_name: lastName,
        phone,
        address,
        gender,
      });

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Đăng ký thành công",
          text: "Vui lòng đăng nhập với tài khoản mới",
        });
        // Chuyển về trang đăng nhập
        navigate("/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Đăng ký thất bại",
          text: result.message,
        });
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "Lỗi", text: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900">
        <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#93DA97] to-[#E8FFD7] bg-clip-text text-transparent mb-2">
              Chào mừng đến <br />
              Góc Thư Viện
            </h2>
            <p className="text-gray-300">
              Đã có tài khoản?
              <Link
                to="/login"
                className="text-[#93DA97] hover:text-[#E8FFD7] ml-1 font-medium transition-colors"
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Register Form */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5E936C] focus:border-transparent text-white text-sm bg-gray-700 placeholder-gray-400"
                placeholder="example@email.com"
              />
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5E936C] focus:border-transparent text-white text-sm bg-gray-700 placeholder-gray-400"
                placeholder="username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5E936C] focus:border-transparent text-white text-sm bg-gray-700 placeholder-gray-400"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="text-xs"
                  />
                </button>
              </div>
            </div>

            {/* Full Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5E936C] focus:border-transparent text-white text-sm bg-gray-700 placeholder-gray-400"
                  placeholder="Nguyễn"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5E936C] focus:border-transparent text-white text-sm bg-gray-700 placeholder-gray-400"
                  placeholder="Văn A"
                />
              </div>
            </div>

            {/* Phone & Gender Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5E936C] focus:border-transparent text-white text-sm bg-gray-700 placeholder-gray-400"
                  placeholder="0123456789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">
                  Giới tính
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5E936C] focus:border-transparent text-white text-sm bg-gray-700 placeholder-gray-400"
                >
                  <option value="1">Nam</option>
                  <option value="0">Nữ</option>
                </select>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5E936C] focus:border-transparent text-white text-sm bg-gray-700 placeholder-gray-400"
                placeholder="123 Đường ABC, Quận XYZ, TP. HCM"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start">
                <input
                  id="agree-terms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-[#5E936C] focus:ring-[#93DA97] border-gray-600 rounded mt-0.5 bg-gray-700"
                />
                <label
                  htmlFor="agree-terms"
                  className="ml-2 text-xs text-gray-300 leading-relaxed"
                >
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-[#93DA97] hover:text-[#E8FFD7]">
                    Điều khoản sử dụng
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-[#93DA97] hover:text-[#E8FFD7]">
                    Chính sách bảo mật
                  </a>
                </label>
              </div>

              <div className="flex items-start">
                <input
                  id="receive-emails"
                  type="checkbox"
                  checked={receiveEmails}
                  onChange={(e) => setReceiveEmails(e.target.checked)}
                  className="h-4 w-4 text-[#5E936C] focus:ring-[#93DA97] border-gray-600 rounded mt-0.5 bg-gray-700"
                />
                <label
                  htmlFor="receive-emails"
                  className="ml-2 text-xs text-gray-300 leading-relaxed"
                >
                  Tôi muốn nhận email về cập nhật sản phẩm, sự kiện và chương
                  trình khuyến mãi marketing.
                </label>
              </div>
            </div>

            {/* Terms text */}
            <div className="text-xs text-gray-400 leading-relaxed">
              Bằng cách tạo tài khoản, bạn đồng ý với{" "}
              <a href="#" className="text-[#93DA97] hover:text-[#E8FFD7]">
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a href="#" className="text-[#93DA97] hover:text-[#E8FFD7]">
                Chính sách bảo mật
              </a>
              .
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-[#3E5F44] to-[#5E936C] text-white py-2.5 px-4 rounded-md font-medium hover:from-[#5E936C] hover:to-[#93DA97] focus:outline-none focus:ring-2 focus:ring-[#5E936C] focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-lg"
            >
              {submitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang tạo tài khoản...
                </div>
              ) : (
                "Tạo tài khoản"
              )}
            </button>

            {/* Login link */}
            <div className="text-center mt-4">
              <span className="text-gray-300 text-sm">Đã có tài khoản? </span>
              <Link
                to="/login"
                className="text-[#93DA97] hover:text-[#E8FFD7] font-medium text-sm transition-colors"
              >
                Đăng nhập
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Right side - Background with 3D Design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/uploads/coverBook.jpg')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center w-full h-full">
          {/* 3D Abstract shapes */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Main cube */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-[#5E936C] to-[#3E5F44] transform rotate-12 rounded-lg shadow-2xl float-animation rotate-3d-1"></div>
            </div>

            {/* Secondary shapes */}
            <div className="absolute top-20 right-20">
              <div className="w-16 h-16 bg-gradient-to-br from-[#93DA97] to-[#5E936C] rounded-full shadow-lg float-animation-reverse"></div>
            </div>

            <div className="absolute bottom-32 right-32">
              <div className="w-20 h-20 bg-gradient-to-br from-[#E8FFD7] to-[#93DA97] rounded-full shadow-lg float-animation-slow"></div>
            </div>

            <div className="absolute top-32 left-20">
              <div className="w-12 h-12 bg-gradient-to-br from-[#93DA97] to-[#5E936C] transform rotate-45 shadow-lg float-animation-fast"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
