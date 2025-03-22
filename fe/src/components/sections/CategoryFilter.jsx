import { useState } from "react";
import { useCategory } from "../../contexts/CategoryContext";
import { useBook } from "../../contexts/BookContext";
import { FaFolderOpen } from "react-icons/fa";

const CategoryFilter = () => {
  const { categories, loading } = useCategory();
  const { filterByCategory } = useBook();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
    filterByCategory(categoryId);
  };

  return (
    <section className="bg-gray-900 p-6 rounded-lg shadow-md border-2 border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 border-b border-gray-700 pb-3">
        <h2 className="text-white font-semibold text-xl flex items-center">
          <FaFolderOpen className="mr-2 text-lightGreen" />
          Lọc Thể Loại
        </h2>
      </div>

      {/* Danh sách thể loại */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 text-white">
        {/* Nút "Tất Cả" */}
        <label
          className={`flex items-center space-x-2 cursor-pointer text-base md:text-lg rounded-md p-2 hover:bg-gray-800 transition-colors duration-200 ${
            selectedCategory === null ? "bg-gray-800" : ""
          }`}
        >
          <input
            type="radio"
            name="category"
            checked={selectedCategory === null}
            onChange={() => {
              setSelectedCategory(null);
              filterByCategory("all");
            }}
            className="form-radio text-lightGreen bg-gray-800 rounded-full focus:ring-lightGreen focus:ring-offset-gray-900 transition w-4 h-4"
          />
          <span>Tất cả</span>
        </label>

        {/* Hiển thị danh mục */}
        {loading ? (
          <p className="text-gray-400 col-span-full text-center text-lg">
            ⏳ Đang tải danh mục...
          </p>
        ) : categories.length > 0 ? (
          categories.map((category) => (
            <label
              key={category.category_id}
              className={`flex items-center space-x-2 cursor-pointer text-base md:text-lg rounded-md p-2 hover:bg-gray-800 transition-colors duration-200 ${
                selectedCategory === category.category_id ? "bg-gray-800" : ""
              }`}
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === category.category_id}
                onChange={() => handleCategoryChange(category.category_id)}
                className="form-radio text-lightGreen bg-gray-800 rounded-full focus:ring-lightGreen focus:ring-offset-gray-900 transition w-4 h-4"
              />
              <span>{category.name}</span>
            </label>
          ))
        ) : (
          <p className="text-gray-400 col-span-full text-center text-lg">
            📂 Không có danh mục nào...
          </p>
        )}
      </div>
    </section>
  );
};

export default CategoryFilter;
