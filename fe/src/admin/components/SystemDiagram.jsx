import React from "react";
import {
  FaDatabase,
  FaServer,
  FaUsers,
  FaBook,
  FaExchangeAlt,
  FaMoneyBillWave,
  FaUserShield,
  FaArrowRight,
  FaArrowDown,
  FaCogs,
  FaChartLine,
} from "react-icons/fa";

const SystemDiagram = ({ stats }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-semibold mb-6 flex items-center">
        <FaCogs className="text-blue-600 mr-2" />
        Sơ đồ Kiến trúc Hệ thống
      </h3>

      <div className="relative">
        {/* Database Layer */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600">
            <div className="flex items-center space-x-2">
              <FaDatabase className="text-blue-600 text-xl" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Database
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              MySQL/PostgreSQL
            </div>
          </div>
        </div>

        {/* Arrow from Database to Server */}
        <div className="flex justify-center mb-4">
          <FaArrowDown className="text-gray-400 text-xl" />
        </div>

        {/* Server Layer */}
        <div className="flex justify-center mb-8">
          <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border-2 border-green-300 dark:border-green-600">
            <div className="flex items-center space-x-2">
              <FaServer className="text-green-600 text-xl" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                API Server
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Node.js + Express
            </div>
          </div>
        </div>

        {/* Arrow from Server to Modules */}
        <div className="flex justify-center mb-4">
          <FaArrowDown className="text-gray-400 text-xl" />
        </div>

        {/* Business Logic Modules */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Users Module */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700 text-center">
            <FaUsers className="text-blue-600 text-2xl mx-auto mb-2" />
            <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
              Quản lý Users
            </div>
            <div className="text-xs text-blue-600 font-bold">
              {stats?.totalMembers || 0}
            </div>
          </div>

          {/* Books Module */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-700 text-center">
            <FaBook className="text-purple-600 text-2xl mx-auto mb-2" />
            <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
              Quản lý Sách
            </div>
            <div className="text-xs text-purple-600 font-bold">
              {stats?.totalBooks || 0}
            </div>
          </div>

          {/* Loans Module */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-700 text-center">
            <FaExchangeAlt className="text-orange-600 text-2xl mx-auto mb-2" />
            <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
              Mượn Trả
            </div>
            <div className="text-xs text-orange-600 font-bold">
              {stats?.activeLoans || 0}
            </div>
          </div>

          {/* Payments Module */}
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-700 text-center">
            <FaMoneyBillWave className="text-green-600 text-2xl mx-auto mb-2" />
            <div className="font-medium text-gray-800 dark:text-gray-200 text-sm">
              Thanh toán
            </div>
            <div className="text-xs text-green-600 font-bold">
              {stats?.totalPayments || 0}
            </div>
          </div>
        </div>

        {/* Arrow to Admin Panel */}
        <div className="flex justify-center mb-4">
          <FaArrowDown className="text-gray-400 text-xl" />
        </div>

        {/* Admin Panel */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-lg border-2 border-red-300 dark:border-red-600">
            <div className="flex items-center space-x-2">
              <FaUserShield className="text-red-600 text-xl" />
              <span className="font-semibold text-gray-800 dark:text-gray-200">
                Admin Dashboard
              </span>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              React + Analytics
            </div>
          </div>
        </div>

        {/* Data Flow Indicators */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
            <FaChartLine className="text-indigo-600 mr-2" />
            Luồng Dữ liệu Chính
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Đăng ký thành viên
              </span>
              <FaArrowRight className="text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Xác thực</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Mượn sách
              </span>
              <FaArrowRight className="text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                Cập nhật kho
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">Quá hạn</span>
              <FaArrowRight className="text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                Tính phí phạt
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 dark:text-gray-300">
                Thanh toán
              </span>
              <FaArrowRight className="text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">
                Cập nhật trạng thái
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemDiagram;
