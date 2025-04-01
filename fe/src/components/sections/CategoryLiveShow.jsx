import React from "react";
import Slider from "react-slick";
import { useCategory } from "../../contexts/CategoryContext";
import randomImages from "../../assets/images/importImages";
import { motion } from "framer-motion"; // Import motion

const CategoryLiveShow = () => {
  const { categories } = useCategory();

  // Lọc ra các category có tên và mô tả
  const validCategories = categories.filter(
    (cat) => cat.name && cat.description
  );

  const slidesToShow = Math.min(1, validCategories.length); // Chỉ hiển thị 1 slide chính

  const settings = {
    dots: true,
    infinite: validCategories.length > slidesToShow,
    speed: 800, // Tăng tốc độ chuyển slide
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000, // Giảm thời gian tự động chuyển
    pauseOnHover: true,
    centerMode: validCategories.length > 1, // Kích hoạt center mode nếu có nhiều hơn 1 slide
    centerPadding: "25%", // Điều chỉnh padding cho center mode để thấy slide kế tiếp
    cssEase: "cubic-bezier(0.8, 0, 0.2, 1)", // Hiệu ứng chuyển mượt mà hơn
    dotsClass: "slick-dots custom-dots-category", // Class tùy chỉnh cho dots
    arrows: false, // Ẩn mũi tên mặc định
    responsive: [
      {
        breakpoint: 1024, // Cho màn hình nhỏ hơn
        settings: {
          centerPadding: "15%",
          infinite: validCategories.length > 1,
        },
      },
      {
        breakpoint: 768, // Cho màn hình tablet/mobile
        settings: {
          centerMode: false, // Tắt center mode trên mobile
          slidesToShow: 1,
          centerPadding: "0px",
          infinite: validCategories.length > 1,
        },
      },
    ],
  };

  // Animation variants (tương tự UpdatedBook)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 12 },
    },
  };

  return (
    <motion.div
      className="category-live-show py-16 md:py-24 bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden" // Nền đen gradient và padding
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <style jsx global>{`
        .custom-dots-category li button:before {
          font-size: 10px;
          color: #4a5568; /* gray-600 */
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .custom-dots-category li.slick-active button:before {
          color: #38b2ac; /* teal-500 */
          opacity: 1;
        }
        .slick-slide {
          padding: 0 15px; /* Khoảng cách giữa các slide */
          transition: transform 0.5s ease, opacity 0.5s ease;
          opacity: 0.7; /* Làm mờ các slide không active */
          transform: scale(0.9); /* Thu nhỏ các slide không active */
        }
        .slick-center {
          opacity: 1; /* Slide ở giữa rõ nét */
          transform: scale(1); /* Slide ở giữa kích thước bình thường */
        }
        /* Loại bỏ padding mặc định của slick-track khi centerMode=false trên mobile */
        @media (max-width: 767px) {
          .slick-track {
            padding-left: 0 !important;
            padding-right: 0 !important;
          }
          .slick-slide {
            padding: 0 5px; /* Giảm padding trên mobile */
            opacity: 1; /* Hiển thị rõ trên mobile */
            transform: scale(1); /* Kích thước bình thường trên mobile */
          }
        }
      `}</style>
      {validCategories.length > 0 ? (
        <Slider {...settings}>
          {validCategories.map((category, index) => {
            // Lấy ảnh ngẫu nhiên một cách ổn định hơn cho mỗi category dựa trên index
            const imageIndex = (index % Object.keys(randomImages).length) + 1;
            const imageUrl = randomImages[`image${imageIndex}`];

            return (
              <motion.div
                key={category.category_id || index} // Ưu tiên category_id nếu có
                variants={itemVariants} // Áp dụng animation item
                className="outline-none focus:outline-none" // Loại bỏ viền focus mặc định của slider
              >
                <div
                  className="relative group bg-gray-900 rounded-2xl shadow-xl overflow-hidden mx-auto border border-gray-700/30
                             hover:border-emerald-500/70 transition-all duration-300 ease-in-out cursor-pointer"
                  style={{ aspectRatio: "16/9" }} // Tỷ lệ khung hình cho card
                >
                  <img
                    src={imageUrl}
                    alt={category.name}
                    title={category.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  {/* Lớp phủ gradient tối hơn */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>
                  {/* Hiệu ứng ánh sáng khi hover (tương tự UpdatedBook) */}
                  <div
                    className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)]
                                 bg-[length:250%_250%] bg-[position:-100%_-100%] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:200%_200%] group-hover:duration-[1200ms]"
                  ></div>
                  {/* Nội dung text */}
                  <div className="absolute inset-0 flex flex-col justify-end items-start text-left p-6 md:p-8">
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-md">
                      {category.name}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base opacity-90 line-clamp-2 drop-shadow-sm">
                      {category.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </Slider>
      ) : (
        <p className="text-center text-gray-500 text-lg py-10">
          ✨ Hiện chưa có danh mục nào để hiển thị. ✨
        </p>
      )}
    </motion.div>
  );
};

export default CategoryLiveShow;
