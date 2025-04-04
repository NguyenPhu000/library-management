import React from "react";
import { FaBookOpen, FaStar, FaGift, FaUserShield } from "react-icons/fa";
import { motion } from "framer-motion";

const features = [
  {
    icon: FaBookOpen,
    color: "emerald",
    textColor: "text-emerald-400",
    shadowColor: "shadow-emerald-500/30",
    hoverBorderColor: "hover:border-emerald-500/50",
    glowFromColor: "from-emerald-600/20",
    title: "Kho sách khổng lồ",
    description:
      "Hơn 50.000 đầu sách đa dạng thể loại, liên tục được cập nhật mới.",
  },
  {
    icon: FaStar,
    color: "yellow",
    textColor: "text-yellow-400",
    shadowColor: "shadow-yellow-500/30",
    hoverBorderColor: "hover:border-yellow-500/50",
    glowFromColor: "from-yellow-600/20",
    title: "Chất lượng tuyển chọn",
    description:
      "Những cuốn sách hay nhất, được cộng đồng yêu thích và đánh giá cao.",
  },
  {
    icon: FaGift,
    color: "pink",
    textColor: "text-pink-400",
    shadowColor: "shadow-pink-500/30",
    hoverBorderColor: "hover:border-pink-500/50",
    glowFromColor: "from-pink-600/20",
    title: "Hoàn toàn miễn phí",
    description:
      "Tiếp cận hàng ngàn đầu sách chất lượng mà không tốn bất kỳ chi phí nào.",
  },
  {
    icon: FaUserShield,
    color: "blue",
    textColor: "text-blue-400",
    shadowColor: "shadow-blue-500/30",
    hoverBorderColor: "hover:border-blue-500/50",
    glowFromColor: "from-blue-600/20",
    title: "An toàn & Tiện lợi",
    description:
      "Trải nghiệm đọc sách mượt mà, an toàn với giao diện thân thiện, dễ sử dụng.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 40, opacity: 0, scale: 0.9 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 80, damping: 12 },
  },
};

const iconContainerVariants = {
  hover: {
    scale: 1.15,
    rotate: 10,
    transition: { type: "spring", stiffness: 300, damping: 10 },
  },
};

const FeatureSection = () => {
  const getHoverShadow = (color) => {
    switch (color) {
      case "emerald":
        return "rgba(52, 211, 153, 0.25)";
      case "yellow":
        return "rgba(250, 204, 21, 0.25)";
      case "pink":
        return "rgba(244, 114, 182, 0.25)";
      case "blue":
        return "rgba(96, 165, 250, 0.25)";
      default:
        return "rgba(0, 0, 0, 0.4)";
    }
  };
  const getHoverBorder = (color) => {
    switch (color) {
      case "emerald":
        return "rgba(52, 211, 153, 0.6)";
      case "yellow":
        return "rgba(250, 204, 21, 0.6)";
      case "pink":
        return "rgba(244, 114, 182, 0.6)";
      case "blue":
        return "rgba(96, 165, 250, 0.6)";
      default:
        return "rgba(100, 116, 139, 0.5)";
    }
  };

  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          className="text-4xl sm:text-5xl lg:text-6xl font-bold text-center mb-16 md:mb-20 tracking-tight bg-gradient-to-r from-white via-gray-300 to-emerald-400 text-transparent bg-clip-text"
          style={{ textShadow: "0 3px 15px rgba(52, 211, 153, 0.2)" }}
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.4, 0.0, 0.2, 1] }}
        >
          Tại sao chọn <span className="text-emerald-400">Góc Thư Viện</span>?
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={index}
                className={`relative p-6 md:p-8 bg-gray-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/40 transition-all duration-350 ease-out overflow-hidden group ${feature.hoverBorderColor}`}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.04,
                  boxShadow: `0px 20px 40px rgba(0, 0, 0, 0.5), 0px 8px 20px ${getHoverShadow(
                    feature.color
                  )}`,
                  borderColor: getHoverBorder(feature.color),
                }}
                transition={{ type: "spring", stiffness: 280, damping: 18 }}
              >
                <div
                  className={`absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-350 ${feature.glowFromColor} via-transparent to-transparent blur-xl`}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <motion.div
                    className={`mb-6 p-4 bg-gray-800/80 rounded-full inline-flex shadow-lg ${feature.shadowColor} transition-all duration-300 group-hover:bg-gray-700/90`}
                    variants={iconContainerVariants}
                    whileHover="hover"
                  >
                    <IconComponent
                      className={`text-4xl md:text-5xl ${feature.textColor} transition-colors duration-300`}
                    />
                  </motion.div>

                  <h3 className="text-xl md:text-2xl font-semibold mb-3 text-gray-100 transition-colors duration-300 group-hover:text-white">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 leading-relaxed text-base md:text-lg group-hover:text-gray-300 transition-colors duration-300">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureSection;
