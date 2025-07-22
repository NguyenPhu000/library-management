import React from "react";
import {
  FaSearch,
  FaFilter,
  FaSortAmountUp,
  FaSortAmountDown,
} from "react-icons/fa";

const CategorySearchForm = ({
  searchTerm,
  setSearchTerm,
  filterBy,
  setFilterBy,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  totalCategories = 0,
  filteredCount = 0,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filter */}
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Tất cả danh mục</option>
            <option value="withBooks">Có sách</option>
            <option value="empty">Trống</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="bookCount">Sắp xếp theo số sách</option>
            <option value="created_at">Sắp xếp theo ngày tạo</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <button
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

      {/* Results Summary */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        {searchTerm || filterBy !== "all" ? (
          <p>
            Hiển thị {filteredCount} / {totalCategories} danh mục
            {searchTerm && ` với từ khóa "${searchTerm}"`}
          </p>
        ) : (
          <p>Hiển thị tất cả {totalCategories} danh mục</p>
        )}
      </div>
    </div>
  );
};

export default CategorySearchForm;
