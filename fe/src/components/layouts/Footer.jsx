import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBook,
  faEnvelope,
  faFileContract,
} from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-16 px-8">
      <div className="max-w-5xl mx-auto">
        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-12">
          <a href="#" className="hover:text-lightGreen transition-colors">
            <FontAwesomeIcon icon={faFacebook} className="text-2xl" />
          </a>
          <a href="#" className="hover:text-lightGreen transition-colors">
            <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
          </a>
          <a href="#" className="hover:text-lightGreen transition-colors">
            <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
          </a>
        </div>

        {/* Links */}
        <nav className="grid grid-cols-1 md:grid-cols-2 lg:flex justify-center gap-8 lg:space-x-16 mb-10 text-lg">
          <Link
            to="/"
            className="hover:text-lightGreen transition-colors flex items-center space-x-3"
          >
            <FontAwesomeIcon icon={faHome} className="text-xl" />
            <span>Trang Chủ</span>
          </Link>
          <Link
            to="/books"
            className="hover:text-lightGreen transition-colors flex items-center space-x-3"
          >
            <FontAwesomeIcon icon={faBook} className="text-xl" />
            <span>Danh Sách</span>
          </Link>
          <Link
            to="/contact"
            className="hover:text-lightGreen transition-colors flex items-center space-x-3"
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
            <span>Liên Hệ</span>
          </Link>
          <Link
            to="#"
            className="hover:text-lightGreen transition-colors flex items-center space-x-3"
          >
            <FontAwesomeIcon icon={faFileContract} className="text-xl" />
            <span>Điều khoản</span>
          </Link>
        </nav>

        <hr className="border-gray-700 mb-6" />

        {/* Copyright */}
        <div className="flex justify-center md:justify-start text-sm">
          <p className="text-gray-500">
            © {new Date().getFullYear()}
            <span className="text-lightGreen"> Góc Thư Viện</span>. Đã đăng ký
            bản quyền.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
