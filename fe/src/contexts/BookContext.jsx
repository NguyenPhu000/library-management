import { createContext, useContext, useEffect, useState } from "react";
import bookService from "../services/bookservice";
import Swal from "sweetalert2";

const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await bookService.getBooks();
        setBooks(response.books);
        setFilteredBooks(response.books);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi",
          text: "Không thể lấy danh sách sách!",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const filterByCategory = async (categoryId) => {
    setLoading(true);
    try {
      if (categoryId === "all") {
        setFilteredBooks(books);
      } else {
        const response = await bookService.getBooksByCategory(categoryId);
        setFilteredBooks(response.books);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Không thể lọc sách theo danh mục!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider
      value={{ books, filteredBooks, loading, filterByCategory }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBook = () => useContext(BookContext);
