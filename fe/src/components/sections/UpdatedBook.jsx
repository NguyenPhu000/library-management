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
  faNewspaper,
  faPlus,
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

        // Sắp xếp theo ngày cập nhật mới nhất
        const sortedBooks =
          validBooks.length > 0
            ? [...validBooks].sort(
                (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
              )
            : [];

        setBooks(sortedBooks.slice(0, 8)); // Giảm xuống 8 sách để layout đẹp hơn
      } catch (error) {
        console.error("❌ Lỗi khi lấy sách:", error);
        setError("Không thể tải sách");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "Không rõ ngày";

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Hôm nay";
    } else if (diffDays === 1) {
      return "Hôm qua";
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    }
  };

  return (
    <section className="py-16 md:py-20 bg-library-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FontAwesomeIcon
              icon={faNewspaper}
              className="text-library-primary mr-3 w-6 h-6"
            />
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-library-text-primary">
              Sách Mới Cập Nhật
            </h2>
          </div>
          <p className="text-library-text-secondary text-lg max-w-2xl mx-auto">
            Những cuốn sách vừa được thêm mới hoặc cập nhật gần đây trong thư
            viện
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-library-primary text-3xl mb-4"
            />
            <p className="text-library-text-secondary text-lg">
              Đang tải sách mới cập nhật...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-library-error text-3xl mb-4"
            />
            <p className="text-library-error text-lg">
              Đã xảy ra lỗi khi tải sách. Vui lòng thử lại sau.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
            {books && books.length > 0 ? (
              books.map((book) => {
                if (!book || !book.book_id) return null;

                const slug = generateSlug(book.book_id);
                return (
                  <div key={book.book_id} className="h-full">
                    <Link to={`/books/${slug}`} className="block h-full group">
                      <div className="card-library h-full p-0 overflow-hidden transition-all duration-300 group-hover:shadow-library-book group-hover:-translate-y-2">
                        {/* Book Cover */}
                        <div className="relative overflow-hidden aspect-[3/4]">
                          <img
                            src={
                              book.cover_image ||
                              "/public/uploads/coverBook.jpg"
                            }
                            alt={book.title || "Không có tiêu đề"}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = "/public/uploads/coverBook.jpg";
                            }}
                          />

                          {/* New Badge */}
                          <div className="absolute top-2 left-2 bg-library-success text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                            <FontAwesomeIcon
                              icon={faPlus}
                              className="mr-1 w-3 h-3"
                            />
                            Mới
                          </div>

                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-library-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Book Info */}
                        <div className="p-4 flex flex-col flex-grow">
                          <h3
                            className="font-heading font-semibold text-library-text-primary text-base leading-tight mb-2 line-clamp-2 group-hover:text-library-primary transition-colors duration-200"
                            title={book.title || "Không có tiêu đề"}
                          >
                            {book.title || "Không có tiêu đề"}
                          </h3>

                          <div className="flex items-center text-library-text-muted text-sm mb-3">
                            <FontAwesomeIcon
                              icon={faPenNib}
                              className="mr-2 w-3 h-3 flex-shrink-0"
                            />
                            <span
                              className="truncate"
                              title={book.author || "Không rõ tác giả"}
                            >
                              {book.author || "Không rõ tác giả"}
                            </span>
                          </div>

                          {/* Status */}
                          {book.status && (
                            <div className="mb-3">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-library text-xs font-medium ${
                                  book.status === "available"
                                    ? "bg-library-success/10 text-library-success"
                                    : "bg-library-error/10 text-library-error"
                                }`}
                              >
                                {book.status === "available"
                                  ? "Có sẵn"
                                  : "Hết sách"}
                              </span>
                            </div>
                          )}

                          {/* Update Date */}
                          <div className="mt-auto pt-3 border-t border-library-border flex items-center text-library-text-muted text-xs">
                            <FontAwesomeIcon
                              icon={faClock}
                              className="mr-2 w-3 h-3 flex-shrink-0"
                            />
                            <span>{formatDate(book.updated_at)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            ) : (
              <div className="text-center col-span-full py-12">
                <FontAwesomeIcon
                  icon={faBookOpen}
                  className="text-library-text-muted text-4xl mb-4"
                />
                <p className="text-library-text-secondary text-lg">
                  Hiện chưa có sách nào được cập nhật gần đây.
                </p>
              </div>
            )}
          </div>
        )}

        {/* View All Button */}
        {books.length > 0 && (
          <div className="text-center mt-12">
            <Link
              to="/books"
              className="btn-library-primary inline-flex items-center"
            >
              <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
              Xem tất cả sách
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpdatedBook;
