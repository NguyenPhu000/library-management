import React, { createContext, useState, useCallback } from "react";
import bookService from "../services/bookservice";
import Swal from "sweetalert2";
// Tạo SearchBookContext
export const SearchBookContext = createContext();

// SearchBookProvider component
export const SearchBookProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Hàm tìm kiếm sách
  const searchBooks = useCallback(async (criteria, query) => {
    setSearchLoading(true);
    setSearchError(null);
    setIsSearching(true);
    try {
      const data = await bookService.searchBooks(criteria, query);
      setSearchResults(data.books || []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách trong Context:", error);
      setSearchError(error);
      setSearchResults([]);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể tìm kiếm sách!",
      });
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const resetSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  const contextValue = {
    searchResults,
    searchLoading,
    searchError,
    searchBooks,
    resetSearch,
    isSearching,
  };

  return (
    <SearchBookContext.Provider value={contextValue}>
      {children}
    </SearchBookContext.Provider>
  );
};
