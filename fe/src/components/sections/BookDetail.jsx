import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import bookService from "../../services/bookservice";
import { getBookIdFromSlug } from "../../utils/slugify";
import { motion } from "framer-motion";
import { useLoan } from "../../contexts/LoanContext";
import { useAuth } from "../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faCircleCheck,
  faCircleXmark,
  faArrowLeft,
  faBookOpen,
  faCalendarAlt,
  faBuilding,
  faTags,
  faBarcode,
  faPager,
  faClone,
  faCheckDouble,
  faUserPen,
  faInfoCircle,
  faExclamationTriangle,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const BookDetail = () => {
  const { slug } = useParams();
  const book_id = getBookIdFromSlug(slug);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { borrowBook, borrowLoading, borrowError } = useLoan();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBook = async () => {
      if (!book_id) {
        setError("ID sách không hợp lệ.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await bookService.getBookById(book_id);
        if (response && response.book) {
          setBook(response.book);
        } else {
          setError("Không tìm thấy sách.");
          setBook(null);
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết sách:", err);
        setError("Đã xảy ra lỗi khi tải thông tin sách.");
        setBook(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [book_id]);

  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4, ease: "easeIn" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0px 15px 30px rgba(0, 255, 150, 0.25)",
      transition: { duration: 0.4, ease: "circOut" },
    },
  };

  const shimmerEffect = `
    absolute inset-0 overflow-hidden rounded-2xl
    bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.15)_50%,transparent_70%)]
    bg-[length:200%_100%] bg-no-repeat
    transition-[background-position_0s_ease] group-hover:bg-[position:-200%_0] group-hover:duration-[1200ms]
  `;

  if (loading) {
    return (
      <motion.div
        className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] min-h-screen flex flex-col justify-center items-center text-center p-4"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="text-lightGreen text-5xl mb-4"
        />
        <p className="text-gray-300 text-xl font-semibold">
          Đang tải thông tin sách...
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Vui lòng chờ trong giây lát.
        </p>
      </motion.div>
    );
  }

  if (error || !book) {
    return (
      <motion.div
        className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] min-h-screen flex flex-col justify-center items-center text-center p-4"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-red-500 text-5xl mb-4"
        />
        <p className="text-red-400 text-xl font-semibold">
          {error || "Không thể hiển thị thông tin sách."}
        </p>
        <Link
          to="/books"
          className="mt-6 inline-flex items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-lightGreen hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-lightGreen transition duration-300"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
          Quay lại danh sách
        </Link>
      </motion.div>
    );
  }

  const handleBorrowClick = async () => {
    if (!book || borrowLoading) return;
    try {
      const result = await borrowBook(book_id);

      if (result && result.success) {
        Swal.fire({
          icon: "success",
          title: "Gửi yêu cầu thành công!",
          html: `
            <p>Yêu cầu mượn sách <strong>"${book.title}"</strong> đã được gửi.</p>
            <br>
            <p><strong>Quy trình tiếp theo:</strong></p>
            <p>1. ⏳ Chờ thủ thư duyệt yêu cầu</p>
            <p>2. ✅ Đến thư viện nhận sách trong vòng 3 ngày sau khi được duyệt</p>
            <p>3. 📚 Thời hạn trả: 10 ngày kể từ khi nhận sách</p>
            <br>
            <p class="text-sm text-gray-600">Bạn sẽ nhận được thông báo khi yêu cầu được duyệt.</p>
          `,
          confirmButtonText: "Đã hiểu",
          confirmButtonColor: "#10B981",
          background: "#1f2937",
          color: "#ffffff",
        });
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện yêu cầu mượn sách:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể gửi yêu cầu mượn sách",
        background: "#1f2937",
        color: "#ffffff",
      });
    }
  };

  const handleLoginToBorrow = () => {
    window.location.href = "/login";
  };

  const DetailItem = ({
    icon,
    label,
    value,
    valueClass = "text-lightGreen",
  }) => (
    <motion.div variants={itemVariants} className="flex items-start space-x-3">
      <FontAwesomeIcon
        icon={icon}
        className="text-gray-400 mt-1 w-4 h-4 flex-shrink-0"
      />
      <div>
        <span className="font-semibold text-gray-300">{label}:</span>{" "}
        <span className={`${valueClass} break-words`}>{value}</span>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] min-h-screen py-12 md:py-16"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-4">
        <motion.div
          className="bg-[#1E293B] rounded-2xl shadow-xl overflow-hidden border border-gray-700/50"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <div className="p-6 md:p-8 border-b border-gray-700/50">
            <Link
              to="/books"
              className="inline-flex items-center text-gray-400 hover:text-lightGreen transition duration-300 group"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
              />
              <span className="text-sm font-medium">Về trang sách</span>
            </Link>
          </div>

          <div className="p-6 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
              {/* Left Side: Cover Image */}
              <motion.div className="lg:col-span-4 flex justify-center items-start group relative">
                <motion.img
                  src={book.cover_image || "/placeholder-image.png"}
                  alt={book.title || "Bìa sách"}
                  className="w-full max-w-sm lg:max-w-full rounded-lg shadow-lg border-2 border-gray-700 object-cover aspect-[3/4]"
                  variants={imageVariants}
                  whileHover="hover"
                  loading="lazy"
                />
                <div className={shimmerEffect}></div>
              </motion.div>

              {/* Right Side: Main Info */}
              <motion.div
                className="lg:col-span-8 text-white flex flex-col"
                variants={itemVariants}
              >
                {/* Title */}
                <motion.h1
                  variants={itemVariants}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-lightGreen"
                >
                  {book.title || "Không có tiêu đề"}
                </motion.h1>

                {/* Author */}
                <motion.p
                  variants={itemVariants}
                  className="text-gray-300 text-lg md:text-xl mb-4 flex items-center"
                >
                  <FontAwesomeIcon
                    icon={faUserPen}
                    className="mr-2 text-gray-400 w-4 h-4"
                  />
                  Tác giả:{" "}
                  <span className="text-lightGreen font-medium ml-1">
                    {book.author || "Không rõ tác giả"}
                  </span>
                </motion.p>

                {/* Status Badge */}
                <motion.div variants={itemVariants} className="mb-6">
                  {(() => {
                    let status = {
                      icon: faCircleXmark,
                      text: "Chưa nhập",
                      bgColor: "bg-gray-500/20",
                      textColor: "text-gray-300",
                    };

                    if (book.total_copies !== undefined) {
                      if (book.available_copies === 0) {
                        status = {
                          icon: faCircleXmark,
                          text: "Tạm hết sách",
                          bgColor: "bg-red-500/20",
                          textColor: "text-red-400",
                        };
                      } else if (
                        book.available_copies <
                        book.total_copies * 0.2
                      ) {
                        status = {
                          icon: faExclamationTriangle,
                          text: "Sắp hết sách",
                          bgColor: "bg-yellow-500/20",
                          textColor: "text-yellow-400",
                        };
                      } else {
                        status = {
                          icon: faCircleCheck,
                          text: "Còn sách",
                          bgColor: "bg-green-500/20",
                          textColor: "text-green-300",
                        };
                      }
                    }

                    return (
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${status.bgColor} ${status.textColor}`}
                        >
                          <FontAwesomeIcon
                            icon={status.icon}
                            className={`mr-1.5 h-4 w-4 ${
                              status.text === "Sắp hết sách"
                                ? "animate-pulse"
                                : ""
                            }`}
                          />
                          {status.text}
                        </span>
                        {book.total_copies !== undefined && (
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  book.available_copies === 0
                                    ? "bg-red-500"
                                    : book.available_copies <
                                      book.total_copies * 0.2
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${
                                    (book.available_copies /
                                      book.total_copies) *
                                    100
                                  }%`,
                                }}
                              />
                            </div>
                            <span className="text-sm text-gray-400">
                              {book.available_copies}/{book.total_copies}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </motion.div>

                {/* Short Description */}
                {book.description && (
                  <motion.p
                    variants={itemVariants}
                    className="text-gray-400 leading-relaxed mb-8 text-base md:text-lg line-clamp-3" // Added mb-8 for spacing
                  >
                    {book.description}
                  </motion.p>
                )}

                {/* Detailed Information Section - MOVED HERE */}
                <motion.div className="mb-8" variants={itemVariants}>
                  {" "}
                  {/* Added wrapper div with margin */}
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl font-semibold mb-4 text-lightGreen flex items-center" // Smaller heading
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    Thông tin chi tiết
                  </motion.h2>
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-gray-400" // Smaller text, gap
                  >
                    {/* ISBN - Moved to top */}
                    <DetailItem
                      icon={faBarcode}
                      label="ISBN"
                      value={book.isbn || "N/A"} // Use N/A if missing
                    />
                    {/* Categories/Genre - Moved to second */}
                    {book.categories && book.categories.length > 0 && (
                      <DetailItem
                        icon={faTags}
                        label="Thể loại"
                        value={book.categories
                          .map((cat) => cat.name)
                          .join(", ")}
                      />
                    )}
                    {book.genre &&
                      (!book.categories || book.categories.length === 0) && (
                        <DetailItem
                          icon={faTags}
                          label="Thể loại"
                          value={book.genre}
                        />
                      )}
                    {/* Publication Year */}
                    {book.publication_year && (
                      <DetailItem
                        icon={faCalendarAlt}
                        label="Năm XB" // Abbreviated label
                        value={book.publication_year}
                      />
                    )}
                    {/* Publisher */}
                    {book.publisher && (
                      <DetailItem
                        icon={faBuilding}
                        label="Nhà XB" // Abbreviated label
                        value={book.publisher}
                      />
                    )}
                    {/* Format */}
                    <DetailItem
                      icon={faPager}
                      label="Định dạng"
                      value={book.format || "Bìa mềm"}
                    />
                    {/* Total Copies */}
                    {book.total_copies !== undefined && (
                      <DetailItem
                        icon={faClone}
                        label="Tổng số" // Abbreviated label
                        value={book.total_copies}
                      />
                    )}
                    {/* Available Copies */}
                    {book.available_copies !== undefined && (
                      <DetailItem
                        icon={faCheckDouble}
                        label="Sẵn có"
                        value={book.available_copies}
                        valueClass={
                          book.available_copies > 0
                            ? "text-green-400 font-semibold" // Highlight availability
                            : "text-red-400"
                        }
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Action Button */}
                <div className="flex flex-col lg:flex-row items-center justify-center space-y-4 lg:space-y-0 lg:space-x-4">
                  {!currentUser ? (
                    <button
                      onClick={handleLoginToBorrow}
                      className="group relative px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition duration-300 overflow-hidden w-full lg:w-auto"
                    >
                      <div className={shimmerEffect}></div>
                      <span className="relative flex items-center justify-center">
                        <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                        Đăng nhập để yêu cầu mượn
                      </span>
                    </button>
                  ) : book.available_copies > 0 ? (
                    <button
                      onClick={handleBorrowClick}
                      disabled={borrowLoading}
                      className="group relative px-8 py-3 bg-lightGreen hover:bg-opacity-80 text-black font-bold rounded-xl transition duration-300 overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed w-full lg:w-auto"
                    >
                      <div className={shimmerEffect}></div>
                      <span className="relative flex items-center justify-center">
                        {borrowLoading ? (
                          <>
                            <FontAwesomeIcon
                              icon={faSpinner}
                              spin
                              className="mr-2"
                            />
                            Đang gửi yêu cầu...
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon
                              icon={faBookOpen}
                              className="mr-2"
                            />
                            Yêu cầu mượn sách
                          </>
                        )}
                      </span>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center space-y-2 w-full lg:w-auto">
                      <button
                        disabled
                        className="px-8 py-3 bg-gray-600 text-gray-300 font-bold rounded-xl cursor-not-allowed w-full lg:w-auto"
                      >
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="mr-2"
                        />
                        Tạm hết sách
                      </button>
                      <p className="text-xs text-gray-400 text-center">
                        Bạn có thể đặt trước khi sách có sẵn
                      </p>
                    </div>
                  )}

                  {borrowError && (
                    <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-700/50 w-full">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="mr-2"
                      />
                      {borrowError}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Full Description Section - Remains at the bottom */}
          {book.description && (
            <motion.section
              className="py-8 md:py-10 border-t border-gray-700/50 text-white" // Keep border here
              variants={itemVariants}
            >
              <div className="px-6 md:px-10 lg:px-12">
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl md:text-3xl font-semibold mb-5 text-lightGreen flex items-center"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
                  Mô tả đầy đủ
                </motion.h2>
                <motion.p
                  variants={itemVariants}
                  className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-line"
                >
                  {book.description}
                </motion.p>
              </div>
            </motion.section>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookDetail;
