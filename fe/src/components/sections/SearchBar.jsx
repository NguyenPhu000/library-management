import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  // Nối SearchBookContext nếu cần trong tương lai
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    // Điều hướng tới trang danh sách sách với tham số truy vấn 'q'
    // Trang BookListPage sẽ tự động đọc tham số này và thực hiện tìm kiếm.
    navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  return (
    <form
      onSubmit={handleSearchSubmit}
      className="relative flex items-center justify-center"
    >
      <FaSearch className="absolute left-4 text-gray-500 pointer-events-none text-lg" />
      <input
        type="text"
        placeholder="Tìm kiếm sách..."
        aria-label="Ô tìm kiếm sách"
        className="bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-full pl-12 pr-12 py-2 w-48 sm:w-60 md:w-72 focus:w-80 md:focus:w-96 text-sm text-gray-100 placeholder-gray-500 transition-all duration-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 outline-none"
        value={searchQuery}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type="submit"
        className="absolute right-4 text-gray-400 hover:text-emerald-400 transition-colors"
      >
        <FaSearch className="text-lg" />
      </button>
    </form>
  );
};

export default SearchBar;
