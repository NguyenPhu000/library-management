import React, { useContext, useEffect } from "react";
import { useBook } from "../contexts/BookContext";
import { SearchBookContext } from "../contexts/SearchBookContext";
import BookList from "../components/sections/BookList";
import CategoryFilter from "../components/sections/CategoryFilter";
import { useLocation } from "react-router-dom";

const BookListPage = () => {
  const { filteredBooks, loading: bookLoading, error: bookError } = useBook();

  const {
    searchResults,
    searchLoading,
    searchError,
    isSearching,
    selectedCategory,
    searchBooks,
    resetSearch,
    resetCategory,
  } = useContext(SearchBookContext);

  const location = useLocation();

  // Đồng bộ kết quả tìm kiếm với tham số truy vấn "q" trên URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get("q");

    // Nếu có tham số q => thực hiện tìm kiếm
    if (queryParam && queryParam.trim()) {
      // Chỉ thực hiện tìm kiếm khi từ khoá trên URL thay đổi
      searchBooks("all", queryParam.trim());
      resetCategory(); // Reset bộ lọc thể loại khi tìm kiếm mới
    } else {
      // Không có query => trả về trạng thái mặc định
      resetSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Xác định sách hiển thị dựa trên trạng thái tìm kiếm và thể loại
  let booksToDisplay = isSearching ? searchResults : filteredBooks;

  // Lọc theo thể loại nếu đã chọn
  if (selectedCategory) {
    booksToDisplay = booksToDisplay.filter((book) => {
      // Kiểm tra xem sách có thuộc về thể loại được chọn không
      if (book.categories && book.categories.length > 0) {
        return book.categories.some(
          (cat) => cat.category_id === selectedCategory
        );
      } else if (book.category_id) {
        // Trường hợp sách có trường category_id trực tiếp
        return book.category_id === selectedCategory;
      }
      return false;
    });
  }

  let currentLoading = isSearching ? searchLoading : bookLoading;
  let currentError = isSearching ? searchError : bookError;

  return (
    <div className="font-poppins p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-300">
      <div className="container mx-auto px-4 py-6">
        <CategoryFilter className="mb-6" />

        {isSearching && searchResults.length > 0 && (
          <div className="mb-4 text-gray-600 dark:text-gray-300">
            <p>
              Tìm thấy {booksToDisplay.length} kết quả{" "}
              {selectedCategory ? "(đã lọc theo thể loại)" : ""}
            </p>
          </div>
        )}

        {searchError && (
          <div className="text-red-500 text-center mb-4">
            Lỗi tìm kiếm: {searchError.message || "Có lỗi xảy ra khi tìm kiếm."}
          </div>
        )}

        <BookList
          books={booksToDisplay}
          loading={currentLoading}
          error={currentError}
        />

        {isSearching && searchResults.length === 0 && !searchLoading && (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">
            <p className="text-xl">
              Không tìm thấy sách phù hợp với từ khóa tìm kiếm.
            </p>
            <p className="mt-2">
              Vui lòng thử từ khóa khác hoặc xem tất cả sách trong thư viện.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookListPage;
