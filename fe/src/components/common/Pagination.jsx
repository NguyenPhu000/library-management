import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

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

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        rangeWithDots.push(totalPages);
      }
    }

    return rangeWithDots;
  };

  const renderPageNumbers = () => {
    const pages = getVisiblePages();

    return pages.map((pageNumber, index) => {
      if (pageNumber === "...") {
        return (
          <span
            key={`dots-${index}`}
            className="px-3 py-2 text-library-text-muted font-medium"
          >
            ...
          </span>
        );
      }

      return (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`mx-1 px-4 py-2 rounded-library text-sm font-medium transition-all duration-200 ${
            currentPage === pageNumber
              ? "bg-library-primary text-white shadow-library-button"
              : "bg-library-surface text-library-text-secondary hover:bg-library-primary/10 hover:text-library-primary border border-library-border"
          }`}
        >
          {pageNumber}
        </button>
      );
    });
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mt-8 space-y-4">
      {/* Pagination Info */}
      <div className="text-sm text-library-text-muted">
        Hiển thị{" "}
        <span className="font-medium text-library-text-secondary">
          {(currentPage - 1) * itemsPerPage + 1}
        </span>{" "}
        đến{" "}
        <span className="font-medium text-library-text-secondary">
          {Math.min(currentPage * itemsPerPage, totalItems)}
        </span>{" "}
        trong tổng số{" "}
        <span className="font-medium text-library-primary">{totalItems}</span>{" "}
        kết quả
      </div>

      {/* Pagination Controls */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Previous Button */}
        <button
          onClick={handlePrevClick}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-library border transition-all duration-200 ${
            currentPage === 1
              ? "bg-library-surface text-library-text-muted border-library-border cursor-not-allowed opacity-50"
              : "bg-library-surface text-library-text-secondary border-library-border hover:bg-library-primary hover:text-white hover:border-library-primary"
          }`}
          disabled={currentPage === 1}
        >
          <FontAwesomeIcon icon={faChevronLeft} className="mr-2 w-3 h-3" />
          Trước
        </button>

        {/* Page Numbers */}
        <div className="flex items-center">{renderPageNumbers()}</div>

        {/* Next Button */}
        <button
          onClick={handleNextClick}
          className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-library border transition-all duration-200 ${
            currentPage === totalPages
              ? "bg-library-surface text-library-text-muted border-library-border cursor-not-allowed opacity-50"
              : "bg-library-surface text-library-text-secondary border-library-border hover:bg-library-primary hover:text-white hover:border-library-primary"
          }`}
          disabled={currentPage === totalPages}
        >
          Sau
          <FontAwesomeIcon icon={faChevronRight} className="ml-2 w-3 h-3" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
