import { useState, useContext } from "react";
import { useCategory } from "../../contexts/CategoryContext";
import { useBook } from "../../contexts/BookContext";
import { SearchBookContext } from "../../contexts/SearchBookContext";
import { FaTags } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faListAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 15,
    },
  },
};

const CategoryFilter = () => {
  const { categories, loading, error } = useCategory();
  const { filterByCategory } = useBook();
  const {
    isSearching,
    filterSearchResultsByCategory,
    selectedCategory: searchSelectedCategory,
  } = useContext(SearchBookContext);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryChange = (categoryId) => {
    const newSelection = categoryId === selectedCategory ? "all" : categoryId;
    setSelectedCategory(newSelection);

    if (isSearching) {
      // Nếu đang tìm kiếm, lọc kết quả tìm kiếm theo thể loại
      filterSearchResultsByCategory(
        newSelection === "all" ? null : newSelection
      );
    } else {
      // Nếu không tìm kiếm, lọc sách theo thể loại
      filterByCategory(newSelection);
    }
  };

  const handleSelectAll = () => {
    setSelectedCategory("all");
    if (isSearching) {
      filterSearchResultsByCategory(null);
    } else {
      filterByCategory("all");
    }
  };

  // Xác định category được chọn từ SearchContext hoặc state local
  const effectiveSelectedCategory = isSearching
    ? searchSelectedCategory || "all"
    : selectedCategory;

  return (
    <motion.section
      className="bg-gradient-to-br from-gray-100 via-gray-50 to-white dark:from-gray-800 dark:via-gray-900 dark:to-black p-4 md:p-6 rounded-xl shadow-2xl border-2 border-gray-300 dark:border-teal-500/30 mb-8 transition-all duration-300"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-300 dark:border-gray-700/50 pb-3">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-lightGreen flex items-center transition-colors duration-300">
          <FaTags className="mr-2 text-gray-800 dark:text-lightGreen text-xl" />
          Thể Loại
        </h2>
      </div>

      {/* Danh sách thể loại */}
      <motion.div
        className="flex flex-wrap gap-2 text-gray-900 dark:text-white transition-colors duration-300"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Nút "Tất Cả" */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.05, backgroundColor: "#1f2937" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSelectAll}
          className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ease-out border-2 ${
            effectiveSelectedCategory === "all"
              ? "bg-gradient-to-r from-lightGreen to-teal-500 text-gray-900 border-lightGreen shadow-lg shadow-lightGreen/30"
              : "bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:border-teal-500/70 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow-md"
          }`}
        >
          <FontAwesomeIcon icon={faListAlt} className="mr-1.5" />
          Tất cả
        </motion.button>

        {/* Hiển thị danh mục */}
        {loading ? (
          <motion.div
            className="w-full flex justify-center items-center text-gray-600 dark:text-gray-400 py-3 transition-colors duration-300"
            variants={itemVariants}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-gray-800 dark:text-lightGreen text-xl mr-2"
            />
            <span>Đang tải thể loại...</span>
          </motion.div>
        ) : error ? (
          <motion.div
            className="w-full flex justify-center items-center text-red-500 dark:text-red-400 py-3 transition-colors duration-300"
            variants={itemVariants}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-red-500 dark:text-red-400 text-xl mr-2"
            />
            <span>Không thể tải thể loại. Vui lòng thử lại sau.</span>
          </motion.div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <motion.button
              key={category.category_id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, backgroundColor: "#1f2937" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryChange(category.category_id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 ease-out border-2 ${
                effectiveSelectedCategory === category.category_id
                  ? "bg-gradient-to-r from-lightGreen to-teal-500 text-gray-900 border-lightGreen shadow-lg shadow-lightGreen/30"
                  : "bg-white dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:border-teal-500/70 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow-md"
              }`}
            >
              {category.name}
            </motion.button>
          ))
        ) : (
          <motion.div
            className="w-full text-center text-gray-500 dark:text-gray-500 py-3 transition-colors duration-300"
            variants={itemVariants}
          >
            <FontAwesomeIcon
              icon={faListAlt}
              className="text-gray-800 dark:text-lightGreen text-xl mb-2"
            />
            <p>Hiện chưa có thể loại nào.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default CategoryFilter;
