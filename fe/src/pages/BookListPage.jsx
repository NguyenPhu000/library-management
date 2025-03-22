import React, { useContext } from "react";
import { useBook } from "../contexts/BookContext";
import { SearchBookContext } from "../contexts/SearchBookContext";
import BookList from "../components/sections/BookList";
import CategoryFilter from "../components/sections/CategoryFilter";

const BookListPage = () => {
  const { filteredBooks, loading: bookLoading, selectedCategory } = useBook();
  const { searchResults, searchLoading, searchError, isSearching } =
    useContext(SearchBookContext);

  let booksToDisplay = isSearching ? searchResults : filteredBooks;
  if (selectedCategory) {
    booksToDisplay = booksToDisplay.filter(
      (book) => book.category_id === selectedCategory
    );
  }

  let currentLoading = isSearching ? searchLoading : bookLoading;
  return (
    <div className="font-poppins p-4 bg-gray-900 text-white min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <CategoryFilter className="mb-8" />
        {searchError && (
          <div className="text-red-500 text-center mb-4">
            Lỗi tìm kiếm: {searchError.message || "Có lỗi xảy ra khi tìm kiếm."}
          </div>
        )}
        <BookList books={booksToDisplay} loading={currentLoading} />
      </div>
    </div>
  );
};

export default BookListPage;
