import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200 transition-colors duration-300">
          404
        </h1>
        <p className="text-2xl font-medium text-gray-600 dark:text-gray-400 mt-4 transition-colors duration-300">
          Trang không tồn tại
        </p>
        <p className="text-gray-500 dark:text-gray-400 mt-4 mb-8 transition-colors duration-300">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        <Link
          to="/home"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium rounded-md transition-colors"
        >
          Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
