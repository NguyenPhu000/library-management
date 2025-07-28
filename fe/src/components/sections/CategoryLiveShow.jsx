import React from "react";
import Slider from "react-slick";
import { useCategory } from "../../contexts/CategoryContext";
import randomImages from "../../assets/images/importImages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faSpinner,
  faExclamationTriangle,
  faBook,
  faArrowRight,
  faArrowLeft,
  faStar,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
  >
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
  >
    <FontAwesomeIcon icon={faArrowRight} />
  </button>
);

const CategoryLiveShow = () => {
  const { categories, loading, error } = useCategory();

  // Lọc danh mục hợp lệ
  const validCategories = (categories || []).filter(
    (cat) => cat?.name && cat?.description
  );

  // Cấu hình slider nâng cao
  const settings = {
    dots: true,
    infinite: validCategories.length > 1,
    speed: 800,
    slidesToShow: Math.min(3, validCategories.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    centerMode: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: Math.min(2, validCategories.length),
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#93DA97]/20 to-[#E8FFD7]/20 filter blur-3xl animate-pulse delay-1000" />

      {/* Section Header */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 backdrop-blur-sm border border-[#93DA97]/30 rounded-full px-6 py-3 mb-6 text-sm font-medium text-[#E8FFD7]">
          <FontAwesomeIcon
            icon={faLayerGroup}
            className="mr-2 text-[#93DA97]"
          />
          Danh mục sách phong phú
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-[#E8FFD7] via-[#93DA97] to-[#5E936C] text-transparent bg-clip-text">
            Khám Phá Thể Loại
          </span>
        </h2>

        <p className="text-xl text-gray-300/90 max-w-3xl mx-auto leading-relaxed">
          Từ văn học kinh điển đến khoa học hiện đại, từ tiểu thuyết lãng mạn
          đến sách kỹ năng sống. Tìm thể loại yêu thích và bắt đầu hành trình
          tri thức của bạn.
        </p>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-[#93DA97]/30 border-t-[#93DA97] rounded-full animate-spin"></div>
              <FontAwesomeIcon
                icon={faBook}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#93DA97] text-2xl animate-pulse"
              />
            </div>
            <p className="text-gray-400 mt-6 text-lg">
              Đang tải danh mục sách...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-md">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-red-400 text-5xl mb-6"
              />
              <h3 className="text-xl font-semibold text-red-400 mb-4">
                Không thể tải danh mục
              </h3>
              <p className="text-red-400/80">{error}</p>
            </div>
          </div>
        )}

        {/* Success State */}
        {!loading && !error && (
          <>
            {validCategories.length > 0 ? (
              <div className="relative">
                <Slider {...settings} className="category-slider">
                  {validCategories.map((category, idx) => {
                    const keys = Object.keys(randomImages);
                    const imageUrl = randomImages[keys[idx % keys.length]];

                    return (
                      <div
                        key={category.category_id || idx}
                        className="px-3 outline-none select-none"
                      >
                        <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/40 hover:border-[#93DA97]/60 transition-all duration-500 hover:scale-105 hover:shadow-[#93DA97]/20">
                          {/* Image Container */}
                          <div
                            className="relative overflow-hidden"
                            style={{ aspectRatio: "16/10" }}
                          >
                            <img
                              src={imageUrl}
                              alt={category.name}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            {/* Enhanced Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/70 transition-all duration-500"></div>

                            {/* Category Icon */}
                            <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-br from-[#93DA97] to-[#5E936C] rounded-full flex items-center justify-center shadow-lg">
                              <FontAwesomeIcon
                                icon={faBookOpen}
                                className="text-gray-900 text-lg"
                              />
                            </div>

                            {/* Stats Badge */}
                            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-[#93DA97] text-xs"
                              />
                              <span className="text-white text-xs font-medium">
                                {Math.floor(Math.random() * 100) + 50}
                              </span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="relative p-6">
                            <h3 className="text-2xl font-bold mb-3 line-clamp-1 group-hover:text-[#93DA97] transition-colors duration-300">
                              {category.name}
                            </h3>
                            <p className="text-gray-300 text-sm line-clamp-3 mb-4 leading-relaxed">
                              {category.description}
                            </p>

                            {/* Action Button */}
                            <div className="flex items-center justify-between">
                              <span className="text-[#93DA97] text-sm font-medium">
                                {Math.floor(Math.random() * 500) + 100} cuốn
                                sách
                              </span>
                              <button className="bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                                <span>Xem thêm</span>
                                <FontAwesomeIcon
                                  icon={faArrowRight}
                                  className="text-xs"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </Slider>
              </div>
            ) : (
              <div className="text-center py-32">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-gray-700/40">
                  <FontAwesomeIcon
                    icon={faBook}
                    className="text-[#93DA97] text-6xl mb-6 opacity-60"
                  />
                  <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                    Chưa có danh mục
                  </h3>
                  <p className="text-gray-400">
                    Hệ thống đang được cập nhật với nhiều danh mục sách thú vị.
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Enhanced Custom Styles */}
      <style>{`
        .category-slider .slick-dots {
          bottom: -60px;
        }
        .category-slider .slick-dots li {
          margin: 0 4px;
        }
        .category-slider .slick-dots li button:before {
          font-size: 12px;
          color: #6b7280;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .category-slider .slick-dots li.slick-active button:before {
          color: #93DA97;
          opacity: 1;
          transform: scale(1.2);
        }
        .category-slider .slick-dots li:hover button:before {
          color: #93DA97;
          opacity: 0.8;
        }
        .category-slider .slick-track {
          display: flex;
          align-items: stretch;
        }
        .category-slider .slick-slide > div {
          height: 100%;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default CategoryLiveShow;
