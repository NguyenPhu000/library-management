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
        setBooks(sortedBooks.slice(0, 10));
      } catch (error) {
        console.error("❌ Lỗi khi lấy sách:", error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      className="updated-book-section relative mx-auto px-4 py-24 md:py-32 bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white overflow-hidden"
      initial="hidden"
      animate="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <motion.h2 className="relative z-10 text-4xl md:text-5xl font-bold font-poppins text-center bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-500 text-transparent bg-clip-text mb-16 uppercase">
        📚 Sách Mới Cập Nhật 📚
      </motion.h2>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {books.length > 0 ? (
          books.map((book) => {
            const slug = generateSlug(book.book_id);
            return (
              <motion.div
                key={book.book_id}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  scale: 1.03,
                  boxShadow: "0px 10px 20px rgba(52, 211, 153, 0.3)",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full"
              >
                <Link to={`/books/${slug}`} className="block h-full">
                  <div
                    className="relative flex flex-col h-full bg-gray-800 rounded-2xl shadow-lg overflow-hidden
                               group transition duration-300 ease-in-out border border-gray-700/50 hover:border-emerald-500/80 cursor-pointer"
                  >
                    <div className="relative overflow-hidden aspect-[3/4]">
                      <img
                        src={book.cover_image}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                      <div
                        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)]
                                 bg-[length:250%_250%] bg-[position:-100%_-100%] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:200%_200%] group-hover:duration-[1200ms]"
                      ></div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3
                        className="text-md font-semibold text-white mb-1 line-clamp-2"
                        title={book.title}
                      >
                        {book.title}
                      </h3>
                      <p className="text-gray-400 text-xs mb-2 flex items-center">
                        <FontAwesomeIcon
                          icon={faPenNib}
                          className="mr-1.5 w-3 h-3 flex-shrink-0"
                        />
                        <span className="truncate" title={book.author}>
                          {book.author}
                        </span>
                      </p>
                      <div className="mt-auto pt-2 border-t border-gray-700/50 flex items-center justify-start text-gray-500 text-xs">
                        <FontAwesomeIcon
                          icon={faClock}
                          className="mr-1.5 w-3 h-3 flex-shrink-0"
                        />
                        <span>
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
          <p className="text-center col-span-full text-gray-400 text-lg py-10">
            📚 Chưa có cuốn sách mới nào được cập nhật gần đây. Mời bạn quay lại
            sau nhé! 📚
          </p>
        )}
      </motion.div>
    </motion.section>
  );
};

export default UpdatedBook;
