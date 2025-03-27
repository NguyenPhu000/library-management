import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/books");
  };

  return (
    <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-40 px-6 flex flex-col lg:flex-row items-center justify-center overflow-hidden">
      {/* Nội dung chính */}
      <div className="relative z-10 max-w-3xl text-center lg:text-left">
        <motion.h1
          className="text-6xl md:text-7xl font-extrabold leading-tight tracking-wide bg-gradient-to-r from-white via-gray-400 to-lightGreen text-transparent bg-clip-text shadow-md hover:scale-105 transition-transform duration-300"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
          whileHover={{ scale: 1.05 }}
        >
          Khám phá kho tàng tri thức bất tận
        </motion.h1>

        <p className="mt-8 text-lg md:text-xl opacity-90">
          Đắm mình vào thế giới của hàng ngàn cuốn sách miễn phí, mở rộng kiến
          thức mọi lúc, mọi nơi!
        </p>

        {/* Nút CTA */}
        <button
          onClick={handleExploreClick}
          className="mt-10 bg-lightGreen hover:bg-green-500 text-black font-semibold text-lg py-3 px-8 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
        >
          <span>Bắt đầu khám phá</span>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>

      {/* Hình ảnh minh họa (Đặt bên phải, to hơn) */}
      <div className="mt-12 lg:mt-0 lg:ml-24 w-full max-w-md lg:max-w-lg relative group overflow-hidden rounded-lg shadow-2xl hover:scale-105 transition-transform border-4 border-lightGreen">
        {/* Thêm lớp phủ gradient cho hình ảnh */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent rounded-lg"></div>
        <img
          src="./uploads/coverBook.jpg"
          alt="Books"
          className="w-full h-full object-cover"
        />
        {/* Hiệu ứng sáng bóng di chuyển từ trái trên xuống */}
        <div
          className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,.3)_50%,transparent_75%,transparent_100%)]
                     bg-[length:250%_250%] bg-[position:-100%_-100%] bg-no-repeat transition-[background-position_1500ms_ease,opacity_1500ms_ease] opacity-0 group-hover:opacity-100 group-hover:bg-[position:200%_200%] group-hover:duration-[1500ms]"
        ></div>
      </div>

      {/* Các hình tròn trang trí */}
      <div className="absolute top-1/4 left-10 w-48 h-48 rounded-full bg-gradient-to-r from-lightGreen to-green-500 opacity-20 blur-xl animate-pulse slow"></div>
      <div className="absolute bottom-1/4 right-10 w-64 h-64 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 opacity-20 blur-xl animate-pulse slow delay-1000"></div>
    </section>
  );
};

export default HeroSection;
