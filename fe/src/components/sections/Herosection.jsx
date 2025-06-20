import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/books");
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white py-16 md:py-24 px-4 flex flex-col lg:flex-row items-center justify-center overflow-hidden min-h-[70vh]">
      <div className="absolute top-1/4 left-5 md:left-10 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 filter blur-3xl opacity-50 mix-blend-lighten" />
      <div className="absolute bottom-1/4 right-5 md:right-10 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 filter blur-3xl opacity-40 mix-blend-lighten" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-6xl w-full">
        <div className="max-w-xl text-center lg:text-left lg:mr-8 mb-8 lg:mb-0">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white via-gray-200 to-emerald-300 text-transparent bg-clip-text mb-4">
            Khám phá kho tàng tri thức vô hạn
          </h1>

          <p className="mt-4 text-base md:text-lg text-gray-300/90 leading-relaxed">
            Đắm mình vào thế giới của hàng ngàn cuốn sách chọn lọc, hoàn toàn
            miễn phí. Mở rộng kiến thức và tầm nhìn của bạn mọi lúc, mọi nơi!
          </p>

          <button
            onClick={handleExploreClick}
            className="mt-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-500 text-white font-medium text-base py-2 px-6 rounded-full transition-all duration-300 ease-in-out shadow-md hover:shadow-emerald-400/30 flex items-center justify-center space-x-2 mx-auto lg:mx-0"
          >
            <span>Bắt đầu khám phá</span>
            <FontAwesomeIcon icon={faArrowRight} />
          </button>
        </div>

        <div className="w-full max-w-xs md:max-w-sm relative">
          <div className="rounded-xl shadow-lg border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 overflow-hidden">
            <img
              src="./uploads/coverBook.jpg"
              alt="Kho sách đa dạng"
              className="w-full h-auto object-cover transition-transform duration-500 ease-out hover:scale-105 block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-70"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
