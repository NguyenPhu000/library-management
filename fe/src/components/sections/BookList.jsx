import React, { useState } from "react";
import Pagination from "../common/Pagination";
import { Link } from "react-router-dom";
import { generateSlug } from "../../utils/slugify";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faBookOpen,
  faPenNib,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
      stiffness: 120,
      damping: 20,
    },
  },
};

const BookList = ({ books, loading, error }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books
    ? books.slice(indexOfFirstBook, indexOfLastBook)
    : [];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <motion.section
        className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8 px-4 py-8 md:py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-library-primary text-4xl mb-4"
            />
            <p className="text-library-text-secondary text-lg font-medium">
              Đang tải sách...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-library-error text-4xl mb-4"
            />
            <p className="text-library-text-primary text-xl font-semibold mb-2">
              Đã xảy ra lỗi khi tải sách
            </p>
            <p className="text-library-text-secondary">
              Vui lòng thử lại sau hoặc liên hệ hỗ trợ
            </p>
          </motion.div>
        ) : currentBooks && currentBooks.length > 0 ? (
          currentBooks.map((book) => {
            const slug = generateSlug(book.book_id);
            return (
              <motion.div
                key={book.book_id}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                className="h-full"
              >
                <Link to={`/books/${slug}`} className="block h-full group">
                  <div className="card-library-book h-full flex flex-col overflow-hidden">
                    {/* Book Cover */}
                    <div className="relative overflow-hidden aspect-[3/4] bg-library-border">
                      <img
                        src={book.cover_image}
                        alt={book.title || "Bìa sách"}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = "/public/uploads/coverBook.jpg";
                        }}
                      />

                      {/* Subtle overlay on hover */}
                      <div className="absolute inset-0 bg-library-primary/0 group-hover:bg-library-primary/5 transition-colors duration-300"></div>
                    </div>

                    {/* Book Info */}
                    <div className="p-4 flex flex-col flex-grow">
                      <h3
                        className="text-library-heading text-sm md:text-base font-semibold mb-2 line-clamp-2 leading-tight"
                        title={book.title || "Không có tiêu đề"}
                      >
                        {book.title || "Không có tiêu đề"}
                      </h3>

                      <div className="flex items-center text-library-caption mb-1">
                        <FontAwesomeIcon
                          icon={faPenNib}
                          className="mr-1.5 w-3 h-3 flex-shrink-0 text-library-text-muted"
                        />
                        <span
                          className="truncate text-library-text-muted"
                          title={book.author || "Không rõ tác giả"}
                        >
                          {book.author || "Không rõ tác giả"}
                        </span>
                      </div>

                      {/* Optional: Publication year or category */}
                      {book.publication_year && (
                        <div className="text-xs text-library-text-muted mt-auto">
                          {book.publication_year}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <motion.div
            className="col-span-full flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon
              icon={faBookOpen}
              className="text-library-primary text-5xl mb-4"
            />
            <p className="text-library-text-primary text-xl font-semibold mb-2">
              Chưa có sách nào
            </p>
            <p className="text-library-text-secondary">
              Vui lòng quay lại sau khi thư viện đã cập nhật sách mới
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Pagination với library styling */}
      {books && books.length > itemsPerPage && (
        <motion.div
          className="mt-8 mb-12 flex justify-center px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Pagination
            totalItems={books.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </motion.div>
      )}
    </>
  );
};

export default BookList;
