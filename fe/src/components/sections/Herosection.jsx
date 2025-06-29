import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faBookOpen } from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/books");
  };

  return (
    <section className="relative bg-library-gradient text-library-text-primary py-16 md:py-20 lg:py-24 px-4">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-library-primary rounded-full"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 border border-library-primary rounded-full"></div>
        <div className="absolute top-1/3 right-20 w-16 h-16 border border-library-primary rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Content */}
          <div className="max-w-2xl text-center lg:text-left lg:mr-12 mb-12 lg:mb-0">
            <div className="inline-flex items-center bg-library-primary/10 text-library-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
              Thư viện số hiện đại
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold leading-tight text-library-text-primary mb-6">
              Khám phá kho tàng{" "}
              <span className="text-library-primary">tri thức</span> vô hạn
            </h1>

            <p className="text-lg md:text-xl text-library-text-secondary leading-relaxed mb-8 max-w-xl">
              Đắm mình vào thế giới của hàng ngàn cuốn sách chọn lọc. Mở rộng
              kiến thức và tầm nhìn của bạn mọi lúc, mọi nơi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleExploreClick}
                className="btn-library-primary text-lg px-8 py-4 flex items-center justify-center space-x-3 group"
              >
                <span>Bắt đầu khám phá</span>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={() => navigate("/contact")}
                className="btn-library-secondary text-lg px-8 py-4 flex items-center justify-center"
              >
                Tìm hiểu thêm
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-library-border">
              <div className="text-center">
                <div className="text-2xl font-bold text-library-primary">
                  1000+
                </div>
                <div className="text-sm text-library-text-muted">Cuốn sách</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-library-primary">
                  50+
                </div>
                <div className="text-sm text-library-text-muted">Danh mục</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-library-primary">
                  24/7
                </div>
                <div className="text-sm text-library-text-muted">Mở cửa</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="w-full max-w-lg relative">
            <div className="card-library-book overflow-hidden">
              <img
                src="/public/uploads/coverBook.jpg"
                alt="Thư viện hiện đại"
                className="w-full h-auto object-cover transition-transform duration-700 ease-out hover:scale-105"
                onError={(e) => {
                  e.target.src = "/public/uploads/coverBook.jpg";
                }}
              />
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-library-success text-white px-4 py-2 rounded-library text-sm font-medium shadow-library-card">
              Miễn phí
            </div>
            <div className="absolute -bottom-4 -left-4 bg-library-surface border border-library-border px-4 py-2 rounded-library text-sm font-medium shadow-library-card">
              ⭐ 4.9/5 đánh giá
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
