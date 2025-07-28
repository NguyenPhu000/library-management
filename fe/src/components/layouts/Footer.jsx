import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faEnvelope,
  faFileContract,
  faBookOpen,
  faPhone,
  faMapMarkerAlt,
  faHeart,
  faArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#3E5F44]/10 to-[#5E936C]/10 filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#93DA97]/10 to-[#E8FFD7]/10 filter blur-3xl"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo & Description */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#5E936C] to-[#93DA97] rounded-xl flex items-center justify-center shadow-lg">
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className="text-white text-xl"
                  />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-[#E8FFD7] via-[#93DA97] to-[#5E936C] bg-clip-text text-transparent">
                  Góc Thư Viện
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Khám phá kho tàng tri thức vô hạn với hàng nghìn cuốn sách chất
                lượng cao. Đọc sách mọi lúc, mọi nơi - hoàn toàn miễn phí.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#93DA97]">10K+</div>
                  <div className="text-sm text-gray-400">Cuốn sách</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#93DA97]">5K+</div>
                  <div className="text-sm text-gray-400">Thành viên</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#93DA97]">24/7</div>
                  <div className="text-sm text-gray-400">Truy cập</div>
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h4 className="text-lg font-semibold mb-4 text-[#E8FFD7]">
                  Kết nối với chúng tôi
                </h4>
                <div className="flex space-x-4">
                  {[
                    {
                      icon: faFacebook,
                      color: "hover:text-blue-400",
                      bg: "hover:bg-blue-400/10",
                    },
                    {
                      icon: faTwitter,
                      color: "hover:text-sky-400",
                      bg: "hover:bg-sky-400/10",
                    },
                    {
                      icon: faInstagram,
                      color: "hover:text-pink-400",
                      bg: "hover:bg-pink-400/10",
                    },
                    {
                      icon: faLinkedin,
                      color: "hover:text-blue-600",
                      bg: "hover:bg-blue-600/10",
                    },
                    {
                      icon: faYoutube,
                      color: "hover:text-red-500",
                      bg: "hover:bg-red-500/10",
                    },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href="#"
                      className={`w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center text-gray-400 ${social.color} ${social.bg} border-opacity-0 hover:border-opacity-100 transition-all duration-300 hover:scale-110`}
                    >
                      <FontAwesomeIcon icon={social.icon} className="text-lg" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#E8FFD7]">
                Liên kết nhanh
              </h4>
              <nav className="space-y-4">
                {[
                  { to: "/home", icon: faHome, text: "Trang Chủ" },
                  { to: "/books", icon: faBook, text: "Danh Sách Sách" },
                  { to: "/contact", icon: faEnvelope, text: "Liên Hệ" },
                  { to: "#", icon: faFileContract, text: "Điều Khoản" },
                ].map((link, index) => (
                  <Link
                    key={index}
                    to={link.to}
                    className="flex items-center space-x-3 text-gray-300 hover:text-[#93DA97] transition-colors duration-300 group"
                  >
                    <FontAwesomeIcon
                      icon={link.icon}
                      className="text-gray-500 group-hover:text-[#93DA97] transition-colors duration-300"
                    />
                    <span>{link.text}</span>
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-semibold mb-6 text-[#E8FFD7]">
                Liên hệ
              </h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 text-gray-300">
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="text-[#93DA97] mt-1 flex-shrink-0"
                  />
                  <div>
                    <div className="font-medium">Địa chỉ</div>
                    <div className="text-sm text-gray-400">
                      68 Đường Trần Chiên, Phường Lê Bình Quận Cái Răng, Thành
                      phố Cần Thơ
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="text-[#93DA97] mt-1 flex-shrink-0"
                  />
                  <div>
                    <div className="font-medium">Điện thoại</div>
                    <div className="text-sm text-gray-400">0123 456 789</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3 text-gray-300">
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="text-[#93DA97] mt-1 flex-shrink-0"
                  />
                  <div>
                    <div className="font-medium">Email</div>
                    <div className="text-sm text-gray-400">
                      info@gocthuvien.com
                    </div>
                  </div>
                </div>
              </div>

              {/* Newsletter */}
              <div className="mt-8">
                <h5 className="font-semibold mb-3 text-[#E8FFD7]">
                  Đăng ký nhận tin
                </h5>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email của bạn"
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#93DA97] transition-colors duration-300"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white rounded-r-lg transition-all duration-300 hover:scale-105">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700/50 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-gray-400">
              <span>© {new Date().getFullYear()}</span>
              <span className="text-[#93DA97] font-semibold">Góc Thư Viện</span>
              <span>- Đã đăng ký bản quyền</span>
            </div>

            <div className="flex items-center space-x-2 text-gray-400">
              <span>Made with</span>
              <FontAwesomeIcon
                icon={faHeart}
                className="text-red-400 animate-pulse"
              />
              <span>in Vietnam</span>
            </div>

            {/* Scroll to top button */}
            <button
              onClick={scrollToTop}
              className="w-10 h-10 bg-gradient-to-br from-[#5E936C] to-[#93DA97] rounded-full flex items-center justify-center text-white hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-[#5E936C]/30"
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
