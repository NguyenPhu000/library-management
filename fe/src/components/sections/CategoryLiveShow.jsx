import React from "react";
import Slider from "react-slick";
import { useCategory } from "../../contexts/CategoryContext";
import randomImages from "../../assets/images/importImages";

const CategoryLiveShow = () => {
  const { categories } = useCategory();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div className="category-live-show">
      <Slider {...settings}>
        {categories.map((category, index) => (
          <div
            key={category.id || index}
            className="p-4 cursor-pointer hover:scale-105 transition-transform duration-300"
          >
            <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={
                    randomImages[
                      `image${
                        Math.floor(
                          Math.random() * Object.keys(randomImages).length
                        ) + 1
                      }`
                    ]
                  }
                  alt={category.name}
                  title={category.name}
                  className="w-full h-80 object-cover rounded-t-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-60"></div>
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
                  <h3 className="text-2xl font-bold text-white text-lightGreen mb-2">
                    {category.name}
                  </h3>
                  <p className="text-white opacity-80 text-sm">
                    {category.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CategoryLiveShow;
