import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

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
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 80, damping: 12 },
  },
};

const imageVariants = {
  hidden: { x: 100, opacity: 0, rotateY: -15 },
  visible: {
    x: 0,
    opacity: 1,
    rotateY: 0,
    transition: { type: "spring", stiffness: 50, damping: 15, delay: 0.4 },
  },
};

const blobVariants = (delay = 0, duration = 10) => ({
  animate: {
    scale: [1, 1.15, 1.05, 1.2, 1],
    opacity: [0.1, 0.2, 0.15, 0.25, 0.1],
    rotate: [0, 10, -5, 5, 0],
    transition: {
      duration: duration,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "mirror",
      delay,
    },
  },
});

const HeroSection = () => {
  const navigate = useNavigate();

  const handleExploreClick = () => {
    navigate("/books");
  };

  return (
    <section className="relative bg-gradient-to-br from-gray-950 via-black to-gray-950 text-white py-40 md:py-48 px-6 flex flex-col lg:flex-row items-center justify-center overflow-hidden min-h-screen">
      <motion.div
        className="absolute top-1/4 left-5 md:left-10 w-64 h-64 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 filter blur-3xl opacity-80 mix-blend-lighten"
        variants={blobVariants(0, 12)}
        animate="animate"
      />

      <motion.div
        className="absolute bottom-1/4 right-5 md:right-10 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 filter blur-3xl opacity-70 mix-blend-lighten"
        variants={blobVariants(1.5, 10)}
        animate="animate"
      />

      <motion.div
        className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 filter blur-2xl opacity-60 mix-blend-lighten hidden lg:block"
        variants={blobVariants(0.8, 9)}
        animate="animate"
      />

      <motion.div
        className="relative z-10 flex flex-col lg:flex-row items-center justify-between max-w-7xl w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="max-w-xl xl:max-w-2xl text-center lg:text-left lg:mr-16 mb-16 lg:mb-0">
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-extrabold leading-tight tracking-tighter bg-gradient-to-r from-white via-gray-200 to-emerald-300 text-transparent bg-clip-text mb-6 pb-2"
            style={{ textShadow: "0 3px 15px rgba(52, 211, 153, 0.25)" }}
            variants={itemVariants}
          >
            Khám phá kho tàng tri thức vô hạn
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-300/90 leading-relaxed"
            variants={itemVariants}
          >
            Đắm mình vào thế giới của hàng ngàn cuốn sách chọn lọc, hoàn toàn
            miễn phí. Mở rộng kiến thức và tầm nhìn của bạn mọi lúc, mọi nơi!
          </motion.p>

          <motion.button
            onClick={handleExploreClick}
            className="mt-12 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-lg py-4 px-10 rounded-full transition-all duration-300 ease-in-out shadow-lg hover:shadow-emerald-400/50 transform flex items-center justify-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900"
            variants={itemVariants}
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 10px 25px rgba(52, 211, 153, 0.4)",
              transition: { duration: 0.2, type: "spring", stiffness: 300 },
            }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Bắt đầu khám phá</span>
            <FontAwesomeIcon
              icon={faArrowRight}
              className="transition-transform duration-300 group-hover:translate-x-1.5 group-hover:scale-110"
            />
          </motion.button>
        </motion.div>

        <motion.div
          className="w-full max-w-sm md:max-w-md lg:max-w-lg relative group perspective-1000"
          variants={imageVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            scale: 1.05,
            boxShadow: "0 15px 40px rgba(52, 211, 153, 0.35)",
          }}
          style={{ transformStyle: "preserve-3d" }}
        >
          <motion.div
            className="rounded-xl shadow-2xl border-2 border-emerald-500/40 group-hover:border-emerald-400 transition-all duration-400 overflow-hidden"
            whileHover={{
              rotateY: 10,
              rotateX: -5,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <img
              src="./uploads/coverBook.jpg"
              alt="Kho sách đa dạng"
              className="w-full h-auto object-cover transition-transform duration-500 ease-out group-hover:scale-110 block"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 opacity-80 group-hover:opacity-60 transition-opacity duration-400"></div>

            <div
              className="absolute inset-0 overflow-hidden bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,.5)_50%,transparent_75%)]
                         bg-[length:250%_250%] bg-no-repeat transition-[background-position_1000ms_ease-out] opacity-0 group-hover:opacity-100 group-hover:bg-[position:170%_170%]"
              style={{ backgroundPosition: "-150% -150%" }}
            ></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
