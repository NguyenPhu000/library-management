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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Search Criteria */}
        <div>
          <label
            htmlFor="criteria"
            className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2"
          >
            Tìm kiếm theo
          </label>
          <select
            id="criteria"
            value={localCriteria}
            onChange={(e) => setLocalCriteria(e.target.value)}
            className="w-full px-2 lg:px-3 py-1.5 lg:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-xs lg:text-sm"
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
            className="block text-xs lg:text-sm font-medium text-gray-700 mb-1 lg:mb-2"
          >
            Từ khóa tìm kiếm
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-2 lg:pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-3 lg:h-4 w-3 lg:w-4 text-gray-400" />
            </div>
            <input
              type="text"
              id="query"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm..."
              className="w-full pl-8 lg:pl-10 pr-3 lg:pr-4 py-1.5 lg:py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs lg:text-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end space-x-2 sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center px-2 lg:px-4 py-1.5 lg:py-2 bg-blue-600 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
          >
            <FaSearch className="mr-1 lg:mr-2 h-3 lg:h-4 w-3 lg:w-4" />
            <span className="hidden sm:inline">Tìm kiếm</span>
            <span className="sm:hidden">Tìm</span>
          </button>

          {(searchTerm || localSearchTerm) && (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center px-2 lg:px-3 py-1.5 lg:py-2 bg-gray-500 text-white text-xs lg:text-sm font-medium rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200 shadow-sm"
              title="Xóa bộ lọc"
            >
              <FaTimes className="h-3 lg:h-4 w-3 lg:w-4" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default MemberSearchForm;
