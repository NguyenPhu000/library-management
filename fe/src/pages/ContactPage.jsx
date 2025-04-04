import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faPhone,
  faEnvelope,
  faClock,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const ContactPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const iconVariants = {
    hover: {
      scale: 1.2,
      rotate: [0, 15, -15, 15, 0],
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      className="font-poppins p-4 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 text-white flex justify-center items-center min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-10 md:mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-lightGreen via-slate-400 to-white"
          variants={itemVariants}
        >
          <FontAwesomeIcon icon={faBuilding} className="mr-3" />
          Liên Hệ Với Góc Thư Viện
        </motion.h1>

        <motion.div
          className="bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 transition-shadow duration-300 border border-gray-700/50"
          variants={itemVariants}
          whileHover={{
            scale: 1.01,
            boxShadow: "0px 15px 40px rgba(0, 255, 150, 0.2)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.p
            className="text-gray-300 mb-10 text-center text-lg md:text-xl"
            variants={itemVariants}
          >
            Chúng tôi luôn ở đây để lắng nghe và hỗ trợ bạn. Đừng ngần ngại kết
            nối!
          </motion.p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12">
            {/* Contact Info Section */}
            <motion.div variants={itemVariants}>
              <h3 className="text-lightGreen text-2xl md:text-3xl font-semibold mb-6 md:mb-8 border-b-2 border-lightGreen/50 pb-2 inline-block">
                Thông Tin Liên Hệ
              </h3>
              <div className="space-y-6 md:space-y-8">
                {/* Address */}
                <motion.div
                  className="flex items-start group"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="mr-4 md:mr-6 mt-1 text-lightGreen text-xl md:text-2xl flex-shrink-0"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                  </motion.div>
                  <div>
                    <p className="text-gray-100 font-semibold text-lg">
                      Địa chỉ:
                    </p>
                    <p className="text-gray-400 text-base md:text-lg group-hover:text-gray-200 transition-colors duration-200">
                      68 Đường Trần Chiên, Phường Lê Bình
                      <br />
                      Quận Cái Răng, Thành phố Cần Thơ
                    </p>
                  </div>
                </motion.div>

                {/* Phone */}
                <motion.div
                  className="flex items-center group"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="mr-4 md:mr-6 text-lightGreen text-xl md:text-2xl flex-shrink-0"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <FontAwesomeIcon icon={faPhone} />
                  </motion.div>
                  <div>
                    <p className="text-gray-100 font-semibold text-lg">
                      Điện thoại:
                    </p>
                    <p className="text-gray-400 text-base md:text-lg">
                      <a
                        href="tel:+84123456789"
                        className="hover:text-lightGreen transition-colors duration-200 group-hover:text-lightGreen"
                      >
                        +84 123 456 789
                      </a>
                    </p>
                  </div>
                </motion.div>

                {/* Email */}
                <motion.div
                  className="flex items-center group"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="mr-4 md:mr-6 text-lightGreen text-xl md:text-2xl flex-shrink-0"
                    variants={iconVariants}
                    whileHover="hover"
                  >
                    <FontAwesomeIcon icon={faEnvelope} />
                  </motion.div>
                  <div>
                    <p className="text-gray-100 font-semibold text-lg">
                      Email:
                    </p>
                    <p className="text-gray-400 text-base md:text-lg">
                      <a
                        href="mailto:info@gocthuvien.com"
                        className="hover:text-lightGreen transition-colors duration-200 group-hover:text-lightGreen"
                      >
                        info@gocthuvien.com
                      </a>
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lightGreen text-2xl md:text-3xl font-semibold mb-6 md:mb-8 border-b-2 border-lightGreen/50 pb-2 inline-block">
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                Giờ Mở Cửa
              </h3>
              <div className="space-y-4 bg-gray-700/50 p-6 rounded-xl shadow-inner">
                <motion.div
                  className="flex justify-between items-center"
                  variants={itemVariants}
                >
                  <p className="text-gray-100 font-medium text-lg">
                    Thứ Hai - Thứ Sáu:
                  </p>
                  <p className="text-gray-300 text-lg font-mono bg-gray-900/50 px-3 py-1 rounded">
                    8:00 - 21:00
                  </p>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center"
                  variants={itemVariants}
                >
                  <p className="text-gray-100 font-medium text-lg">
                    Thứ Bảy - Chủ Nhật:
                  </p>
                  <p className="text-gray-300 text-lg font-mono bg-gray-900/50 px-3 py-1 rounded">
                    9:00 - 17:00
                  </p>
                </motion.div>
                <motion.div
                  className="flex justify-between items-center pt-4 border-t border-gray-600/50 mt-4"
                  variants={itemVariants}
                >
                  <p className="text-gray-100 font-medium text-lg">Ngày lễ:</p>
                  <p className="text-gray-300 text-lg font-mono bg-red-900/50 px-3 py-1 rounded">
                    Đóng cửa
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Footer Text */}
          <motion.div
            className="mt-12 md:mt-16 text-center"
            variants={itemVariants}
          >
            <p className="text-gray-400 italic text-lg md:text-xl">
              Góc Thư Viện - Nơi tri thức thăng hoa và cộng đồng gắn kết.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
