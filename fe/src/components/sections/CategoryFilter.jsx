import { useState, useContext } from "react";
import { useCategory } from "../../contexts/CategoryContext";
import { useBook } from "../../contexts/BookContext";
import { SearchBookContext } from "../../contexts/SearchBookContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faListAlt,
  faExclamationTriangle,
  faTags,
  faFilter,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const itemVariants = {
  hidden: { y: 5, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
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
      className="card-library mb-8"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-library-border">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-library-primary/10 rounded-library-button flex items-center justify-center mr-3">
            <FontAwesomeIcon
              icon={faFilter}
              className="text-library-primary w-5 h-5"
            />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold text-library-text-primary">
              Lọc theo thể loại
            </h2>
            <p className="text-sm text-library-text-muted">
              Chọn thể loại sách bạn quan tâm
            </p>
          </div>
        </div>

        {/* Active Filter Badge */}
        {effectiveSelectedCategory !== "all" && (
          <div className="bg-library-primary/10 text-library-primary px-3 py-1 rounded-library text-sm font-medium">
            <FontAwesomeIcon icon={faCheck} className="mr-1" />
            Đã lọc
          </div>
        )}
      </div>

      {/* Filter Options */}
      <motion.div
        className="flex flex-wrap gap-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Nút "Tất Cả" */}
        <motion.button
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSelectAll}
          className={`px-4 py-2 rounded-library text-sm font-medium transition-all duration-200 border ${
            effectiveSelectedCategory === "all"
              ? "bg-library-primary text-white border-library-primary shadow-library-button"
              : "bg-library-surface text-library-text-secondary border-library-border hover:border-library-primary hover:text-library-primary hover:bg-library-primary/5"
          }`}
        >
          <FontAwesomeIcon icon={faListAlt} className="mr-2 w-4 h-4" />
          Tất cả
        </motion.button>

        {/* Loading State */}
        {loading && (
          <motion.div
            className="w-full flex justify-center items-center text-library-text-muted py-6"
            variants={itemVariants}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-library-primary text-xl mr-3"
            />
            <span>Đang tải danh mục thể loại...</span>
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            className="w-full flex justify-center items-center text-library-error py-6"
            variants={itemVariants}
          >
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-library-error text-xl mr-3"
            />
            <span>Không thể tải danh mục. Vui lòng thử lại sau.</span>
          </motion.div>
        )}

        {/* Category Buttons */}
        {!loading &&
          !error &&
          categories.length > 0 &&
          categories.map((category) => (
            <motion.button
              key={category.category_id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryChange(category.category_id)}
              className={`px-4 py-2 rounded-library text-sm font-medium transition-all duration-200 border ${
                effectiveSelectedCategory === category.category_id
                  ? "bg-library-primary text-white border-library-primary shadow-library-button"
                  : "bg-library-surface text-library-text-secondary border-library-border hover:border-library-primary hover:text-library-primary hover:bg-library-primary/5"
              }`}
            >
              <FontAwesomeIcon icon={faTags} className="mr-2 w-4 h-4" />
              {category.name}

              {/* Check icon for selected category */}
              {effectiveSelectedCategory === category.category_id && (
                <FontAwesomeIcon icon={faCheck} className="ml-2 w-3 h-3" />
              )}
            </motion.button>
          ))}

        {/* Empty State */}
        {!loading && !error && categories.length === 0 && (
          <motion.div
            className="w-full text-center text-library-text-muted py-8"
            variants={itemVariants}
          >
            <FontAwesomeIcon
              icon={faTags}
              className="text-library-text-muted text-3xl mb-3"
            />
            <p className="text-library-text-secondary">
              Hiện chưa có danh mục thể loại nào.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Filter Results Info */}
      {effectiveSelectedCategory !== "all" && (
        <motion.div
          className="mt-6 pt-4 border-t border-library-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between text-sm">
            <span className="text-library-text-muted">
              Đang hiển thị sách thuộc thể loại:{" "}
              <span className="font-medium text-library-primary">
                {categories.find(
                  (cat) => cat.category_id === effectiveSelectedCategory
                )?.name || "Không xác định"}
              </span>
            </span>
            <button
              onClick={handleSelectAll}
              className="text-library-primary hover:text-library-primary/80 font-medium"
            >
              Xóa bộ lọc
            </button>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default CategoryFilter;
