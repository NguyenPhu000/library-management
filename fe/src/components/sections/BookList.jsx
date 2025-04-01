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
} from "@fortawesome/free-solid-svg-icons";

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

const BookList = ({ books, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <motion.section
        className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8 px-4 py-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <motion.p
            className="text-center col-span-full text-white text-2xl flex items-center justify-center space-x-3 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-lightGreen text-4xl"
            />
            <span className="font-semibold text-gray-300">
              Đang tải sách...
            </span>
          </motion.p>
        ) : currentBooks.length > 0 ? (
          currentBooks.map((book) => {
            const slug = generateSlug(book.book_id);
            return (
              <motion.div
                key={book.book_id}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  scale: 1.03,
                  boxShadow: "0px 10px 20px rgba(0, 255, 150, 0.2)",
                }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full"
              >
                <Link to={`/books/${slug}`} className="block h-full">
                  <div
                    className="relative flex flex-col h-full bg-gray-800 rounded-lg shadow-lg overflow-hidden
                               group transition duration-300 ease-in-out border border-transparent hover:border-teal-500/50 cursor-pointer"
                  >
                    <div className="relative overflow-hidden aspect-[3/4]">
                      {" "}
                      <img
                        src={book.cover_image}
                        alt={book.title || "Bìa sách"}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
                      <div
                        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)]
                                 bg-[length:250%_250%] bg-[position:-100%_-100%] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:200%_200%] group-hover:duration-[1200ms]"
                      ></div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      {" "}
                      <h3
                        className="text-md font-semibold text-white mb-1 line-clamp-2"
                        title={book.title || "Không có tiêu đề"}
                      >
                        {book.title || "Không có tiêu đề"}
                      </h3>
                      <p
                        className="text-gray-400 text-xs mb-2 flex items-center"
                        title={book.author || "Không rõ tác giả"}
                      >
                        <FontAwesomeIcon
                          icon={faPenNib}
                          className="mr-1.5 w-3 h-3 flex-shrink-0"
                        />
                        <span className="truncate">
                          {" "}
                          {book.author || "Không rõ tác giả"}
                        </span>
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <motion.p
            className="text-center col-span-full text-gray-400 text-xl flex items-center justify-center space-x-3 py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon
              icon={faBookOpen}
              className="text-lightGreen text-4xl"
            />
            <span className="font-semibold">Không tìm thấy sách phù hợp.</span>
          </motion.p>
        )}
      </motion.section>

      {books.length > itemsPerPage && (
        <motion.div
          className="mt-8 mb-12 flex justify-center"
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
