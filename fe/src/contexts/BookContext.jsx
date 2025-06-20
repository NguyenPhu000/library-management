import { createContext, useContext, useEffect, useState } from "react";
import bookService from "../services/bookservice";

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await bookService.getBooks();
        setBooks(response.books);
        setFilteredBooks(response.books);
      } catch (error) {
        console.error("Lỗi khi tải danh sách sách:", error);
        setError("Không thể tải danh sách sách");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filterByCategory = async (categoryId) => {
    setLoading(true);
    setError(null);
    setSelectedCategory(categoryId);
    try {
      if (categoryId === "all") {
        setFilteredBooks(books);
      } else {
        const response = await bookService.getBooksByCategory(categoryId);
        setFilteredBooks(response.books);
      }
    } catch (error) {
      console.error("Lỗi khi lọc sách theo danh mục:", error);
      setError("Không thể lọc sách theo danh mục");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider
      value={{
        books,
        filteredBooks,
        loading,
        error,
        selectedCategory,
        filterByCategory,
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => useContext(BookContext);
