import React from "react";

const StatCard = ({ icon, title, value, color = "blue" }) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      text: "text-blue-600 dark:text-blue-400",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      text: "text-green-600 dark:text-green-400",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      text: "text-purple-600 dark:text-purple-400",
    },
  };

  const { bg, text } = colorClasses[color] || colorClasses.blue;

  return (
    <div className="p-6 rounded-xl shadow-sm bg-white dark:bg-gray-800">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${bg}`}>
          <div className={`${text}`}>{icon}</div>
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
            {title}
          </p>
          <h3 className={`text-2xl font-bold mt-1 ${text}`}>
            {value.toLocaleString()}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
