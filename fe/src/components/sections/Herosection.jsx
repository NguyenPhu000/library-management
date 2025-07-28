import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faBook,
  faBookOpen,
  faGraduationCap,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/books");
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 text-white py-20 md:py-32 px-4 flex flex-col lg:flex-row items-center justify-center overflow-hidden min-h-screen">
      {/* Enhanced Background Effects */}
      <div className="absolute top-1/4 left-5 md:left-10 w-96 h-96 rounded-full bg-gradient-to-r from-[#5E936C] to-[#93DA97] filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-1/4 right-5 md:right-10 w-80 h-80 rounded-full bg-gradient-to-br from-[#93DA97] to-[#E8FFD7] filter blur-3xl opacity-25 animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-r from-[#3E5F44] to-[#5E936C] filter blur-3xl opacity-20 animate-pulse delay-2000" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-bounce delay-300">
        <FontAwesomeIcon
          icon={faBook}
          className="text-[#93DA97] text-2xl opacity-60"
        />
      </div>
      <div className="absolute top-32 right-32 animate-bounce delay-700">
        <FontAwesomeIcon
          icon={faBookOpen}
          className="text-[#E8FFD7] text-xl opacity-50"
        />
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce delay-1000">
        <FontAwesomeIcon
          icon={faGraduationCap}
          className="text-[#5E936C] text-2xl opacity-40"
        />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl w-full">
        {/* Left Content */}
        <div className="max-w-2xl text-center lg:text-left lg:mr-12 mb-12 lg:mb-0">
          {/* Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 backdrop-blur-sm border border-[#93DA97]/30 rounded-full px-4 py-2 mb-6 text-sm font-medium text-[#E8FFD7]">
            <FontAwesomeIcon icon={faStar} className="mr-2 text-[#93DA97]" />
            Thư viện số hiện đại nhất Việt Nam
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-[#E8FFD7] to-[#93DA97] text-transparent bg-clip-text">
              Khám Phá
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#93DA97] to-[#5E936C] text-transparent bg-clip-text">
              Tri Thức
            </span>
            <br />
            <span className="text-white">Vô Hạn</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-300/90 leading-relaxed max-w-xl">
            Trải nghiệm thư viện số hiện đại với hàng nghìn cuốn sách chọn lọc.
            Mượn sách dễ dàng, đọc mọi lúc mọi nơi, hoàn toàn miễn phí.
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center lg:justify-start space-x-8 mt-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#93DA97]">10,000+</div>
              <div className="text-sm text-gray-400">Cuốn sách</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#93DA97]">5,000+</div>
              <div className="text-sm text-gray-400">Thành viên</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#93DA97]">24/7</div>
              <div className="text-sm text-gray-400">Truy cập</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mx-auto lg:mx-0 justify-center lg:justify-start">
            <button
              onClick={handleExploreClick}
              className="group bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white font-semibold text-lg py-4 px-8 rounded-full transition-all duration-300 ease-in-out shadow-xl hover:shadow-[#5E936C]/30 hover:scale-105 flex items-center space-x-3"
            >
              <span>Khám phá ngay</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                className="transform group-hover:translate-x-1 transition-transform duration-300"
              />
            </button>

            <button
              onClick={handleRegisterClick}
              className="bg-transparent border-2 border-[#93DA97] text-[#93DA97] hover:bg-[#93DA97] hover:text-gray-900 font-semibold text-lg py-4 px-8 rounded-full transition-all duration-300 ease-in-out hover:scale-105"
            >
              Đăng ký miễn phí
            </button>
          </div>
        </div>

        {/* Right Visual */}
        <div className="w-full max-w-lg relative">
          {/* Main Book Stack */}
          <div className="relative">
            {/* Background Books */}
            <div className="absolute -top-4 -left-4 w-80 h-96 bg-gradient-to-br from-[#3E5F44] to-[#5E936C] rounded-2xl shadow-2xl transform rotate-3 opacity-80"></div>
            <div className="absolute -top-2 -left-2 w-80 h-96 bg-gradient-to-br from-[#5E936C] to-[#93DA97] rounded-2xl shadow-2xl transform rotate-1 opacity-90"></div>

            {/* Main Book */}
            <div className="relative w-80 h-96 rounded-2xl overflow-hidden shadow-2xl border border-[#93DA97]/40 hover:border-[#93DA97] transition-all duration-500 group">
              <img
                src="./uploads/coverBook.jpg"
                alt="Thư viện số hiện đại"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

              {/* Book Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-bold text-white mb-2">
                  Kho Tàng Tri Thức
                </h3>
                <p className="text-gray-200 text-sm opacity-90">
                  Hàng nghìn cuốn sách chờ bạn khám phá
                </p>
              </div>
            </div>

            {/* Floating Book Icons */}
            <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-[#93DA97] to-[#E8FFD7] rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <FontAwesomeIcon
                icon={faBook}
                className="text-gray-800 text-xl"
              />
            </div>
            <div className="absolute -bottom-4 -left-8 w-12 h-12 bg-gradient-to-br from-[#E8FFD7] to-[#93DA97] rounded-full flex items-center justify-center shadow-lg animate-bounce delay-500">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-gray-800 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-[#93DA97]/60 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-[#93DA97] rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
