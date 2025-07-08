import React from "react";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    return Array.from({ length: totalPages }, (_, index) => index + 1).map(
      (pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`mx-1 px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === pageNumber
              ? "bg-lightGreen text-dark"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {pageNumber}
        </button>
      )
    );
  };

  return (
    <div className="flex justify-center mt-6">
      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
        <button
          onClick={handlePrevClick}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={currentPage === 1}
        >
          Trước
        </button>
        {renderPageNumbers()}
        <button
          onClick={handleNextClick}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={currentPage === totalPages}
        >
          Sau
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
