import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import bookService from "../../services/bookservice";
import { getBookIdFromSlug } from "../../utils/slugify";
import { motion } from "framer-motion";
import { useLoan } from "../../contexts/LoanContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCircleCheck,
  faCircleXmark,
  faArrowLeft,
  faBookOpen,
} from "@fortawesome/free-solid-svg-icons";

const BookDetail = () => {
  const { slug } = useParams();
  const book_id = getBookIdFromSlug(slug);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { borrowBook, borrowLoading, borrowError } = useLoan();

  useEffect(() => {
    const fetchBook = async () => {
      if (!book_id) return;
      setLoading(true);
      const response = await bookService.getBookById(book_id);
      setBook(response.book);
      setLoading(false);
    };
    fetchBook();
  }, [book_id]);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.2,
      rotateY: [0, 30, -30, 30, 0],
      transition: { duration: 0.7 },
      boxShadow: "0 45px 45px rgba(255, 255, 255, 0.3)",
    },
  };

  if (loading) {
    return (
      <motion.div
        className="bg-[#12181B] min-h-screen flex justify-center items-center"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <p className="text-center text-white text-xl font-semibold animate-pulse">
          <FontAwesomeIcon icon={faSpinner} spin className="mr-2" /> Đang tải
          sách...
        </p>
      </motion.div>
    );
  }

  if (!book) {
    return (
      <motion.div
        className="bg-[#12181B] min-h-screen flex justify-center items-center"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <p className="text-center text-white text-xl font-semibold">
          <FontAwesomeIcon icon={faCircleXmark} className="mr-2" /> Sách không
          tồn tại!
        </p>
      </motion.div>
    );
  }

  const handleBorrowClick = async () => {
    if (!book) return;
    try {
      await borrowBook(book_id);
      console.log("Mượn sách thành công cho sách ID:", book_id);
    } catch (error) {
      console.error("Lỗi khi mượn sách:", error);
    }
  };

  return (
    <motion.div
      className="bg-[#0F172A] min-h-screen py-8"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-[#1E293B] rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-800"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="p-10">
            <motion.div className="mb-8">
              <Link
                to="/books"
                className="inline-block text-gray-400 hover:text-lightGreen transition duration-300 text-lg"
              >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" /> Về trang
                sách
              </Link>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
              {/* Phần bên trái: Ảnh bìa */}
              <motion.div className="md:col-span-4 flex justify-center group relative overflow-hidden">
                <motion.img
                  src={book.cover_image}
                  alt={book.title || "Không có tiêu đề"}
                  className="w-full rounded-2xl shadow-xl border-4 border-gray-800 object-cover"
                  variants={imageVariants}
                  whileHover="hover"
                />
                {/* Hiệu ứng sáng bóng di chuyển từ trái trên xuống */}
                <div
                  className="absolute inset-0 overflow-hidden bg-[linear-gradient(135deg,transparent_30%,rgba(255,255,255,.2)_60%,transparent_70%,transparent_100%)]
                                    bg-[length:150%_150%] bg-[position:-50%_-50%] bg-no-repeat transition-[background-position_0s_ease] group-hover:bg-[position:150%_150%] group-hover:duration-[1000ms]"
                ></div>
              </motion.div>

              {/* Phần bên phải: Thông tin chính */}
              <div className="md:col-span-8 text-white">
                <motion.h1 className="text-4xl md:text-5xl font-bold mb-4 text-lightGreen text-shadow-md">
                  {book.title || "Không có tiêu đề"}
                </motion.h1>
                <motion.p className="text-gray-300 text-xl mb-2">
                  Tác giả:{" "}
                  <span className="text-lightGreen font-semibold text-shadow-sm">
                    {book.author || "Không rõ tác giả"}
                  </span>
                </motion.p>

                {book.status && (
                  <motion.p
                    className={`text-lg font-semibold mb-6 ${
                      book.status === "available"
                        ? "text-[#A0F080]"
                        : "text-red-500"
                    }`}
                  >
                    {book.status === "available" ? (
                      <>
                        <FontAwesomeIcon
                          icon={faCircleCheck}
                          className="mr-2 text-[#A0F080]"
                        />{" "}
                        <span className="text-shadow-sm">Còn Sách</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="mr-2 text-red-500"
                        />{" "}
                        <span className="text-shadow-sm">Hết Sách</span>
                      </>
                    )}
                  </motion.p>
                )}
                {book.description && (
                  <motion.p className="text-gray-300 leading-relaxed mb-8 text-lg">
                    {book.description.substring(0, 250)}...
                  </motion.p>
                )}
                <motion.button
                  className="bg-lightGreen hover:bg-[#98FB98] text-[#1E293B] font-bold py-4 px-8 rounded-lg shadow-md hover:shadow-lg text-xl"
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBorrowClick}
                  disabled={borrowLoading}
                >
                  {borrowLoading ? "Đang mượn..." : "Mượn Sách"}
                </motion.button>
                {borrowError && (
                  <motion.p className="text-red-500 mt-3 text-lg text-shadow-sm">
                    {borrowError}
                  </motion.p>
                )}

                <motion.section className="py-8 md:py-10 border-t border-gray-700 mt-8">
                  <motion.h2 className="text-2xl font-semibold mb-5 text-lightGreen text-shadow-md">
                    Thông tin chi tiết
                  </motion.h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg text-gray-400">
                    {book.publication_year && (
                      <div>
                        <span className="font-semibold text-gray-300 text-shadow-sm">
                          Năm xuất bản:
                        </span>{" "}
                        <span className="text-lightGreen text-shadow-sm">
                          {book.publication_year}
                        </span>
                      </div>
                    )}
                    {book.publisher && (
                      <div>
                        <span className="font-semibold text-gray-300 text-shadow-sm">
                          Nhà xuất bản:
                        </span>{" "}
                        <span className="text-lightGreen text-shadow-sm">
                          {book.publisher}
                        </span>
                      </div>
                    )}
                    {book.genre && (
                      <div>
                        <span className="font-semibold text-gray-300 text-shadow-sm">
                          Thể loại:
                        </span>{" "}
                        <span className="text-lightGreen text-shadow-sm">
                          {book.genre}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-gray-300 text-shadow-sm">
                        ISBN:
                      </span>{" "}
                      <span className="text-lightGreen text-shadow-sm">
                        978-1234567890
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-300 text-shadow-sm">
                        Định dạng:
                      </span>{" "}
                      <span className="text-lightGreen text-shadow-sm">
                        Bìa mềm
                      </span>
                    </div>
                  </div>
                </motion.section>
              </div>
            </div>
            {/* Phần mô tả đầy đủ */}
            {book.description && (
              <motion.section className="py-8 md:py-10 border-t border-gray-700 text-white">
                <motion.div className="px-8 md:px-10">
                  <motion.h2 className="text-2xl font-semibold mb-5 text-lightGreen text-shadow-md">
                    Mô tả sách
                  </motion.h2>
                  <motion.p className="text-gray-300 leading-relaxed text-lg">
                    {book.description}
                  </motion.p>
                </motion.div>
              </motion.section>
            )}
            {/* Phần thông tin chi tiết khác (chủ đề, địa điểm...) */}
            <motion.section className="py-8 md:py-10 border-t border-gray-700 text-white">
              <motion.div className="px-8 md:px-10">
                <motion.h2 className="text-2xl font-semibold mb-5 text-lightGreen text-shadow-md">
                  Thông tin khác
                </motion.h2>
                <div className="space-y-3 text-lg text-gray-400">
                  {book.total_copies !== undefined && (
                    <p>
                      <span className="font-semibold text-gray-300 text-shadow-sm">
                        Tổng số bản:{" "}
                      </span>
                      <span className="text-lightGreen text-shadow-sm">
                        {book.total_copies}
                      </span>
                    </p>
                  )}
                  {book.available_copies !== undefined && (
                    <p>
                      <span className="font-semibold text-gray-300 text-shadow-sm">
                        Sẵn có:{" "}
                      </span>
                      <span className="text-lightGreen text-shadow-sm">
                        {book.available_copies}
                      </span>
                    </p>
                  )}
                  {book.categories && book.categories.length > 0 && (
                    <p>
                      <span className="font-semibold text-gray-300 text-shadow-sm">
                        Thể loại:{" "}
                      </span>
                      <span className="text-lightGreen text-shadow-sm">
                        {book.categories.map((cat) => cat.name).join(", ")}
                      </span>
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.section>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookDetail;
