import React from "react";
import { useMember } from "../contexts/MemberContext";
import { useAuth } from "../contexts/AuthContext";
import UpdateProfileButton from "../components/sections/UpdateProfile";
import {
  FaUser,
  FaIdCard,
  FaCalendarAlt,
  FaBook,
  FaHistory,
  FaExclamationTriangle,
  FaCheckCircle,
  FaCrown,
  FaEnvelope,
  FaUserGraduate,
  FaClock,
  FaEdit,
} from "react-icons/fa";

const ProfilePage = () => {
  const { memberData, loading, error } = useMember();
  const { currentUser } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center transition-colors duration-300">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-gray-600 transition-colors duration-300">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">
            Đang tải thông tin hồ sơ...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center transition-colors duration-300">
        <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl border-2 border-red-300 dark:border-red-600 transition-colors duration-300">
          <FaExclamationTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400 font-medium text-lg mb-2 transition-colors duration-300">
            {error}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
            Vui lòng thử lại sau
          </p>
        </div>
      </div>
    );
  }

  const userName =
    currentUser?.fullName || currentUser?.username || "Thành viên";
  const userRole =
    currentUser?.role === "member"
      ? "Thành viên"
      : currentUser?.role || "Thành viên";
  const memberCode = memberData?.member_code || `MEM-${currentUser?.id || ""}`;
  const currentLoans = memberData?.current_loans || 0;
  const maxLoans = memberData?.max_loans || 5;
  const remainingBooks = Math.max(0, maxLoans - currentLoans);

  // Check membership status
  const isExpired = memberData?.expiry_date
    ? new Date(memberData.expiry_date) < new Date()
    : false;
  const daysUntilExpiry = memberData?.expiry_date
    ? Math.ceil(
        (new Date(memberData.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
      )
    : 0;

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-4 space-y-8">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden transition-colors duration-300 hover:shadow-3xl">
          <div className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-700 dark:via-gray-800 dark:to-gray-900 px-8 py-12 text-gray-900 dark:text-white transition-colors duration-300">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-400 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-emerald-400 rounded-full translate-x-8 translate-y-8"></div>
            </div>

            <div className="relative flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-28 h-28 rounded-2xl bg-emerald-500/30 dark:bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center text-emerald-700 dark:text-emerald-200 font-bold text-3xl border-3 border-emerald-500/50 dark:border-emerald-500/30 shadow-2xl transition-colors duration-300">
                  {getInitials(userName)}
                </div>
                <div className="absolute -bottom-3 -right-3 bg-emerald-500 text-white dark:text-gray-900 text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg border-2 border-white dark:border-gray-800">
                  {userRole}
                </div>
              </div>

              {/* User Info */}
              <div className="text-center lg:text-left flex-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 transition-colors duration-300">
                  {userName}
                </h1>
                <div className="flex flex-col lg:flex-row lg:items-center gap-3 text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <FaIdCard className="w-4 h-4 text-emerald-400" />
                    <span className="font-medium text-sm">{memberCode}</span>
                  </div>
                  <div className="hidden lg:block w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold justify-center lg:justify-start border-2 shadow-lg ${
                      isExpired
                        ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 border-red-400 dark:border-red-500/30"
                        : "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-400 dark:border-emerald-500/30"
                    }`}
                  >
                    {isExpired ? (
                      <FaExclamationTriangle className="w-3 h-3" />
                    ) : (
                      <FaCheckCircle className="w-3 h-3" />
                    )}
                    <span>{isExpired ? "Hết hạn" : "Hoạt động"}</span>
                  </div>
                </div>
              </div>

              {/* Update Button */}
              <div className="flex-shrink-0">
                <UpdateProfileButton />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Đang mượn"
            value={currentLoans}
            icon={<FaBook className="w-5 h-5" />}
            color="blue"
            subtitle="cuốn sách"
          />
          <StatsCard
            title="Còn lại"
            value={remainingBooks}
            icon={<FaBook className="w-5 h-5" />}
            color="emerald"
            subtitle="có thể mượn"
          />
          <StatsCard
            title="Lịch sử"
            value={7}
            icon={<FaHistory className="w-5 h-5" />}
            color="purple"
            subtitle="lần mượn"
          />
          <StatsCard
            title="Trạng thái"
            value={isExpired ? "Hết hạn" : "Hoạt động"}
            icon={
              isExpired ? (
                <FaExclamationTriangle className="w-5 h-5" />
              ) : (
                <FaCheckCircle className="w-5 h-5" />
              )
            }
            color={isExpired ? "red" : "emerald"}
            subtitle={isExpired ? "Cần gia hạn" : "Bình thường"}
          />
        </div>

        {/* Information Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Account Information */}
          <InfoCard
            title="Thông tin Tài khoản"
            icon={<FaUser className="w-5 h-5" />}
            items={[
              {
                label: "Họ và Tên",
                value:
                  currentUser?.last_name && currentUser?.first_name
                    ? `${currentUser.first_name} ${currentUser.last_name}`
                    : "Chưa cập nhật",
                icon: <FaUser />,
              },
              {
                label: "Email",
                value: currentUser?.email || "Chưa cập nhật",
                icon: <FaEnvelope />,
              },
              {
                label: "Tên đăng nhập",
                value: currentUser?.username || "",
                icon: <FaUserGraduate />,
              },
              {
                label: "Vai trò",
                value: userRole,
                icon: <FaCrown />,
                highlight: true,
              },
            ]}
          />

          {/* Membership Information */}
          <InfoCard
            title="Thông tin Thẻ Thành Viên"
            icon={<FaIdCard className="w-5 h-5" />}
            items={[
              {
                label: "Mã thành viên",
                value: memberCode,
                icon: <FaIdCard />,
                highlight: true,
              },
              {
                label: "Ngày tham gia",
                value: memberData?.join_date
                  ? new Date(memberData.join_date).toLocaleDateString("vi-VN")
                  : "Chưa ghi nhận",
                icon: <FaCalendarAlt />,
              },
              {
                label: "Ngày hết hạn",
                value: memberData?.expiry_date
                  ? new Date(memberData.expiry_date).toLocaleDateString("vi-VN")
                  : "Chưa ghi nhận",
                icon: <FaClock />,
                warning: isExpired,
              },
              {
                label: "Trạng thái thẻ",
                value: memberData?.status || "Đang hoạt động",
                icon: isExpired ? <FaExclamationTriangle /> : <FaCheckCircle />,
                warning: isExpired,
              },
            ]}
          />
        </div>

        {/* Warning for expired membership */}
        {isExpired && (
          <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-2xl p-6 transition-colors duration-300">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-200 dark:bg-red-900/50 rounded-xl flex items-center justify-center transition-colors duration-300">
                <FaExclamationTriangle className="w-5 h-5 text-red-600 dark:text-red-400 transition-colors duration-300" />
              </div>
              <div>
                <h3 className="text-red-700 dark:text-red-300 font-semibold text-lg mb-2 transition-colors duration-300">
                  Thẻ thành viên đã hết hạn
                </h3>
                <p className="text-red-600 dark:text-red-400 transition-colors duration-300">
                  Vui lòng liên hệ thư viện để gia hạn thẻ thành viên và tiếp
                  tục sử dụng dịch vụ.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color, subtitle }) => {
  const colorClasses = {
    blue: "border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-blue-100 dark:shadow-blue-900/50",
    emerald:
      "border-2 border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 shadow-emerald-100 dark:shadow-emerald-900/50",
    purple:
      "border-2 border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 shadow-purple-100 dark:shadow-purple-900/50",
    red: "border-2 border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-red-100 dark:shadow-red-900/50",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-gray-600 p-6 hover:shadow-3xl hover:border-emerald-300 dark:hover:border-emerald-600/50 transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${colorClasses[color]}`}
        >
          {icon}
        </div>
      </div>
      <div>
        <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1 transition-colors duration-300">
          {title}
        </p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">
          {value}
        </p>
        <p className="text-gray-500 dark:text-gray-400 text-xs transition-colors duration-300">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

// Info Card Component
const InfoCard = ({ title, icon, items }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-300 dark:border-gray-600 overflow-hidden transition-colors duration-300 hover:shadow-3xl hover:border-emerald-300 dark:hover:border-emerald-600/50">
      <div className="bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 dark:bg-gradient-to-r dark:from-gray-700/50 dark:via-gray-600/50 dark:to-gray-700/50 px-6 py-4 border-b-2 border-gray-300 dark:border-gray-600 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-200 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center transition-colors duration-300 border border-emerald-300 dark:border-emerald-700">
            <div className="text-emerald-700 dark:text-emerald-400 transition-colors duration-300">
              {icon}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white transition-colors duration-300">
            {title}
          </h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-700/30 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700/50 transition-colors duration-200 border border-gray-200 dark:border-gray-600/50 hover:border-emerald-200 dark:hover:border-emerald-700/50"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-300 border ${
                item.warning
                  ? "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 border-red-200 dark:border-red-700"
                  : item.highlight
                  ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700"
                  : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-500"
              }`}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 transition-colors duration-300">
                {item.label}
              </p>
              <p
                className={`text-sm font-semibold truncate transition-colors duration-300 ${
                  item.warning
                    ? "text-red-600 dark:text-red-400"
                    : item.highlight
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
