import React, { useMemo } from "react";
import Slider from "react-slick";
import { useBook } from "../../contexts/BookContext";
import { generateSlug } from "../../utils/slugify";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenNib,
  faBookOpen,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

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
    speed: 600,
    slidesToShow: slidesToShow > 0 ? slidesToShow : 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    centerMode: randomBooks.length > 1,
    centerPadding: "0px",
    cssEase: "ease-in-out",
    dotsClass: "slick-dots custom-dots-liveshow",
    arrows: false,
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

  return (
    <section className="relative mx-auto px-0 md:px-0 py-12 md:py-16 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      <h2 className="relative z-10 text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-300 to-lightGreen text-transparent bg-clip-text mb-8 text-center uppercase">
        Sách Ngẫu Nhiên
      </h2>

      <style jsx global>{`
        .custom-dots-liveshow {
          bottom: -30px;
        }
        .custom-dots-liveshow li button:before {
          font-size: 10px;
          color: #4b5563;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
        .custom-dots-liveshow li.slick-active button:before {
          color: #34d399;
          opacity: 1;
          transform: scale(1.2);
        }
        .slick-slide > div {
          padding: 0 10px;
          transition: transform 0.5s ease;
        }
        .slick-list {
          margin: 0 -10px;
        }
        .slick-slide:not(.slick-center) {
          transform: scale(0.9);
          opacity: 0.8;
          transition: transform 0.5s ease, opacity 0.5s ease;
        }
        .slick-slide.slick-center {
          transform: scale(1);
          opacity: 1;
        }
      `}</style>

      {loading ? (
        <div className="text-center py-8">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-lightGreen text-2xl mb-2"
          />
          <p className="text-base text-gray-300">Đang tải sách...</p>
        </div>
      ) : error ? (
        <p className="text-center text-red-400 text-base mt-8">
          Đã xảy ra lỗi khi tải sách. Vui lòng thử lại sau.
        </p>
      ) : randomBooks && randomBooks.length > 0 ? (
        <div className="max-w-full mx-auto">
          <Slider {...settings}>
            {randomBooks.map((book, index) => {
              const slug = generateSlug(book.book_id);
              return (
                <div key={book.book_id}>
                  <div className="relative cursor-pointer outline-none focus:outline-none">
                    <Link to={`/books/${slug}`} className="block">
                      <div
                        className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden border border-gray-700/40 transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/10"
                        title={book.title || "Không có tiêu đề"}
                      >
                        <div className="relative h-[300px] md:h-[350px] lg:h-[400px] overflow-hidden rounded-t-lg">
                          <img
                            src={
                              book.cover_image || "/placeholder-image-dark.jpg"
                            }
                            alt={book.title || "Không có tiêu đề"}
                            className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                            loading="lazy"
                          />
                        </div>

                        <div className="p-4 space-y-2 bg-gradient-to-t from-black/50 to-transparent absolute bottom-0 left-0 right-0 rounded-b-lg">
                          <h3 className="text-lg lg:text-xl font-bold font-poppins text-white truncate transition-colors duration-300 hover:text-emerald-300 drop-shadow-md">
                            {book.title || "Không có tiêu đề"}
                          </h3>
                          <p className="text-gray-300 text-sm truncate flex items-center font-medium transition-colors duration-300">
                            <FontAwesomeIcon
                              icon={faPenNib}
                              className="mr-2 text-gray-500 transition-colors duration-300 flex-shrink-0"
                            />
                            <span className="truncate">
                              {book.author || "Không rõ tác giả"}
                            </span>
                          </p>
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
        <div className="text-center py-8">
          <FontAwesomeIcon
            icon={faBookOpen}
            className="text-lightGreen text-2xl mb-2"
          />
          <p className="text-base text-gray-400">
            Hiện chưa có sách nào để hiển thị.
          </p>
        </div>
      )}
    </section>
  );
};

export default LiveShow;
