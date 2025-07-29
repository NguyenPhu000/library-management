import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import bookService from "../../services/bookservice";
import { getBookIdFromSlug } from "../../utils/slugify";
import { formatCoverImage } from "../../utils/imageHelper";
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
  faCopy,
  faCheckDouble,
  faUserPen,
  faInfoCircle,
  faExclamationTriangle,
  faSignInAlt,
  faQuoteLeft,
  faAward,
  faLanguage,
  faWeight,
  faRulerVertical,
  faFileAlt,
  faStar,
  faEye,
  faHeart,
  faShare,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const BookDetail = () => {
  const { slug } = useParams();
  const book_id = getBookIdFromSlug(slug);
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);
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
          // Simulate view count
          setViewCount(Math.floor(Math.random() * 1000) + 100);
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

  const handleBorrowBook = async () => {
    if (!currentUser) {
      Swal.fire({
        icon: "warning",
        title: "Chưa đăng nhập",
        text: "Bạn cần đăng nhập để mượn sách.",
        showCancelButton: true,
        confirmButtonText: "Đăng nhập",
        cancelButtonText: "Hủy",
        confirmButtonColor: "#10b981",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/login";
        }
      });
      return;
    }

    try {
      await borrowBook(book.book_id);
      Swal.fire({
        icon: "success",
        title: "Thành công!",
        text: "Yêu cầu mượn sách đã được gửi thành công.",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: error.message || "Không thể gửi yêu cầu mượn sách.",
      });
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Khám phá cuốn sách "${book.title}" của ${book.author}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: "success",
        title: "Đã sao chép!",
        text: "Link sách đã được sao chép vào clipboard.",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const DetailItem = ({
    icon,
    label,
    value,
    valueClass = "text-gray-800 dark:text-gray-300",
  }) => (
    <motion.div
      variants={itemVariants}
      className="flex items-start space-x-3 p-3 rounded-lg bg-white dark:bg-gray-800/30 border-2 border-gray-300 dark:border-gray-700/30 hover:border-lightGreen/50 dark:hover:border-lightGreen/30 transition-all duration-300 shadow-md hover:shadow-lg"
    >
      <FontAwesomeIcon
        icon={icon}
        className="text-lightGreen mt-1 w-4 h-4 flex-shrink-0"
      />
      <div className="flex-1">
        <span className="font-semibold text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wide">
          {label}
        </span>
        <div className={`${valueClass} break-words font-medium`}>{value}</div>
      </div>
    </motion.div>
  );

  const StatCard = ({ icon, label, value, color = "text-lightGreen" }) => (
    <motion.div
      variants={itemVariants}
      className="bg-white dark:bg-gray-800/50 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-700/50 hover:border-lightGreen/50 dark:hover:border-lightGreen/30 transition-all duration-300 shadow-lg hover:shadow-xl"
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50`}>
          <FontAwesomeIcon icon={icon} className={`w-5 h-5 ${color}`} />
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <motion.div
        className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0F172A] dark:to-[#1E293B] min-h-screen flex flex-col justify-center items-center text-center p-4"
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
        <p className="text-gray-800 dark:text-gray-300 text-xl font-semibold">
          Đang tải thông tin sách...
        </p>
        <p className="text-gray-600 dark:text-gray-500 text-sm mt-2">
          Vui lòng chờ trong giây lát.
        </p>
      </motion.div>
    );
  }

  if (error || !book) {
    return (
      <motion.div
        className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0F172A] dark:to-[#1E293B] min-h-screen flex flex-col justify-center items-center text-center p-4"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-red-500 text-5xl mb-4"
        />
        <p className="text-red-600 dark:text-red-400 text-xl font-semibold">
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

  const getStatusInfo = () => {
    if (book.total_copies === undefined) {
      return {
        icon: faCircleXmark,
        text: "Chưa nhập thông tin",
        bgColor: "bg-gray-500/20",
        textColor: "text-gray-300",
        borderColor: "border-gray-500/30",
      };
    }

    if (book.available_copies === 0) {
      return {
        icon: faCircleXmark,
        text: "Tạm hết sách",
        bgColor: "bg-red-500/20",
        textColor: "text-red-400",
        borderColor: "border-red-500/30",
      };
    }

    if (book.available_copies < book.total_copies * 0.2) {
      return {
        icon: faExclamationTriangle,
        text: "Sắp hết sách",
        bgColor: "bg-yellow-500/20",
        textColor: "text-yellow-400",
        borderColor: "border-yellow-500/30",
      };
    }

    return {
      icon: faCircleCheck,
      text: "Còn sách",
      bgColor: "bg-green-500/20",
      textColor: "text-green-300",
      borderColor: "border-green-500/30",
    };
  };

  const status = getStatusInfo();

  return (
    <motion.div
      className="bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-[#0F172A] dark:via-[#1E293B] dark:to-[#0F172A] min-h-screen py-8 md:py-12 transition-colors duration-300"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          className="mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <Link
            to="/books"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-lightGreen transition duration-300 group mb-6"
          >
            <FontAwesomeIcon
              icon={faArrowLeft}
              className="mr-2 transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span className="text-sm font-medium">Về trang sách</span>
          </Link>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Column - Book Image & Stats */}
          <div className="xl:col-span-4">
            <motion.div
              className="sticky top-8 space-y-6"
              variants={itemVariants}
            >
              {/* Book Cover */}
              <motion.div className="relative group">
                <motion.img
                  src={formatCoverImage(book.cover_image)}
                  alt={book.title || "Bìa sách"}
                  className="w-full max-w-md mx-auto xl:max-w-full rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-gray-700/50 object-cover aspect-[3/4]"
                  variants={imageVariants}
                  whileHover="hover"
                  loading="lazy"
                />
                <div className={shimmerEffect}></div>

                {/* Floating Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  <motion.button
                    onClick={handleLike}
                    className={`p-3 rounded-full backdrop-blur-sm transition-all duration-300 shadow-lg ${
                      isLiked
                        ? "bg-red-500/80 text-white"
                        : "bg-white/90 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:bg-red-500/80 hover:text-white"
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon icon={faHeart} className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-black/50 text-gray-300 hover:bg-lightGreen/80 hover:text-white backdrop-blur-sm transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FontAwesomeIcon icon={faShare} className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <StatCard
                  icon={faEye}
                  label="Lượt xem"
                  value={viewCount.toLocaleString()}
                  color="text-blue-400"
                />
                <StatCard
                  icon={faStar}
                  label="Đánh giá"
                  value="4.5"
                  color="text-yellow-400"
                />
              </div>

              {/* Availability Status */}
              <motion.div
                variants={itemVariants}
                className={`p-4 rounded-xl border ${status.bgColor} ${status.borderColor} backdrop-blur-sm`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <FontAwesomeIcon
                    icon={status.icon}
                    className={`w-5 h-5 ${status.textColor}`}
                  />
                  <span className={`font-semibold ${status.textColor}`}>
                    {status.text}
                  </span>
                </div>

                {book.total_copies !== undefined && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Có sẵn</span>
                      <span>
                        {book.available_copies}/{book.total_copies}
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          book.available_copies === 0
                            ? "bg-red-500"
                            : book.available_copies < book.total_copies * 0.2
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${
                            (book.available_copies / book.total_copies) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Action Button */}
              <motion.button
                onClick={handleBorrowBook}
                disabled={borrowLoading || book.available_copies === 0}
                className="w-full bg-gradient-to-r from-lightGreen to-green-600 hover:from-green-600 hover:to-lightGreen text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2"
                whileHover={{ scale: book.available_copies > 0 ? 1.02 : 1 }}
                whileTap={{ scale: book.available_copies > 0 ? 0.98 : 1 }}
              >
                {borrowLoading ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSpinner}
                      spin
                      className="w-5 h-5"
                    />
                    <span>Đang xử lý...</span>
                  </>
                ) : book.available_copies === 0 ? (
                  <>
                    <FontAwesomeIcon icon={faCircleXmark} className="w-5 h-5" />
                    <span>Hết sách</span>
                  </>
                ) : currentUser ? (
                  <>
                    <FontAwesomeIcon icon={faBookOpen} className="w-5 h-5" />
                    <span>Yêu cầu mượn sách</span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSignInAlt} className="w-5 h-5" />
                    <span>Đăng nhập để mượn</span>
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Right Column - Book Information */}
          <div className="xl:col-span-8">
            <motion.div className="space-y-8" variants={itemVariants}>
              {/* Title & Author */}
              <div className="space-y-4">
                <motion.h1
                  variants={itemVariants}
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight vietnamese-heading"
                >
                  {book.title || "Không có tiêu đề"}
                </motion.h1>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center space-x-4 text-xl text-gray-600 dark:text-gray-300 vietnamese-text"
                >
                  <FontAwesomeIcon
                    icon={faUserPen}
                    className="text-lightGreen"
                  />
                  <span>Tác giả:</span>
                  <span className="text-lightGreen font-semibold">
                    {book.author || "Không rõ tác giả"}
                  </span>
                </motion.div>
              </div>

              {/* Description */}
              <motion.div
                variants={itemVariants}
                className="bg-white/90 dark:bg-gray-800/30 rounded-xl p-6 border-2 border-gray-300 dark:border-gray-700/30 shadow-lg"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FontAwesomeIcon
                    icon={faQuoteLeft}
                    className="text-lightGreen w-5 h-5"
                  />
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white vietnamese-heading">
                    Mô tả sách
                  </h2>
                </div>
                {book.description ? (
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-line vietnamese-body">
                      {book.description}
                    </p>
                    {book.description.length > 300 && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
                        📖 Mô tả chi tiết giúp bạn hiểu rõ hơn về nội dung cuốn
                        sách
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 dark:text-gray-500 text-lg mb-2">
                      <FontAwesomeIcon
                        icon={faFileAlt}
                        className="w-8 h-8 mb-3"
                      />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">
                      Chưa có mô tả chi tiết cho cuốn sách này
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Mô tả sẽ được cập nhật sớm nhất có thể
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Detailed Information */}
              <motion.div variants={itemVariants} className="space-y-6">
                <div className="flex items-center space-x-3 mb-6">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-lightGreen w-6 h-6"
                  />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                    Thông tin chi tiết
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* ISBN */}
                  <DetailItem
                    icon={faBarcode}
                    label="Mã ISBN"
                    value={book.isbn || "Chưa cập nhật"}
                  />

                  {/* Publication Year */}
                  {book.publication_year && (
                    <DetailItem
                      icon={faCalendarAlt}
                      label="Năm xuất bản"
                      value={book.publication_year}
                    />
                  )}

                  {/* Publisher */}
                  {book.publisher && (
                    <DetailItem
                      icon={faBuilding}
                      label="Nhà xuất bản"
                      value={book.publisher}
                    />
                  )}

                  {/* Categories */}
                  {book.categories && book.categories.length > 0 && (
                    <DetailItem
                      icon={faTags}
                      label="Thể loại"
                      value={
                        <div className="flex flex-wrap gap-2 mt-1">
                          {book.categories.map((category) => (
                            <span
                              key={category.category_id}
                              className="px-3 py-1 bg-lightGreen/20 text-lightGreen rounded-full text-sm font-medium border border-lightGreen/30"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      }
                    />
                  )}

                  {/* Total Copies */}
                  {book.total_copies !== undefined && (
                    <DetailItem
                      icon={faCopy}
                      label="Tổng số bản"
                      value={book.total_copies}
                      valueClass="text-blue-400 font-semibold"
                    />
                  )}

                  {/* Available Copies */}
                  {book.available_copies !== undefined && (
                    <DetailItem
                      icon={faCheckDouble}
                      label="Số bản có sẵn"
                      value={book.available_copies}
                      valueClass={
                        book.available_copies > 0
                          ? "text-green-400 font-semibold"
                          : "text-red-400 font-semibold"
                      }
                    />
                  )}

                  {/* Status */}
                  <DetailItem
                    icon={status.icon}
                    label="Trạng thái"
                    value={
                      <span className={`${status.textColor} font-semibold`}>
                        {status.text}
                      </span>
                    }
                  />

                  {/* Language */}
                  <DetailItem
                    icon={faLanguage}
                    label="Ngôn ngữ"
                    value="Tiếng Việt"
                  />
                </div>
              </motion.div>

              {/* Additional Info Cards */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl p-4 border border-blue-500/20">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon
                      icon={faFileAlt}
                      className="text-blue-400 w-5 h-5"
                    />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Định dạng
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        Sách in
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl p-4 border border-purple-500/20">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon
                      icon={faAward}
                      className="text-purple-400 w-5 h-5"
                    />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Chất lượng
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        Tốt
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center space-x-3">
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      className="text-green-400 w-5 h-5"
                    />
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Tình trạng
                      </div>
                      <div className="font-bold text-gray-900 dark:text-white">
                        Mới
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Library Rules & Information */}
              <motion.div
                variants={itemVariants}
                className="bg-gradient-to-r from-blue-500/5 via-lightGreen/5 to-blue-500/5 rounded-xl p-6 border border-lightGreen/20"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-lightGreen w-6 h-6 mr-3"
                  />
                  Quy định mượn sách
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-lightGreen/20 rounded-full p-2 mt-1">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="text-lightGreen w-4 h-4"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold">
                          Thời gian mượn
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Tối đa 10 ngày kể từ ngày nhận sách
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-lightGreen/20 rounded-full p-2 mt-1">
                        <FontAwesomeIcon
                          icon={faCopy}
                          className="text-lightGreen w-4 h-4"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold">
                          Giới hạn mượn
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Tối đa 5 cuốn sách cùng một lúc
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-yellow-500/20 rounded-full p-2 mt-1">
                        <FontAwesomeIcon
                          icon={faExclamationTriangle}
                          className="text-yellow-400 w-4 h-4"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold">
                          Giữ chỗ đặt trước
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Sách được giữ trong 3 ngày sau khi duyệt
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="bg-green-500/20 rounded-full p-2 mt-1">
                        <FontAwesomeIcon
                          icon={faCheckDouble}
                          className="text-green-400 w-4 h-4"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold">
                          Gia hạn
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Có thể gia hạn tối đa 1 lần
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-red-500/20 rounded-full p-2 mt-1">
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="text-red-400 w-4 h-4"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold">
                          Phí trễ hạn
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          2,000đ mỗi ngày trễ hạn
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="bg-purple-500/20 rounded-full p-2 mt-1">
                        <FontAwesomeIcon
                          icon={faBookOpen}
                          className="text-purple-400 w-4 h-4"
                        />
                      </div>
                      <div>
                        <p className="text-gray-900 dark:text-white font-bold">
                          Điều kiện mượn
                        </p>
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-medium">
                          Cần đăng ký thành viên thư viện
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700/30">
                  <p className="text-sm text-gray-700 dark:text-gray-400 flex items-center font-medium">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="w-4 h-4 mr-2 text-lightGreen"
                    />
                    Vui lòng tuân thủ quy định để đảm bảo quyền lợi của tất cả
                    thành viên
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookDetail;
