import { useState } from "react";
import { useCategory } from "../../contexts/CategoryContext";
import { useBook } from "../../contexts/BookContext";
import { FaTags } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faListAlt } from "@fortawesome/free-solid-svg-icons";
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
  const { categories, loading } = useCategory();
  const { filterByCategory } = useBook();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryChange = (categoryId) => {
    const newSelection = categoryId === selectedCategory ? "all" : categoryId;
    setSelectedCategory(newSelection);
    filterByCategory(newSelection);
  };

  const handleSelectAll = () => {
    setSelectedCategory("all");
    filterByCategory("all");
  };

  return (
    <motion.section
      className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 md:p-8 rounded-xl shadow-2xl border border-teal-500/30 mb-12"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-700/50 pb-4">
        <h2 className="text-2xl md:text-3xl font-bold text-lightGreen flex items-center">
          <FaTags className="mr-3 text-lightGreen text-2xl" />
          Thể Loại
        </h2>
      </div>

      {/* Danh sách thể loại */}
      <motion.div
        className="flex flex-wrap gap-3 text-white"
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
          className={`px-4 py-2 rounded-full text-sm md:text-base font-medium cursor-pointer transition-all duration-200 ease-out border-2 ${
            selectedCategory === "all"
              ? "bg-gradient-to-r from-lightGreen to-teal-500 text-gray-900 border-lightGreen shadow-lg shadow-lightGreen/30"
              : "bg-gray-700/50 border-gray-600 hover:border-teal-500/70 text-gray-300 hover:text-white"
          }`}
        >
          <FontAwesomeIcon icon={faListAlt} className="mr-1.5" />
          Tất cả
        </motion.button>

        {/* Hiển thị danh mục */}
        {loading ? (
          <motion.div
            className="w-full flex justify-center items-center text-gray-400 py-4"
            variants={itemVariants}
          >
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-lightGreen text-2xl mr-3"
            />
            <span className="text-lg">Đang tải thể loại...</span>
          </motion.div>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <motion.button
              key={category.category_id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, backgroundColor: "#1f2937" }} // gray-800
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCategoryChange(category.category_id)}
              className={`px-4 py-2 rounded-full text-sm md:text-base font-medium cursor-pointer transition-all duration-200 ease-out border-2 ${
                selectedCategory === category.category_id
                  ? "bg-gradient-to-r from-lightGreen to-teal-500 text-gray-900 border-lightGreen shadow-lg shadow-lightGreen/30"
                  : "bg-gray-700/50 border-gray-600 hover:border-teal-500/70 text-gray-300 hover:text-white"
              }`}
            >
              {category.name}
            </motion.button>
          ))
        ) : (
          <motion.p
            className="w-full text-center text-gray-500 text-lg py-4"
            variants={itemVariants}
          >
            📂 Rất tiếc, chưa có thể loại nào được thêm vào.
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  );
};

export default CategoryFilter;
