import React, { useMemo } from "react";
import Slider from "react-slick";
import { useBook } from "../../contexts/BookContext";
import { generateSlug } from "../../utils/slugify";
import { formatCoverImage } from "../../utils/imageHelper";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenNib,
  faBookOpen,
  faSpinner,
  faArrowRight,
  faArrowLeft,
  faStar,
  faEye,
  faHeart,
  faDice,
} from "@fortawesome/free-solid-svg-icons";

// Custom Arrow Components
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
  >
    <FontAwesomeIcon icon={faArrowLeft} />
  </button>
);

const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
  >
    <FontAwesomeIcon icon={faArrowRight} />
  </button>
);

const LiveShow = () => {
  const { books, loading, error } = useBook();

  const randomBooks = useMemo(() => {
    if (!books || !Array.isArray(books) || books.length === 0) {
      return [];
    }

    // Lọc các sách có dữ liệu hợp lệ
    const validBooks = books.filter((book) => book && book.book_id);
    if (validBooks.length === 0) return [];

    const booksWithCovers = validBooks.filter((book) => book.cover_image);
    const booksWithoutCovers = validBooks.filter((book) => !book.cover_image);
    const shuffledWithCovers = [...booksWithCovers].sort(
      () => 0.5 - Math.random()
    );
    const shuffledWithoutCovers = [...booksWithoutCovers].sort(
      () => 0.5 - Math.random()
    );
    const combinedBooks = [...shuffledWithCovers, ...shuffledWithoutCovers];
    const count = Math.min(12, combinedBooks.length);
    return combinedBooks.slice(0, count);
  }, [books]);

  const slidesToShow = Math.min(3, randomBooks.length);

  const settings = {
    dots: true,
    infinite: randomBooks.length > slidesToShow,
    speed: 800,
    slidesToShow: slidesToShow > 0 ? slidesToShow : 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    centerMode: randomBooks.length > 1,
    centerPadding: "0px",
    cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
    dotsClass: "slick-dots custom-dots-liveshow",
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(3, randomBooks.length || 1),
          centerPadding: "0px",
          infinite: randomBooks.length > 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, randomBooks.length || 1),
          centerPadding: "0px",
          infinite: randomBooks.length > 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0px",
          infinite: randomBooks.length > 1,
          dots: true,
          arrows: false,
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
          arrows: false,
        },
      },
    ],
  };

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#93DA97]/20 to-[#E8FFD7]/20 filter blur-3xl animate-pulse delay-1000" />

      {/* Section Header */}
      <div className="text-center mb-16 px-4">
        <div className="inline-flex items-center bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 backdrop-blur-sm border border-[#93DA97]/30 rounded-full px-6 py-3 mb-6 text-sm font-medium text-[#E8FFD7]">
          <FontAwesomeIcon icon={faDice} className="mr-2 text-[#93DA97]" />
          Khám phá ngẫu nhiên
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-[#E8FFD7] via-[#93DA97] to-[#5E936C] text-transparent bg-clip-text">
            Sách Ngẫu Nhiên
          </span>
        </h2>

        <p className="text-xl text-gray-300/90 max-w-3xl mx-auto leading-relaxed">
          Để thuật toán giúp bạn khám phá những cuốn sách thú vị mà có thể bạn
          chưa từng nghĩ đến
        </p>
      </div>

      <style>{`
        .random-books-slider .slick-dots {
          bottom: -60px;
        }
        .random-books-slider .slick-dots li {
          margin: 0 4px;
        }
        .random-books-slider .slick-dots li button:before {
          font-size: 12px;
          color: #6b7280;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .random-books-slider .slick-dots li.slick-active button:before {
          color: #93DA97;
          opacity: 1;
          transform: scale(1.2);
        }
        .random-books-slider .slick-dots li:hover button:before {
          color: #93DA97;
          opacity: 0.8;
        }
        .random-books-slider .slick-track {
          display: flex;
          align-items: stretch;
        }
        .random-books-slider .slick-slide > div {
          height: 100%;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4">
        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-[#93DA97]/30 border-t-[#93DA97] rounded-full animate-spin"></div>
              <FontAwesomeIcon
                icon={faBookOpen}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[#93DA97] text-2xl animate-pulse"
              />
            </div>
            <p className="text-gray-400 mt-6 text-lg">
              Đang tải sách ngẫu nhiên...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-md">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-red-400 text-5xl mb-6"
              />
              <h3 className="text-xl font-semibold text-red-400 mb-4">
                Không thể tải sách
              </h3>
              <p className="text-red-400/80">
                Đã xảy ra lỗi khi tải sách. Vui lòng thử lại sau.
              </p>
            </div>
          </div>
        ) : randomBooks && randomBooks.length > 0 ? (
          <div className="relative">
            <Slider {...settings} className="random-books-slider">
              {randomBooks.map((book, index) => {
                const slug = generateSlug(book.book_id);
                return (
                  <div
                    key={book.book_id}
                    className="px-3 outline-none select-none"
                  >
                    <div className="group relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-2xl border border-gray-700/40 hover:border-[#93DA97]/60 transition-all duration-500 hover:scale-105 hover:shadow-[#93DA97]/20">
                      <Link to={`/books/${slug}`} className="block">
                        {/* Image Container */}
                        <div
                          className="relative overflow-hidden"
                          style={{ aspectRatio: "3/4" }}
                        >
                          <img
                            src={formatCoverImage(book.cover_image)}
                            alt={book.title || "Không có tiêu đề"}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                          {/* Enhanced Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent group-hover:from-black/70 transition-all duration-500"></div>

                          {/* Top Badge */}
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 flex items-center space-x-1">
                            <FontAwesomeIcon
                              icon={faEye}
                              className="text-[#93DA97] text-xs"
                            />
                            <span className="text-white text-xs font-medium">
                              {Math.floor(Math.random() * 1000) + 100}
                            </span>
                          </div>

                          {/* Heart Icon */}
                          <div className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <FontAwesomeIcon
                              icon={faHeart}
                              className="text-[#93DA97] text-sm"
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="relative p-6">
                          <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-[#93DA97] transition-colors duration-300">
                            {book.title || "Không có tiêu đề"}
                          </h3>

                          <p className="text-gray-300 text-sm mb-4 flex items-center">
                            <FontAwesomeIcon
                              icon={faPenNib}
                              className="mr-2 text-gray-500 flex-shrink-0"
                            />
                            <span className="truncate">
                              {book.author || "Không rõ tác giả"}
                            </span>
                          </p>

                          {/* Action Button */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-[#93DA97] text-xs"
                              />
                              <span className="text-[#93DA97] text-sm font-medium">
                                {(Math.random() * 2 + 3).toFixed(1)}
                              </span>
                            </div>
                            <button className="bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 flex items-center space-x-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                              <span>Đọc ngay</span>
                              <FontAwesomeIcon
                                icon={faArrowRight}
                                className="text-xs"
                              />
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        ) : (
          <div className="text-center py-32">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-gray-700/40">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-[#93DA97] text-6xl mb-6 opacity-60"
              />
              <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                Chưa có sách nào
              </h3>
              <p className="text-gray-400">
                Hệ thống đang được cập nhật với nhiều cuốn sách thú vị.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LiveShow;
