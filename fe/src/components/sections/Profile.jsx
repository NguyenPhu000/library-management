import { useMember } from "../../contexts/MemberContext";
import {
  FaUserCircle,
  FaIdCard,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCrown,
  FaUserGraduate,
} from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { memberData, loading, error } = useMember();
  const { currentUser } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-300 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center bg-gray-800 p-8 rounded-2xl shadow-xl border border-red-700">
          <FaExclamationTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-medium text-lg mb-2">{error}</p>
          <p className="text-gray-400 text-sm">Vui lòng thử lại sau</p>
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
  const isExpired = memberData?.expiry_date
    ? new Date(memberData.expiry_date) < new Date()
    : false;

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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Card */}
      <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
        <div className="bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 px-8 py-12 text-white relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-400 rounded-full translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-400 rounded-full -translate-x-12 translate-y-12"></div>
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center text-emerald-100 font-bold text-2xl border-2 border-emerald-500/30 shadow-lg">
                {getInitials(userName)}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-gray-900 text-xs px-3 py-1 rounded-full font-semibold shadow-lg">
                {userRole}
              </div>
            </div>

            {/* User Info */}
            <div className="text-center md:text-left flex-1">
              <h2 className="text-2xl font-bold text-white mb-3">{userName}</h2>
              <div className="flex flex-col md:flex-row md:items-center gap-3 text-gray-300">
                <div className="flex items-center gap-2 justify-center md:justify-start">
                  <FaIdCard className="w-4 h-4 text-emerald-400" />
                  <span className="font-medium text-sm">{memberCode}</span>
                </div>
                <div className="hidden md:block w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                <div
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold justify-center md:justify-start ${
                    isExpired
                      ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
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
          </div>
        </div>
      </div>

      {/* Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Account Information */}
        <InfoCard
          title="Thông tin Tài khoản"
          icon={<FaUser className="w-5 h-5" />}
          items={[
            {
              label: "Họ và Tên",
              value:
                `${currentUser?.first_name || ""} ${
                  currentUser?.last_name || ""
                }` || "Chưa cập nhật",
              icon: <FaUser />,
              highlight: !!(currentUser?.first_name || currentUser?.last_name),
            },
            {
              label: "Email",
              value: currentUser?.email || "Chưa cập nhật",
              icon: <FaEnvelope />,
              highlight: !!currentUser?.email,
            },
            {
              label: "Tên đăng nhập",
              value: currentUser?.username || "",
              icon: <FaUserGraduate />,
              highlight: true,
            },
            {
              label: "Vai trò",
              value: userRole,
              icon: <FaCrown />,
              special: true,
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
              special: true,
            },
            {
              label: "Ngày tham gia",
              value: memberData?.join_date
                ? new Date(memberData.join_date).toLocaleDateString("vi-VN")
                : "Chưa ghi nhận",
              icon: <FaCalendarAlt />,
              highlight: !!memberData?.join_date,
            },
            {
              label: "Ngày hết hạn",
              value: memberData?.expiry_date
                ? new Date(memberData.expiry_date).toLocaleDateString("vi-VN")
                : "Chưa ghi nhận",
              icon: <FaClock />,
              warning: isExpired,
              highlight: !!memberData?.expiry_date,
            },
            {
              label: "Số sách tối đa",
              value: memberData?.max_loans || "5",
              icon: <FaIdCard />,
              highlight: true,
            },
            {
              label: "Đang mượn",
              value: memberData?.current_loans || "0",
              icon: <FaIdCard />,
              highlight: true,
            },
            {
              label: "Trạng thái thẻ",
              value: memberData?.status || "Đang hoạt động",
              icon: isExpired ? <FaExclamationTriangle /> : <FaCheckCircle />,
              warning: isExpired,
              special: true,
            },
          ]}
        />
      </div>

      {/* Warning for expired membership */}
      {isExpired && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-red-900/50 rounded-xl flex items-center justify-center">
              <FaExclamationTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-red-300 font-semibold text-lg mb-2">
                Thẻ thành viên đã hết hạn
              </h3>
              <p className="text-red-400">
                Vui lòng liên hệ thư viện để gia hạn thẻ thành viên và tiếp tục
                sử dụng dịch vụ.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Info Card Component
const InfoCard = ({ title, icon, items }) => {
  return (
    <div className="bg-gray-800 rounded-2xl shadow-xl border border-gray-700 overflow-hidden">
      <div className="bg-gray-700/50 px-6 py-4 border-b border-gray-600">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-900/50 rounded-xl flex items-center justify-center">
            <div className="text-emerald-400">{icon}</div>
          </div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-6 space-y-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gray-700/30 rounded-xl hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.warning
                  ? "bg-red-900/50 text-red-400"
                  : item.special
                  ? "bg-emerald-900/50 text-emerald-400"
                  : item.highlight
                  ? "bg-emerald-900/50 text-emerald-400"
                  : "bg-gray-600 text-gray-400"
              }`}
            >
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                {item.label}
              </p>
              <p
                className={`text-sm font-semibold truncate ${
                  item.warning
                    ? "text-red-400"
                    : item.special
                    ? "text-emerald-400"
                    : item.highlight
                    ? "text-emerald-400"
                    : "text-white"
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

export default Profile;
