import React from "react";
import Slider from "react-slick";
import { useCategory } from "../../contexts/CategoryContext";
import randomImages from "../../assets/images/importImages";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faSpinner,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const CategoryLiveShow = () => {
  const { categories, loading, error } = useCategory();

  // Lọc danh mục hợp lệ
  const validCategories = (categories || []).filter(
    (cat) => cat?.name && cat?.description
  );

  // Cấu hình slider
  const settings = {
    dots: true,
    infinite: validCategories.length > 1,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 7000,
    pauseOnHover: true,
    arrows: false,
    cssEase: "ease-in-out",
    centerMode: true,
    centerPadding: validCategories.length > 1 ? "15%" : "0px",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: validCategories.length > 1 ? "10%" : "0px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerMode: false,
          centerPadding: "0px",
        },
      },
    ],
  };

  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-emerald-400 text-4xl mb-4"
          />
          <p className="text-gray-400">Đang tải danh mục...</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-400 text-4xl mb-4"
          />
          <p className="text-red-400 max-w-xs text-center">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {validCategories.length > 0 ? (
            <Slider {...settings} className="px-2">
              {validCategories.map((category, idx) => {
                const keys = Object.keys(randomImages);
                const imageUrl = randomImages[keys[idx % keys.length]];

                return (
                  <div
                    key={category.category_id || idx}
                    className="px-2 outline-none select-none"
                  >
                    <div
                      className="relative rounded-xl overflow-hidden shadow-lg border border-gray-700/40 hover:border-emerald-500/40 transition-all duration-300"
                      style={{ aspectRatio: "16/9" }}
                    >
                      <img
                        src={imageUrl}
                        alt={category.name}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                      {/* Content */}
                      <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-semibold mb-1 line-clamp-1 drop-shadow-lg">
                          {category.name}
                        </h3>
                        <p className="text-gray-300 text-sm line-clamp-2">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          ) : (
            <p className="text-center text-gray-500 py-20">
              ✨ Hiện chưa có danh mục để hiển thị. ✨
            </p>
          )}
        </>
      )}

      {/* Custom slick dots */}
      <style jsx>{`
        .slick-dots {
          bottom: -35px;
        }
        .slick-dots li button:before {
          font-size: 10px;
          color: #6b7280;
          opacity: 0.6;
          transition: all 0.3s;
        }
        .slick-dots li.slick-active button:before {
          color: #34d399;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default CategoryLiveShow;
