import React, { useMemo } from "react";
import Slider from "react-slick";
import { useBook } from "../../contexts/BookContext";
import { generateSlug } from "../../utils/slugify";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenNib,
  faEye,
  faTicketAlt,
} from "@fortawesome/free-solid-svg-icons";

const LiveShow = () => {
  const { books } = useBook();

  const randomBooks = useMemo(() => {
    if (!books || books.length === 0) return [];
    const booksWithCovers = books.filter((book) => book.cover_image);
    const booksWithoutCovers = books.filter((book) => !book.cover_image);
    const shuffledWithCovers = [...booksWithCovers].sort(
      () => 0.5 - Math.random()
    );
    const shuffledWithoutCovers = [...booksWithoutCovers].sort(
      () => 0.5 - Math.random()
    );
    const combinedBooks = [...shuffledWithCovers, ...shuffledWithoutCovers];
    const count = Math.min(12, books.length);
    return combinedBooks.slice(0, count);
  }, [books]);

  const slidesToShow = Math.min(3, randomBooks.length);

  const settings = {
    dots: true,
    infinite: randomBooks.length > slidesToShow,
    speed: 800,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: randomBooks.length > 1,
    centerPadding: "100px",
    cssEase: "cubic-bezier(0.8, 0, 0.2, 1)",
    dotsClass: "slick-dots custom-dots-liveshow",
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(3, randomBooks.length),
          centerPadding: "80px",
          infinite: randomBooks.length > 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, randomBooks.length),
          centerPadding: "60px",
          infinite: randomBooks.length > 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "100px",
          infinite: randomBooks.length > 1,
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          centerPadding: "0px",
          infinite: randomBooks.length > 1,
          dots: true,
        },
      },
    ],
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 60, scale: 0.85, rotateY: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        delay: i * 0.15,
        type: "spring",
        stiffness: 80,
        damping: 20,
      },
    }),
    hover: {
      y: -12,
      scale: 1.06,
      boxShadow: "0px 25px 40px rgba(52, 211, 153, 0.4)",
      transition: { type: "spring", stiffness: 250, damping: 15 },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.15,
      filter: "brightness(1.1)",
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <section className="relative mx-auto px-0 md:px-0 py-24 md:py-32 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      <h2 className="relative z-10 text-5xl md:text-6xl font-extrabold font-poppins tracking-tight bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-500 text-transparent bg-clip-text mb-20 text-center uppercase">
        Sách Nổi Bật
      </h2>

      <style jsx global>{`
        .custom-dots-liveshow {
          bottom: -50px;
        }
        .custom-dots-liveshow li button:before {
          font-size: 14px;
          color: #4b5563;
          opacity: 0.6;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .custom-dots-liveshow li.slick-active button:before {
          color: #34d399;
          opacity: 1;
          transform: scale(1.3);
        }
        .slick-slide > div {
          padding: 0 15px;
          transition: transform 0.7s cubic-bezier(0.8, 0, 0.2, 1);
        }
        .slick-list {
          margin: 0 -15px;
        }
        .slick-slide:not(.slick-center) {
          transform: scale(0.85);
          opacity: 0.7;
          transition: transform 0.7s cubic-bezier(0.8, 0, 0.2, 1),
            opacity 0.7s cubic-bezier(0.8, 0, 0.2, 1);
        }
        .slick-slide.slick-center {
          transform: scale(1);
          opacity: 1;
        }
        .slick-slide.slick-center {
          z-index: 10;
        }
      `}</style>

      {randomBooks.length > 0 ? (
        <div className="max-w-full mx-auto">
          <Slider {...settings}>
            {randomBooks.map((book, index) => {
              const slug = generateSlug(book.book_id);
              return (
                <div key={book.book_id}>
                  <motion.div
                    className="relative group cursor-pointer outline-none focus:outline-none"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    custom={index}
                  >
                    <Link to={`/books/${slug}`} className="block">
                      <div
                        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-xl overflow-hidden border-2 border-gray-700/40 transition-all duration-500 group-hover:border-emerald-500/80 group-hover:shadow-emerald-500/20"
                        title={book.title || "Không có tiêu đề"}
                      >
                        <div className="relative h-[450px] md:h-[550px] lg:h-[600px] overflow-hidden rounded-t-2xl">
                          <motion.img
                            src={
                              book.cover_image || "/placeholder-image-dark.jpg"
                            }
                            alt={book.title || "Không có tiêu đề"}
                            className="w-full h-full object-cover transition-transform duration-500 ease-in-out"
                            variants={imageVariants}
                            loading="lazy"
                          />
                        </div>

                        <div className="p-6 space-y-3 bg-gradient-to-t from-black/50 to-transparent absolute bottom-0 left-0 right-0 rounded-b-2xl">
                          <h3 className="text-xl lg:text-2xl font-bold font-poppins text-white truncate transition-colors duration-300 group-hover:text-emerald-300 drop-shadow-lg">
                            {book.title || "Không có tiêu đề"}
                          </h3>
                          <p className="text-gray-300 text-base truncate flex items-center font-medium group-hover:text-gray-100 transition-colors duration-300">
                            <FontAwesomeIcon
                              icon={faPenNib}
                              className="mr-2.5 text-gray-500 group-hover:text-emerald-400 transition-colors duration-300 flex-shrink-0"
                            />
                            <span className="truncate">
                              {book.author || "Không rõ tác giả"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              );
            })}
          </Slider>
        </div>
      ) : (
        <p className="text-center text-gray-500 text-xl mt-12">
          Chưa có cuốn sách nào sẵn sàng để khám phá. Hãy quay lại sau nhé!
        </p>
      )}
    </section>
  );
};

export default LiveShow;
