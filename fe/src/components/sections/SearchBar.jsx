import React, { useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { SearchBookContext } from "../../contexts/SearchBookContext";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { searchBooks, resetCategory } = useContext(SearchBookContext);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();
    if (!searchQuery.trim()) {
      return;
    }

    try {
      const criteria = "title";
      await searchBooks(criteria, searchQuery);
      resetCategory();
      navigate(`/books?q=${searchQuery}`);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  return (
    <form onSubmit={handleSearchSubmit} className="relative">
      <input
        type="text"
        placeholder="Tìm kiếm..."
        className="bg-gray-800 border border-gray-700 text-white rounded-full px-5 py-2 pl-10 w-48 focus:w-64 focus:ring-2 focus:ring-lightGreen focus:border-lightGreen outline-none transition-all"
        value={searchQuery}
        onChange={handleInputChange}
      />
      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
    </form>
  );
};

export default SearchBar;
