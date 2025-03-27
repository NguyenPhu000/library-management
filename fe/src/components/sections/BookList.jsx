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

const BookList = ({ books, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const indexOfLastBook = currentPage * itemsPerPage;
  const indexOfFirstBook = indexOfLastBook - itemsPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <motion.section
        className="container mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-4 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delayChildren: 0.3, staggerChildren: 0.1 }}
      >
        {loading ? (
          <motion.p
            className="text-center col-span-full text-white text-2xl flex items-center justify-center space-x-2 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-lightGreen text-3xl"
            />
            <span className="font-semibold">Đang tải sách...</span>
          </motion.p>
        ) : currentBooks.length > 0 ? (
          currentBooks.map((book) => {
            const slug = generateSlug(book.book_id);
            return (
              <motion.div
                key={book.book_id}
                className="motion-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Link to={`/books/${slug}`}>
                  <motion.div
                    className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden group hover:shadow-2xl cursor-pointer transform-gpu hover:-rotate-2 hover:translate-y-1 transition duration-300 ease-in-out border-2 border-gray-700"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative overflow-hidden">
                      <motion.img
                        src={book.cover_image}
                        alt={book.title || "Không có tiêu đề"}
                        className="w-full h-80 object-cover rounded-t-lg"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                      <div
                        className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,transparent_25%,rgba(255,255,255,.2)_50%,transparent_75%,transparent_100%)]
                                          bg-[length:250%_250%] bg-[position:-100%_-100%] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:200%_200%] group-hover:duration-[1500ms]"
                      ></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {book.title || "Không có tiêu đề"}
                      </h3>
                      <p className="text-gray-400 text-sm truncate flex items-center font-semibold mt-1">
                        <FontAwesomeIcon icon={faPenNib} className="mr-2" />
                        {book.author || "Không rõ tác giả"}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })
        ) : (
          <motion.p
            className="text-center col-span-full text-white text-2xl flex items-center justify-center space-x-2 py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon
              icon={faBookOpen}
              className="text-lightGreen text-3xl"
            />
            <span className="font-semibold">
              Không có sách nào trong danh mục này.
            </span>
          </motion.p>
        )}
      </motion.section>
      {books.length > itemsPerPage && (
        <motion.div
          className="mt-6 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
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
