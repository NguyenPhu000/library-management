import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBookOpen,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-library-background px-4">
      <div className="text-center max-w-2xl mx-auto">
        {/* Large 404 Text */}
        <div className="mb-8">
          <h1 className="text-8xl md:text-9xl font-heading font-bold text-library-primary/20 mb-4">
            404
          </h1>
          <div className="relative">
            <FontAwesomeIcon
              icon={faBookOpen}
              className="text-6xl text-library-primary/40 absolute -top-8 left-1/2 transform -translate-x-1/2"
            />
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-library-text-primary mb-4">
            Trang không tìm thấy
          </h2>
          <p className="text-lg text-library-text-secondary mb-6 leading-relaxed">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di
            chuyển. Có thể liên kết đã bị hỏng hoặc bạn đã nhập sai địa chỉ.
          </p>
          <p className="text-library-text-muted">
            Hãy thử tìm kiếm sách hoặc quay lại trang chủ để khám phá thư viện
            của chúng tôi.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Link
            to="/"
            className="btn-library-primary flex items-center px-6 py-3"
          >
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Về trang chủ
          </Link>

          <Link
            to="/books"
            className="btn-library-secondary flex items-center px-6 py-3"
          >
            <FontAwesomeIcon icon={faSearch} className="mr-2" />
            Tìm sách
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-library-border pt-8">
          <p className="text-library-text-muted text-sm mb-4">
            Hoặc bạn có thể khám phá:
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="/books"
              className="text-library-primary hover:text-library-primary/80 transition-colors"
            >
              Danh sách sách
            </Link>
            <Link
              to="/contact"
              className="text-library-primary hover:text-library-primary/80 transition-colors"
            >
              Liên hệ
            </Link>
            <Link
              to="/loan"
              className="text-library-primary hover:text-library-primary/80 transition-colors"
            >
              Quản lý mượn sách
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
