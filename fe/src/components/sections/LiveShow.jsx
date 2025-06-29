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
  faStar,
} from "@fortawesome/free-solid-svg-icons";

const LiveShow = () => {
  const { books, loading, error } = useBook();

  const featuredBooks = useMemo(() => {
    if (!books || !Array.isArray(books) || books.length === 0) {
      return [];
    }

    // Lọc các sách có dữ liệu hợp lệ
    const validBooks = books.filter((book) => book && book.book_id);
    if (validBooks.length === 0) return [];

    // Ưu tiên sách có cover image
    const booksWithCovers = validBooks.filter((book) => book.cover_image);
    const booksWithoutCovers = validBooks.filter((book) => !book.cover_image);

    // Shuffle và kết hợp
    const shuffledWithCovers = [...booksWithCovers].sort(
      () => 0.5 - Math.random()
    );
    const shuffledWithoutCovers = [...booksWithoutCovers].sort(
      () => 0.5 - Math.random()
    );
    const combinedBooks = [...shuffledWithCovers, ...shuffledWithoutCovers];

    // Lấy tối đa 10 sách cho carousel
    const count = Math.min(10, combinedBooks.length);
    return combinedBooks.slice(0, count);
  }, [books]);

  const slidesToShow = Math.min(4, featuredBooks.length);

  const settings = {
    dots: true,
    infinite: featuredBooks.length > slidesToShow,
    speed: 500,
    slidesToShow: slidesToShow > 0 ? slidesToShow : 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    centerMode: false,
    cssEase: "ease-in-out",
    dotsClass: "slick-dots library-carousel-dots",
    arrows: false,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(3, featuredBooks.length || 1),
          infinite: featuredBooks.length > 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, featuredBooks.length || 1),
          infinite: featuredBooks.length > 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          infinite: featuredBooks.length > 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <section className="relative mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 bg-library-background overflow-hidden">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <FontAwesomeIcon
            icon={faStar}
            className="text-library-primary mr-2 w-6 h-6"
          />
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-library-text-primary">
            Sách Nổi Bật
          </h2>
          <FontAwesomeIcon
            icon={faStar}
            className="text-library-primary ml-2 w-6 h-6"
          />
        </div>
        <p className="text-library-text-secondary text-lg max-w-2xl mx-auto">
          Khám phá những cuốn sách được tuyển chọn đặc biệt từ bộ sưu tập thư
          viện
        </p>
      </div>

      <style>{`
        .library-carousel-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        
        .library-carousel-dots li {
          margin: 0 4px;
        }
        
        .library-carousel-dots li button {
          border: none;
          background: transparent;
          cursor: pointer;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          padding: 0;
          transition: all 0.3s ease;
        }
        
        .library-carousel-dots li button:before {
          content: '';
          display: block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #D1D5DB;
          transition: all 0.3s ease;
        }
        
        .library-carousel-dots li.slick-active button:before {
          background-color: #2563EB;
          transform: scale(1.2);
        }
        
        .library-carousel-dots li:hover button:before {
          background-color: #2563EB;
          opacity: 0.7;
        }
        
        .slick-slide {
          padding: 0 8px;
        }
        
        .slick-list {
          margin: 0 -8px;
        }
        
        .book-card {
          transition: all 0.3s ease;
        }
        
        .book-card:hover {
          transform: translateY(-8px);
        }
      `}</style>

      {loading ? (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-library-primary text-3xl mb-4"
          />
          <p className="text-library-text-secondary text-lg">
            Đang tải sách nổi bật...
          </p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-library-error text-lg">
            Đã xảy ra lỗi khi tải sách. Vui lòng thử lại sau.
          </p>
        </div>
      ) : featuredBooks && featuredBooks.length > 0 ? (
        <div className="max-w-7xl mx-auto">
          <Slider {...settings}>
            {featuredBooks.map((book) => {
              const slug = generateSlug(book.book_id);
              return (
                <div key={book.book_id}>
                  <Link to={`/books/${slug}`} className="block">
                    <div
                      className="book-card card-library p-0 overflow-hidden group cursor-pointer"
                      title={book.title || "Không có tiêu đề"}
                    >
                      {/* Book Cover */}
                      <div className="relative h-[280px] md:h-[320px] overflow-hidden">
                        <img
                          src={
                            book.cover_image || "/public/uploads/coverBook.jpg"
                          }
                          alt={book.title || "Không có tiêu đề"}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/public/uploads/coverBook.jpg";
                          }}
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Status Badge */}
                        {book.status === "available" && (
                          <div className="absolute top-3 right-3 bg-library-success text-white px-2 py-1 rounded-library text-xs font-medium">
                            Có sẵn
                          </div>
                        )}
                      </div>

                      {/* Book Info */}
                      <div className="p-4 space-y-3">
                        <h3 className="font-heading font-semibold text-library-text-primary text-lg leading-tight line-clamp-2 group-hover:text-library-primary transition-colors duration-200">
                          {book.title || "Không có tiêu đề"}
                        </h3>

                        <div className="flex items-center text-library-text-muted text-sm">
                          <FontAwesomeIcon
                            icon={faPenNib}
                            className="mr-2 w-3 h-3 flex-shrink-0"
                          />
                          <span className="truncate">
                            {book.author || "Không rõ tác giả"}
                          </span>
                        </div>

                        {/* Categories */}
                        {book.categories && book.categories.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {book.categories
                              .slice(0, 2)
                              .map((category, index) => (
                                <span
                                  key={index}
                                  className="bg-library-primary/10 text-library-primary px-2 py-1 rounded text-xs font-medium"
                                >
                                  {category.name}
                                </span>
                              ))}
                            {book.categories.length > 2 && (
                              <span className="text-library-text-muted text-xs">
                                +{book.categories.length - 2} thể loại khác
                              </span>
                            )}
                          </div>
                        )}

                        {/* Available Copies */}
                        {book.available_copies !== undefined && (
                          <div className="flex items-center justify-between text-xs text-library-text-muted">
                            <span>Số lượng có sẵn:</span>
                            <span
                              className={`font-semibold ${
                                book.available_copies > 0
                                  ? "text-library-success"
                                  : "text-library-error"
                              }`}
                            >
                              {book.available_copies} cuốn
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
        </div>
      ) : (
        <div className="text-center py-12">
          <FontAwesomeIcon
            icon={faBookOpen}
            className="text-library-text-muted text-4xl mb-4"
          />
          <p className="text-library-text-secondary text-lg">
            Hiện chưa có sách nào để hiển thị.
          </p>
        </div>
      )}
    </section>
  );
};

export default LiveShow;
