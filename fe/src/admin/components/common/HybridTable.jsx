import React from "react";

const HybridTable = ({
  columns,
  data,
  loading = false,
  emptyMessage = "Không có dữ liệu",
  renderMobileCard,
  keyField = "id",
  mobileBreakpoint = "md",
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {/* Desktop loading */}
        <div
          className={`hidden ${mobileBreakpoint}:block responsive-table-wrapper`}
        >
          <div className="animate-pulse">
            <div className="h-12 bg-gray-200 dark:bg-gray-700"></div>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <div className="h-16 bg-gray-100 dark:bg-gray-750"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile loading */}
        <div className={`${mobileBreakpoint}:hidden space-y-4`}>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="responsive-card animate-pulse">
              <div className="flex space-x-4">
                <div className="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="responsive-table-wrapper">
        <div className="p-8 text-center">
          <div className="text-gray-400 dark:text-gray-500 mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {emptyMessage}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Không tìm thấy dữ liệu nào.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Desktop Table View */}
      <div
        className={`hidden ${mobileBreakpoint}:block responsive-table-wrapper`}
      >
        {/* Mobile scroll hint */}
        <div className="mobile-scroll-hint">
          <div className="flex items-center">
            <span className="mr-2">💡</span>
            Vuốt sang trái để xem thêm thông tin
          </div>
        </div>

        <div className="responsive-table-scroll">
          <table className="responsive-table">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                      column.className || ""
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((item, index) => (
                <tr
                  key={item[keyField] || index}
                  className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td
                      key={colIndex}
                      className={`whitespace-nowrap text-sm text-gray-900 dark:text-white ${
                        column.cellClassName || ""
                      }`}
                    >
                      {column.render
                        ? column.render(item, index)
                        : item[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className={`${mobileBreakpoint}:hidden space-y-4`}>
        {data.map((item, index) => (
          <div key={item[keyField] || index}>
            {renderMobileCard ? (
              renderMobileCard(item, index)
            ) : (
              <div className="responsive-card">
                <div className="responsive-card-header">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    #{index + 1}
                  </span>
                </div>
                <div className="responsive-card-content">
                  {columns
                    .filter((col) => !col.hideInMobile)
                    .map((column, colIndex) => (
                      <div key={colIndex} className="responsive-card-field">
                        <span className="responsive-card-label">
                          {column.header}:
                        </span>
                        <span className="responsive-card-value">
                          {column.render
                            ? column.render(item, index)
                            : item[column.accessor]}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default HybridTable;
