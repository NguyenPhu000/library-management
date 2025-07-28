import React, { useEffect, useState } from "react";
import bookService from "../../services/bookservice";
import { Link } from "react-router-dom";
import { generateSlug } from "../../utils/slugify";
import { formatCoverImage } from "../../utils/imageHelper";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPenNib,
  faSpinner,
  faBookOpen,
  faExclamationTriangle,
  faFire,
  faNewspaper,
  faStar,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const UpdatedBook = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookService.getBooks();

        if (!response || !response.books || !Array.isArray(response.books)) {
          console.warn("Dữ liệu sách không hợp lệ:", response);
          setBooks([]);
          return;
        }

        // Lọc bỏ sách không hợp lệ
        const validBooks = response.books.filter(
          (book) => book && book.book_id
        );

        const sortedBooks =
          validBooks.length > 0
            ? [...validBooks].sort(
                (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
              )
            : [];

        setBooks(sortedBooks.slice(0, 10));
      } catch (error) {
        console.error("❌ Lỗi khi lấy sách:", error);
        setError("Không thể tải sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-b from-gray-950 via-slate-900 to-gray-950 text-white overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 filter blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-[#93DA97]/20 to-[#E8FFD7]/20 filter blur-3xl animate-pulse delay-1000" />

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 animate-bounce delay-300">
        <FontAwesomeIcon
          icon={faNewspaper}
          className="text-[#93DA97] text-2xl opacity-40"
        />
      </div>
      <div className="absolute top-32 right-32 animate-bounce delay-700">
        <FontAwesomeIcon
          icon={faFire}
          className="text-[#E8FFD7] text-xl opacity-30"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-gradient-to-r from-[#3E5F44]/20 to-[#5E936C]/20 backdrop-blur-sm border border-[#93DA97]/30 rounded-full px-6 py-3 mb-6 text-sm font-medium text-[#E8FFD7]">
            <FontAwesomeIcon icon={faFire} className="mr-2 text-[#93DA97]" />
            Cập nhật liên tục
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-[#E8FFD7] via-[#93DA97] to-[#5E936C] text-transparent bg-clip-text">
              Sách Mới Cập Nhật
            </span>
          </h2>

          <p className="text-xl text-gray-300/90 max-w-3xl mx-auto leading-relaxed">
            Khám phá những cuốn sách được cập nhật mới nhất trong thư viện với
            nội dung phong phú
          </p>
        </div>

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
              Đang tải sách mới cập nhật...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 text-center max-w-md">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
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
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {books && books.length > 0 ? (
              books.map((book, index) => {
                if (!book || !book.book_id) return null;

                const slug = generateSlug(book.book_id);
                const isNew = index < 3; // First 3 books are marked as "new"

                return (
                  <div key={book.book_id} className="group">
                    <Link to={`/books/${slug}`} className="block">
                      <div className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl border border-gray-700/40 hover:border-[#93DA97]/60 transition-all duration-500 hover:scale-105 hover:shadow-[#93DA97]/20">
                        {/* New Badge */}
                        {isNew && (
                          <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-[#93DA97] to-[#E8FFD7] text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                            <FontAwesomeIcon
                              icon={faFire}
                              className="text-xs"
                            />
                            <span>MỚI</span>
                          </div>
                        )}

                        {/* Heart Icon */}
                        <div className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FontAwesomeIcon
                            icon={faHeart}
                            className="text-[#93DA97] text-xs"
                          />
                        </div>

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
                        </div>

                        {/* Content */}
                        <div className="p-4">
                          <h3 className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-[#93DA97] transition-colors duration-300">
                            {book.title || "Không có tiêu đề"}
                          </h3>

                          <p className="text-gray-400 text-sm mb-3 flex items-center">
                            <FontAwesomeIcon
                              icon={faPenNib}
                              className="mr-2 text-gray-500 flex-shrink-0"
                            />
                            <span className="truncate">
                              {book.author || "Không rõ tác giả"}
                            </span>
                          </p>

                          {/* Stats Row */}
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon
                                icon={faStar}
                                className="text-[#93DA97]"
                              />
                              <span>{(Math.random() * 2 + 3).toFixed(1)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FontAwesomeIcon icon={faClock} />
                              <span>
                                {book.updated_at
                                  ? new Date(
                                      book.updated_at
                                    ).toLocaleDateString("vi-VN")
                                  : "N/A"}
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full bg-gray-700 rounded-full h-1 mb-3">
                            <div
                              className="bg-gradient-to-r from-[#5E936C] to-[#93DA97] h-1 rounded-full transition-all duration-1000"
                              style={{ width: `${Math.random() * 60 + 20}%` }}
                            ></div>
                          </div>

                          {/* Action Button */}
                          <button className="w-full bg-gradient-to-r from-[#3E5F44] to-[#5E936C] hover:from-[#5E936C] hover:to-[#93DA97] text-white py-2 rounded-lg text-sm font-medium transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
                            Đọc ngay
                          </button>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-32">
                <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto border border-gray-700/40">
                  <FontAwesomeIcon
                    icon={faBookOpen}
                    className="text-[#93DA97] text-6xl mb-6 opacity-60"
                  />
                  <h3 className="text-2xl font-semibold text-gray-300 mb-4">
                    Chưa có sách mới
                  </h3>
                  <p className="text-gray-400">
                    Hệ thống đang được cập nhật với nhiều cuốn sách mới.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default UpdatedBook;
