import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useMemberAdmin } from "../../contexts/MemberAdminContext";

const MemberSearchForm = () => {
  const { searchTerm, searchCriteria, handleSearch, clearSearch } =
    useMemberAdmin();

  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localCriteria, setLocalCriteria] = useState(searchCriteria);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(localSearchTerm, localCriteria);
  };

  const handleClear = () => {
    setLocalSearchTerm("");
    setLocalCriteria("username");
    clearSearch();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Criteria */}
        <div>
          <label
            htmlFor="criteria"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Tìm kiếm theo
          </label>
          <select
            id="criteria"
            value={localCriteria}
            onChange={(e) => setLocalCriteria(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="username">Tên đăng nhập</option>
            <option value="memberCode">Mã thành viên</option>
            <option value="email">Email</option>
            <option value="phone">Số điện thoại</option>
            <option value="status">Trạng thái</option>
          </select>
        </div>

        {/* Search Input */}
        <div className="sm:col-span-1 lg:col-span-2">
          <label
            htmlFor="query"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Từ khóa tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              id="query"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end space-x-2">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaSearch className="mr-2 h-4 w-4" />
            Tìm kiếm
          </button>

          {(searchTerm || localSearchTerm) && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
              title="Xóa bộ lọc"
            >
              <FaTimes className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default MemberSearchForm;
