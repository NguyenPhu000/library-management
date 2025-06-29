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
    <footer className="bg-library-surface border-t border-library-border text-library-text-secondary py-12 px-8 mt-16">
      <div className="max-w-5xl mx-auto">
        {/* Library Brand */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="text-2xl font-heading font-bold text-library-text-primary hover:text-library-primary transition-colors duration-200"
          >
            <span className="text-library-primary">Góc</span>{" "}
            <span>Thư Viện</span>
          </Link>
          <p className="text-library-text-muted text-sm mt-2">
            Khám phá tri thức, kết nối cộng đồng
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 text-center md:text-left">
          <Link
            to="/"
            className="text-library-text-secondary hover:text-library-primary transition-colors duration-200 flex items-center justify-center md:justify-start space-x-2 py-2"
          >
            <FontAwesomeIcon icon={faHome} className="text-base" />
            <span className="font-medium">Trang Chủ</span>
          </Link>
          <Link
            to="/books"
            className="text-library-text-secondary hover:text-library-primary transition-colors duration-200 flex items-center justify-center md:justify-start space-x-2 py-2"
          >
            <FontAwesomeIcon icon={faBook} className="text-base" />
            <span className="font-medium">Danh Sách</span>
          </Link>
          <Link
            to="/contact"
            className="text-library-text-secondary hover:text-library-primary transition-colors duration-200 flex items-center justify-center md:justify-start space-x-2 py-2"
          >
            <FontAwesomeIcon icon={faEnvelope} className="text-base" />
            <span className="font-medium">Liên Hệ</span>
          </Link>
          <Link
            to="#"
            className="text-library-text-secondary hover:text-library-primary transition-colors duration-200 flex items-center justify-center md:justify-start space-x-2 py-2"
          >
            <FontAwesomeIcon icon={faFileContract} className="text-base" />
            <span className="font-medium">Điều khoản</span>
          </Link>
        </nav>

        {/* Social Media Links */}
        <div className="flex justify-center space-x-6 mb-8">
          <a
            href="#"
            className="text-library-text-muted hover:text-library-primary transition-colors duration-200 p-2 rounded-library hover:bg-library-hover"
            aria-label="Facebook"
          >
            <FontAwesomeIcon icon={faFacebook} className="text-xl" />
          </a>
          <a
            href="#"
            className="text-library-text-muted hover:text-library-primary transition-colors duration-200 p-2 rounded-library hover:bg-library-hover"
            aria-label="Twitter"
          >
            <FontAwesomeIcon icon={faTwitter} className="text-xl" />
          </a>
          <a
            href="#"
            className="text-library-text-muted hover:text-library-primary transition-colors duration-200 p-2 rounded-library hover:bg-library-hover"
            aria-label="Instagram"
          >
            <FontAwesomeIcon icon={faInstagram} className="text-xl" />
          </a>
        </div>

        <hr className="border-library-border mb-6" />

        {/* Copyright & Additional Info */}
        <div className="text-center">
          <p className="text-library-text-muted text-sm">
            © {new Date().getFullYear()}{" "}
            <span className="text-library-primary font-medium">
              Góc Thư Viện
            </span>
            . Tất cả quyền được bảo lưu.
          </p>
          <p className="text-library-text-muted text-xs mt-2">
            Được xây dựng với ❤️ để phục vụ cộng đồng đọc sách
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
