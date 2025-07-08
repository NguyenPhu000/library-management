import React, { useEffect, useState } from "react";
import bookService from "../../services/bookservice";
import { Link } from "react-router-dom";
import { generateSlug } from "../../utils/slugify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faPenNib,
  faSpinner,
  faBookOpen,
  faExclamationTriangle,
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
    <section className="updated-book-section relative mx-auto px-4 py-12 md:py-16 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden">
      <h2 className="relative z-10 text-2xl md:text-3xl font-bold font-poppins text-center bg-gradient-to-r from-emerald-300 to-lightGreen text-transparent bg-clip-text mb-8 uppercase">
        Sách Mới Cập Nhật
      </h2>

      {loading ? (
        <div className="text-center py-8">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-lightGreen text-2xl mb-2"
          />
          <p className="text-base text-gray-300">Đang tải sách mới...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-red-400 text-2xl mb-2"
          />
          <p className="text-base text-red-400">
            Đã xảy ra lỗi khi tải sách. Vui lòng thử lại sau.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
          {books && books.length > 0 ? (
            books.map((book) => {
              if (!book || !book.book_id) return null;

              const slug = generateSlug(book.book_id);
              return (
                <div key={book.book_id} className="h-full">
                  <Link to={`/books/${slug}`} className="block h-full">
                    <div
                      className="relative flex flex-col h-full bg-gray-800 rounded-lg shadow-md overflow-hidden
                               transition duration-300 ease-in-out border border-gray-700/50 hover:border-emerald-500/50 cursor-pointer"
                    >
                      <div className="relative overflow-hidden aspect-[3/4]">
                        <img
                          src={
                            book.cover_image ||
                            "https://via.placeholder.com/150"
                          }
                          alt={book.title || "Không có tiêu đề"}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70"></div>
                      </div>
                      <div className="p-3 flex flex-col flex-grow">
                        <h3
                          className="text-sm font-semibold text-white mb-1 line-clamp-2"
                          title={book.title || "Không có tiêu đề"}
                        >
                          {book.title || "Không có tiêu đề"}
                        </h3>
                        <p className="text-gray-400 text-xs mb-2 flex items-center">
                          <FontAwesomeIcon
                            icon={faPenNib}
                            className="mr-1.5 w-3 h-3 flex-shrink-0"
                          />
                          <span
                            className="truncate"
                            title={book.author || "Không rõ tác giả"}
                          >
                            {book.author || "Không rõ tác giả"}
                          </span>
                        </p>
                        <div className="mt-auto pt-2 border-t border-gray-700/50 flex items-center justify-start text-gray-500 text-xs">
                          <FontAwesomeIcon
                            icon={faClock}
                            className="mr-1.5 w-3 h-3 flex-shrink-0"
                          />
                          <span>
                            {book.updated_at
                              ? new Date(book.updated_at).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "Không rõ ngày cập nhật"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="text-center col-span-full py-8">
              <FontAwesomeIcon
                icon={faBookOpen}
                className="text-lightGreen text-2xl mb-2"
              />
              <p className="text-base text-gray-400">
                Hiện chưa có sách nào được cập nhật gần đây.
              </p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default UpdatedBook;
