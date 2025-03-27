import React from "react";
import { FaBookOpen, FaStar, FaGift, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: <FaBookOpen className="text-6xl text-green-400" />,
    title: "Kho sách khổng lồ",
    description:
      "Hơn 50.000 đầu sách với nhiều thể loại khác nhau, liên tục cập nhật.",
  },
  {
    icon: <FaStar className="text-6xl text-yellow-400" />,
    title: "Sách được đánh giá cao",
    description:
      "Danh sách những cuốn sách được yêu thích và đánh giá cao nhất.",
  },
  {
    icon: <FaGift className="text-6xl text-pink-400" />,
    title: "Sách miễn phí",
    description: "Đọc hàng ngàn sách miễn phí mà không cần đăng ký tài khoản.",
  },
  {
    icon: <FaUserShield className="text-6xl text-blue-400" />,
    title: "Bảo mật & Tiện lợi",
    description: "Đăng nhập an toàn, trải nghiệm đọc sách không giới hạn.",
  },
];

const FeatureSection = () => {
  return (
    <section className="py-20 bg-gray-900 text-white text-center">
      {/* Tiêu đề */}
      <h2
        className="text-4xl font-extrabold bg-gradient-to-r from-white via-gray-400 to-green-400 text-transparent bg-clip-text mb-12 animate-pulse"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
      >
        Tại sao chọn <span className="text-green-400">Góc Thư Viện</span>?
      </h2>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="p-8 bg-gray-800 rounded-xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-3 border border-gray-700 cursor-pointer"
            whileHover={{ scale: 1.1, translateY: -5 }}
            transition={{ duration: 0.3 }}
          >
            {/* Icon nằm giữa với background */}
            <div className="flex justify-center mb-6">
              <div className="bg-gray-700 rounded-full p-3 shadow-md hover:bg-lightGreen transition duration-300">
                {feature.icon}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-4 text-gray-100 hover:text-lightGreen transition duration-300">
              {feature.title}
            </h3>

            <p className="text-gray-300 leading-relaxed text-lg">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
