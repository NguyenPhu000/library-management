import React from "react";

const InfoCard = ({ title, children, icon, className = "", headerAction }) => {
  return (
    <div
      className={`
      bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700
      overflow-hidden transition-all duration-300 hover:shadow-xl
      ${className}
    `}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-lightGreen to-green-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 bg-white/20 rounded-lg">
                <div className="text-white text-lg">{icon}</div>
              </div>
            )}
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {headerAction && <div className="text-white">{headerAction}</div>}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">{children}</div>
    </div>
  );
};

const InfoItem = ({
  label,
  value,
  icon,
  valueColor = "text-gray-900 dark:text-white",
  className = "",
}) => (
  <div
    className={`
    bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 
    hover:bg-gray-100 dark:hover:bg-gray-700 
    transition-colors duration-200 border border-gray-200 dark:border-gray-600
    ${className}
  `}
  >
    <div className="flex items-center gap-3">
      {icon && <div className="text-lightGreen">{icon}</div>}
      <div className="flex-1">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
          {label}
        </p>
        <p className={`text-sm font-semibold ${valueColor}`}>{value}</p>
      </div>
    </div>
  </div>
);

const UserAvatar = ({ name, role, size = "large", className = "" }) => {
  const sizeClasses = {
    small: "w-12 h-12 text-lg",
    medium: "w-16 h-16 text-xl",
    large: "w-24 h-24 text-3xl",
    xlarge: "w-32 h-32 text-4xl",
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative ${className}`}>
      <div
        className={`
        ${sizeClasses[size]} rounded-full 
        bg-gradient-to-br from-lightGreen to-green-600
        flex items-center justify-center
        text-white font-bold shadow-lg
        border-4 border-white dark:border-gray-800
      `}
      >
        {getInitials(name)}
      </div>

      {role && (
        <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          {role}
        </div>
      )}
    </div>
  );
};

export { InfoCard, InfoItem, UserAvatar };
export default InfoCard;
