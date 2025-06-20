import React from "react";
import {
  FaChevronLeft,
  FaChevronRight,
  FaStepBackward,
  FaStepForward,
} from "react-icons/fa";
import { useUserAdmin } from "../../contexts/UserAdminContext";

const UserPagination = () => {
  const {
    currentPage,
    totalPages,
    totalUsers,
    usersPerPage,
    goToPage,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
  } = useUserAdmin();

  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];
    let l;

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
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const startItem = (currentPage - 1) * usersPerPage + 1;
  const endItem = Math.min(currentPage * usersPerPage, totalUsers);

  return (
    <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
        {/* Page Info */}
        <div className="text-sm text-gray-700">
          Hiển thị <span className="font-medium">{startItem}</span> đến{" "}
          <span className="font-medium">{endItem}</span> trong tổng số{" "}
          <span className="font-medium">{totalUsers}</span> người dùng
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-1">
          {/* First Page */}
          <button
            onClick={goToFirstPage}
            disabled={currentPage === 1}
            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            title="Trang đầu"
          >
            <FaStepBackward />
          </button>

          {/* Previous Page */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            title="Trang trước"
          >
            <FaChevronLeft />
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === "..." ? (
                <span className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border-t border-b border-gray-300">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => goToPage(page)}
                  className={`px-3 py-2 text-sm font-medium border-t border-b border-gray-300 transition-colors ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Next Page */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            title="Trang sau"
          >
            <FaChevronRight />
          </button>

          {/* Last Page */}
          <button
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
            className="px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
            title="Trang cuối"
          >
            <FaStepForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPagination;
