import React from "react";

const StatCard = ({
  title,
  value,
  icon,
  color = "blue",
  trend,
  subtitle,
  onClick,
  className = "",
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-gradient-to-br from-primary-500 to-primary-600 dark:from-primary-600 dark:to-primary-700",
      text: "text-primary-600 dark:text-primary-400",
      border: "border-primary-500",
      iconBg: "bg-primary-100 dark:bg-primary-900/50",
    },
    green: {
      bg: "bg-gradient-to-br from-success-500 to-success-600 dark:from-success-600 dark:to-success-700",
      text: "text-success-600 dark:text-success-400",
      border: "border-success-500",
      iconBg: "bg-success-100 dark:bg-success-900/50",
    },
    yellow: {
      bg: "bg-gradient-to-br from-warning-500 to-warning-600 dark:from-warning-600 dark:to-warning-700",
      text: "text-warning-600 dark:text-warning-400",
      border: "border-warning-500",
      iconBg: "bg-warning-100 dark:bg-warning-900/50",
    },
    red: {
      bg: "bg-gradient-to-br from-danger-500 to-danger-600 dark:from-danger-600 dark:to-danger-700",
      text: "text-danger-600 dark:text-danger-400",
      border: "border-danger-500",
      iconBg: "bg-danger-100 dark:bg-danger-900/50",
    },
    purple: {
      bg: "bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-500",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
    },
    indigo: {
      bg: "bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700",
      text: "text-indigo-600 dark:text-indigo-400",
      border: "border-indigo-500",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
    },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:scale-105
        bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
        animate-fade-in
        ${onClick ? "cursor-pointer hover:shadow-2xl" : ""} ${className}
      `}
      onClick={onClick}
    >
      {/* Gradient accent border */}
      <div className={`absolute top-0 left-0 w-full h-1 ${colors.bg}`}></div>

      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-start sm:items-center gap-3 mb-3">
              {icon && (
                <div
                  className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${colors.iconBg}`}
                >
                  <div className={`${colors.text} text-lg sm:text-xl`}>
                    {icon}
                  </div>
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide truncate">
                  {title}
                </p>
                {subtitle && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-end gap-2 flex-wrap">
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                {value}
              </p>
              {trend && (
                <span
                  className={`
                  text-xs sm:text-sm font-medium flex items-center gap-1 flex-shrink-0
                  ${
                    trend.type === "up"
                      ? "text-success-600 dark:text-success-400"
                      : trend.type === "down"
                      ? "text-danger-600 dark:text-danger-400"
                      : "text-gray-600 dark:text-gray-400"
                  }
                `}
                >
                  {trend.icon}
                  <span className="hidden sm:inline">{trend.value}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hover gradient overlay */}
      <div
        className={`
        absolute inset-0 opacity-0 hover:opacity-5 transition-opacity duration-300
        ${colors.bg}
      `}
      ></div>

      {/* Mobile click indicator */}
      {onClick && (
        <div className="absolute bottom-2 right-2 opacity-30 sm:hidden">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default StatCard;
