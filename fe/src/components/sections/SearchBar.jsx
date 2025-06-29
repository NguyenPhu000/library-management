import React, { useState, useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { SearchBookContext } from "../../contexts/SearchBookContext";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
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
      const criteria = "all";
      await searchBooks(criteria, searchQuery);
      resetCategory();
      navigate(`/books?q=${searchQuery}`);
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit(event);
    }
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <form onSubmit={handleSearchSubmit} className="relative">
      <div
        className={`
        relative flex items-center
        ${isFocused ? "ring-2 ring-library-primary-light ring-opacity-50" : ""}
        rounded-library-button overflow-hidden transition-all duration-200
      `}
      >
        <FaSearch className="absolute left-4 text-library-text-muted text-base pointer-events-none" />

        <input
          type="text"
          placeholder="Tìm kiếm sách, tác giả..."
          className="
            bg-library-surface border border-library-border 
            text-library-text-primary rounded-library-button 
            px-5 py-3 pl-12 pr-12 
            w-48 md:w-56 focus:w-64 lg:focus:w-72
            focus:outline-none focus:border-library-primary-light 
            placeholder:text-library-text-muted
            transition-all duration-300 ease-in-out
            text-sm font-medium
          "
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        <button
          type="submit"
          className="
            absolute right-2 top-1/2 transform -translate-y-1/2 
            p-2 rounded-library text-library-text-muted 
            hover:text-library-primary hover:bg-library-hover
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-library-primary-light focus:ring-opacity-50
          "
          aria-label="Tìm kiếm"
        >
          <FaSearch className="text-sm" />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
