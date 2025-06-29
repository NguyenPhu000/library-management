import React from "react";
import Slider from "react-slick";
import { useCategory } from "../../contexts/CategoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faBookmark,
  faGraduationCap,
  faHeart,
  faMagic,
  faGlobe,
  faFlask,
  faPalette,
  faHistory,
  faTree,
  faMusic,
  faGamepad,
} from "@fortawesome/free-solid-svg-icons";
import randomImages from "../../assets/images/importImages";

const CategoryLiveShow = () => {
  const { categories } = useCategory();

  const validCategories = categories.filter(
    (cat) => cat.name && cat.description
  );

  // Icon mapping cho các category phổ biến
  const categoryIcons = {
    "Khoa học": faFlask,
    "Văn học": faBookmark,
    "Giáo dục": faGraduationCap,
    "Nghệ thuật": faPalette,
    "Lịch sử": faHistory,
    "Thiên nhiên": faTree,
    "Âm nhạc": faMusic,
    "Giải trí": faGamepad,
    "Thế giới": faGlobe,
    "Tình cảm": faHeart,
    default: faLayerGroup,
  };

  const getIconForCategory = (categoryName) => {
    const foundKey = Object.keys(categoryIcons).find((key) =>
      categoryName.toLowerCase().includes(key.toLowerCase())
    );
    return categoryIcons[foundKey] || categoryIcons.default;
  };

  const slidesToShow = Math.min(3, validCategories.length);

  const settings = {
    dots: true,
    infinite: validCategories.length > slidesToShow,
    speed: 600,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: false,
    cssEase: "ease-in-out",
    dotsClass: "slick-dots library-category-dots",
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, validCategories.length),
          infinite: validCategories.length > 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          infinite: validCategories.length > 1,
        },
      },
    ],
  };

  return (
    <section className="py-16 md:py-20 bg-library-background overflow-hidden">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <FontAwesomeIcon
              icon={faLayerGroup}
              className="text-library-primary mr-3 w-6 h-6"
            />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-library-text-primary">
              Danh Mục Sách
            </h2>
          </div>
          <p className="text-library-text-secondary text-lg max-w-2xl mx-auto">
            Khám phá các thể loại sách đa dạng trong bộ sưu tập thư viện của
            chúng tôi
          </p>
        </div>
      </div>

      <style>{`
        .library-category-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .library-category-dots li {
          margin: 0 4px;
        }
        
        .library-category-dots li button {
          border: none;
          background: transparent;
          cursor: pointer;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          padding: 0;
          transition: all 0.3s ease;
        }
        
        .library-category-dots li button:before {
          content: '';
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #D1D5DB;
          transition: all 0.3s ease;
        }
        
        .library-category-dots li.slick-active button:before {
          background-color: #2563EB;
          transform: scale(1.2);
        }
        
        .library-category-dots li:hover button:before {
          background-color: #2563EB;
          opacity: 0.7;
        }
        
        .slick-slide {
          padding: 0 8px;
        }
        
        .slick-list {
          margin: 0 -8px;
        }
        
        .category-card {
          transition: all 0.3s ease;
        }
        
        .category-card:hover {
          transform: translateY(-6px);
        }
        
        @media (max-width: 767px) {
          .slick-slide {
            padding: 0 4px;
          }
          .slick-list {
            margin: 0 -4px;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {validCategories.length > 0 ? (
          <Slider {...settings}>
            {validCategories.map((category, index) => {
              const imageIndex = (index % Object.keys(randomImages).length) + 1;
              const imageUrl = randomImages[`image${imageIndex}`];
              const categoryIcon = getIconForCategory(category.name);

              return (
                <div key={category.category_id || index}>
                  <div className="category-card card-library overflow-hidden group cursor-pointer">
                    {/* Category Image */}
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={category.name}
                        title={category.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                      {/* Category Icon */}
                      <div className="absolute top-4 right-4 w-10 h-10 bg-library-primary/90 rounded-library flex items-center justify-center">
                        <FontAwesomeIcon
                          icon={categoryIcon}
                          className="text-white w-5 h-5"
                        />
                      </div>

                      {/* Category Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-xl md:text-2xl font-heading font-bold mb-2 drop-shadow-md">
                          {category.name}
                        </h3>
                      </div>
                    </div>

                    {/* Category Description */}
                    <div className="p-6">
                      <p className="text-library-text-secondary leading-relaxed line-clamp-3">
                        {category.description}
                      </p>

                      {/* Explore Button */}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="inline-flex items-center text-library-primary font-medium text-sm">
                          <FontAwesomeIcon
                            icon={faMagic}
                            className="mr-2 w-4 h-4"
                          />
                          Khám phá thể loại này
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        ) : (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faLayerGroup}
              className="text-library-text-muted text-4xl mb-4"
            />
            <p className="text-library-text-secondary text-lg">
              Hiện chưa có danh mục nào để hiển thị.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryLiveShow;
