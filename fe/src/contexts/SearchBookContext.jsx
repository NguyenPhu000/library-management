import React, { createContext, useState, useCallback } from "react";
import bookService from "../services/bookservice";

// Tạo SearchBookContext
export const SearchBookContext = createContext();

// SearchBookProvider component
export const SearchBookProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const [isSearching, setIsSearching] = useState(false); // Thêm trạng thái để theo dõi việc tìm kiếm

  // Hàm tìm kiếm sách
  const searchBooks = useCallback(async (criteria, query) => {
    setSearchLoading(true);
    setSearchError(null);
    setIsSearching(true); // Đánh dấu là đang tìm kiếm
    try {
      const data = await bookService.searchBooks(criteria, query);
      setSearchResults(data.books || []);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sách trong Context:", error);
      setSearchError(error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // Hàm để quay lại danh sách sách theo category
  const resetSearch = () => {
    setSearchResults([]);
    setIsSearching(false);
  };

  const contextValue = {
    searchResults,
    searchLoading,
    searchError,
    searchBooks,
    resetSearch, // Cung cấp hàm resetSearch cho context
    isSearching, // Cung cấp trạng thái tìm kiếm
  };

  return (
    <SearchBookContext.Provider value={contextValue}>
      {children}
    </SearchBookContext.Provider>
  );
};
