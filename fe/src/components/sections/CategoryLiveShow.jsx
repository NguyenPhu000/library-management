import React from "react";
import Slider from "react-slick";
import { useCategory } from "../../contexts/CategoryContext";
import randomImages from "../../assets/images/importImages";

const CategoryLiveShow = () => {
  const { categories } = useCategory();

  const validCategories = categories.filter(
    (cat) => cat.name && cat.description
  );

  const slidesToShow = Math.min(1, validCategories.length);

  const settings = {
    dots: true,
    infinite: validCategories.length > slidesToShow,
    speed: 800,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    pauseOnHover: true,
    centerMode: validCategories.length > 1,
    centerPadding: "20%",
    cssEase: "ease-in-out",
    dotsClass: "slick-dots custom-dots-category",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: "10%",
          infinite: validCategories.length > 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          centerMode: false,
          slidesToShow: 1,
          centerPadding: "0px",
          infinite: validCategories.length > 1,
        },
      },
    ],
  };

  return (
    <div className="category-live-show py-10 md:py-16 bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden">
      <style jsx global>{`
        .custom-dots-category li button:before {
          font-size: 8px;
          color: #4a5568;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .custom-dots-category li.slick-active button:before {
          color: #38b2ac;
          opacity: 1;
        }
        .slick-slide {
          padding: 0 10px;
          transition: transform 0.3s ease, opacity 0.3s ease;
          opacity: 0.7;
          transform: scale(0.95);
        }
        .slick-center {
          opacity: 1;
          transform: scale(1);
        }
        @media (max-width: 767px) {
          .slick-track {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .slick-slide {
            padding: 0 5px;
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      {validCategories.length > 0 ? (
        <Slider {...settings}>
          {validCategories.map((category, index) => {
            const imageIndex = (index % Object.keys(randomImages).length) + 1;
            const imageUrl = randomImages[`image${imageIndex}`];

            return (
              <div
                key={category.category_id || index}
                className="outline-none focus:outline-none"
              >
                <div
                  className="relative bg-gray-900 rounded-lg shadow-md overflow-hidden mx-auto border border-gray-700/30
                           hover:border-emerald-500/50 transition-all duration-300 ease-in-out cursor-pointer"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={imageUrl}
                    alt={category.name}
                    title={category.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80"></div>
                  <div className="absolute inset-0 flex flex-col justify-end items-start text-left p-4 md:p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1 drop-shadow-md">
                      {category.name}
                    </h3>
                    <p className="text-gray-300 text-sm opacity-90 line-clamp-2 drop-shadow-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      ) : (
        <p className="text-center text-gray-500 text-base py-8">
          ✨ Hiện chưa có danh mục nào để hiển thị. ✨
        </p>
      )}
    </div>
  );
};

export default CategoryLiveShow;
