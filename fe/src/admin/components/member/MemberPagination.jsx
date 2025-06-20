import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { useMemberAdmin } from "../../contexts/MemberAdminContext";

const MemberPagination = () => {
  const {
    currentPage,
    totalPages,
    totalMembers,
    itemsPerPage,
    members,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToNextPage,
    goToPrevPage,
  } = useMemberAdmin();

  // Calculate display info
  const startItem =
    totalMembers === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalMembers);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    const pages = [];

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page with context
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (totalMembers === 0) {
    return null;
  }

  return (
    <div className="bg-white px-3 lg:px-4 xl:px-6 py-3 lg:py-4 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        {/* Results info */}
        <div className="text-xs lg:text-sm text-gray-700">
          Hiển thị <span className="font-medium">{startItem}</span> -{" "}
          <span className="font-medium">{endItem}</span> trong tổng số{" "}
          <span className="font-medium">{totalMembers}</span> thành viên
        </div>

        {/* Pagination controls */}
        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* First page */}
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Trang đầu"
          >
            <FaAngleDoubleLeft className="h-3 lg:h-4 w-3 lg:w-4" />
            <span className="hidden sm:ml-1 sm:inline">Đầu</span>
          </button>

          {/* Previous page */}
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Trang trước"
          >
            <FaChevronLeft className="h-3 lg:h-4 w-3 lg:w-4" />
            <span className="hidden sm:ml-1 sm:inline">Trước</span>
          </button>

          {/* Page numbers */}
          <div className="hidden sm:flex items-center space-x-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-sm text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => goToPage(page)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? "text-white bg-purple-600 border border-purple-600 hover:bg-purple-700"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Mobile page indicator */}
          <div className="sm:hidden px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg">
            {currentPage}/{totalPages}
          </div>

          {/* Next page */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Trang sau"
          >
            <span className="hidden sm:mr-1 sm:inline">Sau</span>
            <FaChevronRight className="h-3 lg:h-4 w-3 lg:w-4" />
          </button>

          {/* Last page */}
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="inline-flex items-center px-2 lg:px-3 py-1 lg:py-2 text-xs lg:text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Trang cuối"
          >
            <span className="hidden sm:mr-1 sm:inline">Cuối</span>
            <FaAngleDoubleRight className="h-3 lg:h-4 w-3 lg:w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberPagination;
