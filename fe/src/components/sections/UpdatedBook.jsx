import React, { useEffect, useState } from "react";
import bookService from "../../services/bookservice";
import { Link } from "react-router-dom";
import { generateSlug } from "../../utils/slugify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faPenNib } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const UpdatedBook = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await bookService.getBooks();

        const sortedBooks = response.books
          ? [...response.books].sort(
              (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
            )
          : [];

        setBooks(sortedBooks.slice(0, 10)); // Hiển thị tối đa 10 cuốn mới nhất
      } catch (error) {
        console.error("❌ Lỗi khi lấy sách:", error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section className="container mx-auto px-4 py-20 bg-gray-900 text-white text-center">
      <h2 className="text-4xl font-bold font-poppins bg-gradient-to-r from-white via-gray-400 to-green-400 text-transparent bg-clip-text mb-12 col-span-full">
        Sách Mới Cập Nhật
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {books.length > 0 ? (
          books.map((book) => {
            const slug = generateSlug(book.book_id);
            return (
              <motion.div
                key={book.book_id}
                className="p-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Link to={`/books/${slug}`}>
                  <div
                    className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden
                               group hover:shadow-2xl transition duration-300 cursor-pointer"
                  >
                    {/* Ảnh bìa với hiệu ứng sáng bóng */}
                    <div className="relative overflow-hidden">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Hiệu ứng sáng bóng di chuyển từ trái trên xuống */}
                      <div
                        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,.3)_50%,transparent_75%,transparent_100%)]
                                 bg-[length:250%_250%] bg-[position:-100%_-100%] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:200%_200%] group-hover:duration-[1500ms]"
                      ></div>
                    </div>

                    {/* Nội dung sách */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {book.title}
                      </h3>
                      <p className="text-gray-400 text-sm truncate flex items-center justify-center">
                        <FontAwesomeIcon icon={faPenNib} className="mr-1" />
                        {book.author}
                      </p>

                      {/* Thông tin bổ sung (ngày cập nhật) */}
                      <div className="mt-2 flex items-center justify-between text-gray-400 text-sm">
                        <span>
                          <FontAwesomeIcon icon={faClock} className="mr-1" />
                          Cập nhật:{" "}
                          {new Date(book.updated_at).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <p className="text-center col-span-full text-white text-lg">
            📚 Không có sách mới nào...
          </p>
        )}
      </div>
    </section>
  );
};

export default UpdatedBook;
