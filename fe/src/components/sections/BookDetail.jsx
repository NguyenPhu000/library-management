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
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  if (loading) {
    return (
      <motion.div
        className="bg-library-background min-h-screen flex flex-col justify-center items-center text-center p-4"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <FontAwesomeIcon
          icon={faSpinner}
          spin
          className="text-library-primary text-5xl mb-4"
        />
        <p className="text-library-text-primary text-xl font-semibold">
          Đang tải thông tin sách...
        </p>
        <p className="text-library-text-muted text-sm mt-2">
          Vui lòng chờ trong giây lát.
        </p>
      </motion.div>
    );
  }

  if (error || !book) {
    return (
      <motion.div
        className="bg-library-background min-h-screen flex flex-col justify-center items-center text-center p-4"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <FontAwesomeIcon
          icon={faExclamationTriangle}
          className="text-library-error text-5xl mb-4"
        />
        <p className="text-library-error text-xl font-semibold mb-4">
          {error || "Không thể hiển thị thông tin sách."}
        </p>
        <Link to="/books" className="btn-library-primary flex items-center">
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
          confirmButtonColor: "#2563EB",
          customClass: {
            popup: "bg-library-surface",
            title: "text-library-text-primary",
            htmlContainer: "text-library-text-secondary",
          },
        });
      }
    } catch (error) {
      console.error("Lỗi khi thực hiện yêu cầu mượn sách:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.message || "Không thể gửi yêu cầu mượn sách",
        customClass: {
          popup: "bg-library-surface",
          title: "text-library-text-primary",
          htmlContainer: "text-library-text-secondary",
        },
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
    valueClass = "text-library-primary font-medium",
  }) => (
    <motion.div variants={itemVariants} className="flex items-start space-x-3">
      <FontAwesomeIcon
        icon={icon}
        className="text-library-text-muted mt-1 w-4 h-4 flex-shrink-0"
      />
      <div>
        <span className="font-medium text-library-text-secondary">
          {label}:
        </span>{" "}
        <span className={`${valueClass} break-words`}>{value}</span>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      className="bg-library-background min-h-screen py-8 md:py-12"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="card-library overflow-hidden"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Back Button */}
          <div className="p-6 md:p-8 border-b border-library-border">
            <Link
              to="/books"
              className="inline-flex items-center text-library-text-secondary hover:text-library-primary transition duration-200 group"
            >
              <FontAwesomeIcon
                icon={faArrowLeft}
                className="mr-2 transition-transform duration-200 group-hover:-translate-x-1"
              />
              <span className="font-medium">Về trang sách</span>
            </Link>
          </div>

          <div className="p-6 md:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
              {/* Left Side: Cover Image */}
              <motion.div className="lg:col-span-4 flex justify-center items-start">
                <motion.img
                  src={book.cover_image || "/placeholder-image.png"}
                  alt={book.title || "Bìa sách"}
                  className="w-full max-w-sm lg:max-w-full rounded-library-card shadow-library-book border border-library-border object-cover aspect-[3/4] transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/public/uploads/coverBook.jpg";
                  }}
                />
              </motion.div>

              {/* Right Side: Main Info */}
              <motion.div
                className="lg:col-span-8 text-library-text-primary flex flex-col"
                variants={itemVariants}
              >
                {/* Title */}
                <motion.h1
                  variants={itemVariants}
                  className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold mb-4 text-library-text-primary leading-tight"
                >
                  {book.title || "Không có tiêu đề"}
                </motion.h1>

                {/* Author */}
                <motion.p
                  variants={itemVariants}
                  className="text-library-text-secondary text-lg md:text-xl mb-4 flex items-center"
                >
                  <FontAwesomeIcon
                    icon={faUserPen}
                    className="mr-2 text-library-text-muted w-4 h-4"
                  />
                  Tác giả:{" "}
                  <span className="text-library-primary font-semibold ml-1">
                    {book.author || "Không rõ tác giả"}
                  </span>
                </motion.p>

                {/* Status */}
                {book.status && (
                  <motion.div variants={itemVariants} className="mb-6">
                    <span
                      className={`inline-flex items-center px-4 py-2 rounded-library text-sm font-medium ${
                        book.status === "available"
                          ? "bg-library-success/10 text-library-success border border-library-success/20"
                          : "bg-library-error/10 text-library-error border border-library-error/20"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          book.status === "available"
                            ? faCircleCheck
                            : faCircleXmark
                        }
                        className="mr-2 h-4 w-4"
                      />
                      {book.status === "available" ? "Còn Sách" : "Hết Sách"}
                    </span>
                  </motion.div>
                )}

                {/* Short Description */}
                {book.description && (
                  <motion.p
                    variants={itemVariants}
                    className="text-library-text-secondary leading-relaxed mb-8 text-base md:text-lg line-clamp-3"
                  >
                    {book.description}
                  </motion.p>
                )}

                {/* Detailed Information Section */}
                <motion.div className="mb-8" variants={itemVariants}>
                  <motion.h2
                    variants={itemVariants}
                    className="text-xl font-heading font-semibold mb-6 text-library-text-primary flex items-center"
                  >
                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                    Thông tin chi tiết
                  </motion.h2>
                  <motion.div
                    variants={itemVariants}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 text-sm"
                  >
                    {/* ISBN */}
                    <DetailItem
                      icon={faBarcode}
                      label="ISBN"
                      value={book.isbn || "Chưa cập nhật"}
                    />

                    {/* Categories/Genre */}
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
                        label="Tổng số bản"
                        value={`${book.total_copies} cuốn`}
                      />
                    )}

                    {/* Available Copies */}
                    {book.available_copies !== undefined && (
                      <DetailItem
                        icon={faCheckDouble}
                        label="Sẵn có"
                        value={`${book.available_copies} cuốn`}
                        valueClass={
                          book.available_copies > 0
                            ? "text-library-success font-semibold"
                            : "text-library-error font-semibold"
                        }
                      />
                    )}
                  </motion.div>
                </motion.div>

                {/* Action Button */}
                <div className="flex flex-col lg:flex-row items-start space-y-4 lg:space-y-0 lg:space-x-4">
                  {!currentUser ? (
                    <button
                      onClick={handleLoginToBorrow}
                      className="btn-library-primary text-lg px-8 py-4 flex items-center justify-center w-full lg:w-auto"
                    >
                      <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                      Đăng nhập để yêu cầu mượn
                    </button>
                  ) : book.available_copies > 0 ? (
                    <button
                      onClick={handleBorrowClick}
                      disabled={borrowLoading}
                      className="btn-library-primary text-lg px-8 py-4 flex items-center justify-center w-full lg:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                    >
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
                          <FontAwesomeIcon icon={faBookOpen} className="mr-2" />
                          Yêu cầu mượn sách
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex flex-col items-center space-y-3 w-full lg:w-auto">
                      <button
                        disabled
                        className="px-8 py-4 bg-library-border text-library-text-muted font-semibold rounded-library-button cursor-not-allowed w-full lg:w-auto"
                      >
                        <FontAwesomeIcon
                          icon={faCircleXmark}
                          className="mr-2"
                        />
                        Tạm hết sách
                      </button>
                      <p className="text-sm text-library-text-muted text-center">
                        Bạn có thể đặt trước khi sách có sẵn
                      </p>
                    </div>
                  )}

                  {borrowError && (
                    <div className="bg-library-error/10 border border-library-error/20 text-library-error text-sm p-4 rounded-library w-full">
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

          {/* Full Description Section */}
          {book.description && (
            <motion.section
              className="py-8 md:py-10 border-t border-library-border bg-library-background"
              variants={itemVariants}
            >
              <div className="px-6 md:px-8 lg:px-10">
                <motion.h2
                  variants={itemVariants}
                  className="text-2xl md:text-3xl font-heading font-semibold mb-6 text-library-text-primary flex items-center"
                >
                  <FontAwesomeIcon icon={faBookOpen} className="mr-3" />
                  Mô tả đầy đủ
                </motion.h2>
                <motion.div
                  variants={itemVariants}
                  className="prose prose-lg max-w-none text-library-text-secondary leading-relaxed"
                >
                  <p className="whitespace-pre-line text-base md:text-lg">
                    {book.description}
                  </p>
                </motion.div>
              </div>
            </motion.section>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BookDetail;
