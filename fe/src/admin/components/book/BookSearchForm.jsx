import React from "react";
import {
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp,
  FaTimes,
} from "react-icons/fa";

const BookSearchForm = ({
  searchTerm,
  setSearchTerm,
  searchCriteria,
  setSearchCriteria,
  selectedCategory,
  setSelectedCategory,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  categories = [],
  onClearFilters,
  resultsCount = 0,
  totalCount = 0,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const hasActiveFilters = searchTerm || selectedCategory || filterBy !== "all";

  const sortOptions = [
    { key: "title", label: "Tiêu đề" },
    { key: "author", label: "Tác giả" },
    { key: "publication_year", label: "Năm XB" },
    { key: "created_at", label: "Ngày tạo" },
    { key: "available_copies", label: "Số bản có sẵn" },
    { key: "total_copies", label: "Tổng số bản" },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="relative lg:col-span-2">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
            <input
              type="text"
              placeholder="Tìm kiếm sách..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div>
            <select
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="title">Tiêu đề</option>
              <option value="author">Tác giả</option>
              <option value="isbn">ISBN</option>
              <option value="publisher">Nhà xuất bản</option>
              <option value="publication_year">Năm xuất bản</option>
            </select>
          </div>

          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="">Tất cả danh mục</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="available">Còn sách</option>
              <option value="outOfStock">Hết sách</option>
              <option value="new">Mới thêm (7 ngày)</option>
            </select>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              {sortOrder === "asc" ? (
                <>
                  <FaSortAmountUp className="mr-2" />
                  Tăng dần
                </>
              ) : (
                <>
                  <FaSortAmountDown className="mr-2" />
                  Giảm dần
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            Sắp xếp theo:
          </span>
          {sortOptions.map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setSortBy(option.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sortBy === option.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {hasActiveFilters ? (
              <span>
                Hiển thị{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {resultsCount}
                </span>{" "}
                / {totalCount} sách
                {searchTerm && (
                  <span>
                    {" "}
                    với từ khóa "
                    <span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
              </span>
            ) : (
              <span>
                Hiển thị tất cả{" "}
                <span className="font-semibold">{totalCount}</span> sách
              </span>
            )}
          </div>

          {hasActiveFilters && onClearFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center"
            >
              <FaTimes className="mr-2" />
              Xóa bộ lọc
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BookSearchForm;
