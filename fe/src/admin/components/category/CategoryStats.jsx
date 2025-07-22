import React from "react";
import { FaTags, FaBook, FaListAlt, FaChartBar } from "react-icons/fa";

const CategoryStats = ({ categories = [] }) => {
  const stats = React.useMemo(() => {
    const total = categories.length;
    const withBooks = categories.filter((cat) => cat.bookCount > 0).length;
    const empty = total - withBooks;
    const totalBooks = categories.reduce(
      (sum, cat) => sum + (cat.bookCount || 0),
      0
    );

    return { total, withBooks, empty, totalBooks };
  }, [categories]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Tổng danh mục</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </div>
          <FaTags className="text-4xl text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Có sách</p>
            <p className="text-3xl font-bold">{stats.withBooks}</p>
          </div>
          <FaBook className="text-4xl text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-100">Danh mục trống</p>
            <p className="text-3xl font-bold">{stats.empty}</p>
          </div>
          <FaListAlt className="text-4xl text-gray-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Tổng sách</p>
            <p className="text-3xl font-bold">{stats.totalBooks}</p>
          </div>
          <FaChartBar className="text-4xl text-purple-200" />
        </div>
      </div>
    </div>
  );
};

export default CategoryStats;
