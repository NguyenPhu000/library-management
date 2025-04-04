import React from "react";
import Slider from "react-slick";
import { useCategory } from "../../contexts/CategoryContext";
import randomImages from "../../assets/images/importImages";
import { motion } from "framer-motion";

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
    centerPadding: "25%",
    cssEase: "cubic-bezier(0.8, 0, 0.2, 1)",
    dotsClass: "slick-dots custom-dots-category",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          centerPadding: "15%",
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
      className="category-live-show py-16 md:py-24 bg-gradient-to-b from-gray-950 via-black to-gray-950 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <style jsx global>{`
        .custom-dots-category li button:before {
          font-size: 10px;
          color: #4a5568;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .custom-dots-category li.slick-active button:before {
          color: #38b2ac;
          opacity: 1;
        }
        .slick-slide {
          padding: 0 15px;
          transition: transform 0.5s ease, opacity 0.5s ease;
          opacity: 0.7;
          transform: scale(0.9);
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
              <motion.div
                key={category.category_id || index}
                variants={itemVariants}
                className="outline-none focus:outline-none"
              >
                <div
                  className="relative group bg-gray-900 rounded-2xl shadow-xl overflow-hidden mx-auto border border-gray-700/30
                             hover:border-emerald-500/70 transition-all duration-300 ease-in-out cursor-pointer"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={imageUrl}
                    alt={category.name}
                    title={category.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300"></div>
                  <div
                    className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,.1)_50%,transparent_75%,transparent_100%)]
                                 bg-[length:250%_250%] bg-[position:-100%_-100%] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:200%_200%] group-hover:duration-[1200ms]"
                  ></div>
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
