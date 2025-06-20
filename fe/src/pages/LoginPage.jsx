import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import authService from "../services/authService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faSignInAlt,
  faUserPlus,
  faEye,
  faEyeSlash,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faVenusMars,
} from "@fortawesome/free-solid-svg-icons";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  // Kiểm tra nếu đang đăng nhập từ trang admin
  const isAdminLogin =
    from.startsWith("/admin") || location.search === "?admin=true";

  const [activeTab, setActiveTab] = useState("login"); // login hoặc register
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
  const [animateBg, setAnimateBg] = useState(false);

  useEffect(() => {
    setAnimateBg(true);
    return () => setAnimateBg(false);
  }, []);

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
            navigate("/", { replace: true });
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
        // Chuyển tab về đăng nhập
        setActiveTab("login");
        // Giữ lại username để người dùng không phải nhập lại
        setPassword("");
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
    <div
      className={`min-h-screen flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900 ${
        animateBg ? "animate-gradient-x" : ""
      }`}
    >
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-[10%] w-72 h-72 bg-lightGreen opacity-30 rounded-full filter blur-[80px] mix-blend-screen"></div>
        <div className="absolute bottom-0 right-[10%] w-96 h-96 bg-green-700 opacity-20 rounded-full filter blur-[90px] mix-blend-screen"></div>
        <div className="absolute top-[40%] right-[25%] w-48 h-48 bg-green-400 opacity-20 rounded-full filter blur-[60px] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[15%] w-24 h-24 bg-lightGreen opacity-40 rounded-full filter blur-[30px] mix-blend-screen"></div>
      </div>

      <div className="w-full max-w-5xl space-y-8 relative z-10">
        {/* Tab navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-black bg-opacity-50 backdrop-blur-lg rounded-t-xl overflow-hidden border border-gray-800 border-opacity-60 shadow-lg">
            <button
              className={`px-8 py-4 text-center font-medium transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-lightGreen text-black shadow-inner"
                  : "text-white hover:bg-gray-800 hover:bg-opacity-40"
              }`}
              onClick={() => setActiveTab("login")}
            >
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Đăng nhập
            </button>
            {/* Chỉ hiển thị tab đăng ký nếu không phải đăng nhập admin */}
            {!isAdminLogin && (
              <button
                className={`px-8 py-4 text-center font-medium transition-all duration-300 ${
                  activeTab === "register"
                    ? "bg-lightGreen text-black shadow-inner"
                    : "text-white hover:bg-gray-800 hover:bg-opacity-40"
                }`}
                onClick={() => setActiveTab("register")}
              >
                <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                Đăng ký
              </button>
            )}
          </div>
        </div>

        {activeTab === "login" ? (
          <div className="bg-black bg-opacity-50 backdrop-blur-lg shadow-2xl rounded-xl px-8 pt-6 pb-8 mb-4 transform transition-all duration-500 hover:scale-[1.01] border border-gray-800 border-opacity-60">
            <div className="max-w-xs h-1 mx-auto bg-gradient-to-r from-transparent via-lightGreen to-transparent rounded mb-8"></div>

            <h2 className="text-2xl font-bold text-center text-lightGreen mb-6 flex items-center justify-center text-shadow-glow">
              {isAdminLogin ? "Đăng Nhập Quản Trị" : "Đăng Nhập Thư Viện"}{" "}
              <FontAwesomeIcon icon={faSignInAlt} className="ml-2" />
            </h2>
            <p className="text-white text-opacity-90 text-center mb-8">
              {isAdminLogin
                ? "Vui lòng nhập thông tin đăng nhập để vào trang quản trị."
                : "Vui lòng nhập thông tin đăng nhập để vào thư viện."}
            </p>

            <form
              onSubmit={handleLoginSubmit}
              className="max-w-2xl mx-auto space-y-6"
            >
              <div className="group">
                <label
                  htmlFor="username"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Tên đăng
                  nhập
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập tên đăng nhập"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                </div>
              </div>

              <div className="group">
                <label
                  htmlFor="password"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faLock} className="mr-2" /> Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập mật khẩu"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-lightGreen transition-colors duration-300"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm pt-2">
                <a
                  href="#"
                  className="text-lightGreen hover:text-green-300 transition-all duration-300 hover:underline"
                >
                  Quên mật khẩu?
                </a>
                {!isAdminLogin && (
                  <button
                    type="button"
                    className="text-lightGreen hover:text-green-300 transition-all duration-300 hover:underline"
                    onClick={() => setActiveTab("register")}
                  >
                    Chưa có tài khoản? Đăng ký ngay
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-lightGreen hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightGreen transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <FontAwesomeIcon
                    icon={faSignInAlt}
                    className="text-green-800 group-hover:text-green-900 transition-colors duration-300"
                  />
                </span>
                {submitting ? "Đang xử lý..." : "Đăng Nhập"}
              </button>
            </form>

            {/* Thêm nút quay về trang chủ khi đăng nhập admin */}
            {isAdminLogin && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => navigate("/")}
                  className="text-lightGreen hover:text-green-300 transition-all duration-300 hover:underline"
                >
                  Quay lại trang chủ thư viện
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-black bg-opacity-50 backdrop-blur-lg shadow-2xl rounded-xl px-8 pt-6 pb-8 mb-4 transform transition-all duration-500 hover:scale-[1.01] border border-gray-800 border-opacity-60">
            <div className="max-w-xs h-1 mx-auto bg-gradient-to-r from-transparent via-lightGreen to-transparent rounded mb-8"></div>

            <h2 className="text-2xl font-bold text-center text-lightGreen mb-6 flex items-center justify-center text-shadow-glow">
              Đăng Ký Tài Khoản{" "}
              <FontAwesomeIcon icon={faUserPlus} className="ml-2" />
            </h2>
            <p className="text-white text-opacity-90 text-center mb-8">
              Vui lòng điền thông tin để tạo tài khoản mới.
            </p>

            <form
              onSubmit={handleRegisterSubmit}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto"
            >
              <div className="md:col-span-1 group">
                <label
                  htmlFor="firstName"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Họ
                </label>
                <div className="relative">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập họ"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 group">
                <label
                  htmlFor="lastName"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Tên
                </label>
                <div className="relative">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập tên"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 group">
                <label
                  htmlFor="gender"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faVenusMars} className="mr-2" /> Giới
                  Tính
                </label>
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                  >
                    <option value="1">Nam</option>
                    <option value="0">Nữ</option>
                  </select>
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faVenusMars} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 group">
                <label
                  htmlFor="username"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faUser} className="mr-2" /> Tên Đăng
                  Nhập
                </label>
                <div className="relative">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập tên đăng nhập"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faUser} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 group">
                <label
                  htmlFor="register-password"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faLock} className="mr-2" /> Mật Khẩu
                </label>
                <div className="relative">
                  <input
                    id="register-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập mật khẩu"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faLock} />
                  </div>
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-lightGreen transition-colors duration-300"
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="md:col-span-1 group">
                <label
                  htmlFor="email"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập email"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 group">
                <label
                  htmlFor="phone"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faPhone} className="mr-2" /> Số Điện
                  Thoại
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập số điện thoại"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faPhone} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-1 group">
                <label
                  htmlFor="address"
                  className="flex items-center text-lightGreen font-semibold mb-2 group-hover:text-green-300 transition-all duration-300"
                >
                  <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2" /> Địa
                  Chỉ
                </label>
                <div className="relative">
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="appearance-none bg-gray-900 bg-opacity-60 border border-gray-700 border-opacity-50 rounded-lg w-full py-3 px-4 pl-10 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-lightGreen focus:border-transparent transition-all duration-300"
                    placeholder="Nhập địa chỉ"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </div>
                </div>
              </div>

              <div className="md:col-span-3 mt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-black bg-lightGreen hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lightGreen transition-all duration-300 transform hover:-translate-y-1 shadow-lg"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <FontAwesomeIcon
                      icon={faUserPlus}
                      className="text-green-800 group-hover:text-green-900 transition-colors duration-300"
                    />
                  </span>
                  {submitting ? "Đang xử lý..." : "Đăng Ký"}
                </button>
              </div>

              <div className="md:col-span-3 text-center mt-4">
                <button
                  type="button"
                  className="text-lightGreen hover:text-green-300 transition-all duration-300 hover:underline"
                  onClick={() => setActiveTab("login")}
                >
                  Đã có tài khoản? Đăng nhập ngay
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
