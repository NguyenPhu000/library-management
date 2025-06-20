import { useMember } from "../../contexts/MemberContext";
import { FaUserCircle, FaIdCard } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContext";

const Profile = () => {
  const { memberData, loading, error } = useMember();
  const { currentUser } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-base bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="animate-spin inline-block w-6 h-6 border-2 border-lightGreen border-t-transparent rounded-full mr-2"></div>
          Đang tải thông tin...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="text-red-500 text-base bg-gray-800 p-4 rounded-lg shadow-md">
          Lỗi: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-gray-900 shadow-md rounded-lg overflow-hidden mb-4">
        <div className="flex flex-col md:flex-row">
          <div className="bg-lightGreen p-3 md:p-4 hover:bg-green-600 transition-colors duration-300 flex flex-col items-center justify-center md:border-r border-gray-700">
            <div className="mb-2">
              <FaUserCircle size={60} className="text-gray-900" />
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-900 uppercase tracking-tight">
              {currentUser?.fullName || currentUser?.username || "Thành viên"}
            </h2>
          </div>
          <div className="p-3 md:p-4 space-y-4 text-white flex-1">
            <div>
              <SectionTitle icon={<FaIdCard />} title="Thông tin Tài khoản" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <InfoItem
                  label="Họ và Tên"
                  value={currentUser?.fullName || "Chưa cập nhật"}
                />
                <InfoItem
                  label="Email"
                  value={currentUser?.email || "Chưa cập nhật"}
                />
                <InfoItem
                  label="Tên đăng nhập"
                  value={currentUser?.username || ""}
                />
                <InfoItem
                  label="Vai trò"
                  value={
                    currentUser?.role === "member"
                      ? "Thành viên"
                      : currentUser?.role || "Thành viên"
                  }
                />
              </div>
            </div>

            <div>
              <SectionTitle
                icon={<FaIdCard />}
                title="Thông tin Thẻ Thành Viên"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <InfoItem
                  label="Mã thành viên"
                  value={
                    memberData?.member_code || `MEM-${currentUser?.id || ""}`
                  }
                />
                <InfoItem
                  label="Ngày tham gia"
                  value={
                    memberData?.join_date
                      ? new Date(memberData.join_date).toLocaleDateString(
                          "vi-VN"
                        )
                      : "Chưa ghi nhận"
                  }
                />
                <InfoItem
                  label="Ngày hết hạn"
                  value={
                    memberData?.expiry_date
                      ? new Date(memberData.expiry_date).toLocaleDateString(
                          "vi-VN"
                        )
                      : "Chưa ghi nhận"
                  }
                />
                <InfoItem
                  label="Số sách tối đa"
                  value={memberData?.max_loans || "5"}
                />
                <InfoItem
                  label="Đang mượn"
                  value={memberData?.current_loans || "0"}
                />
                <InfoItem
                  label="Trạng thái"
                  value={memberData?.status || "Đang hoạt động"}
                  className={
                    memberData?.status === "Active" ? "text-green-400" : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center mb-2">
    {icon && <span className="mr-2 text-lightGreen">{icon}</span>}
    <h3 className="text-lg font-semibold text-lightGreen border-b border-lightGreen pb-1">
      {title}
    </h3>
  </div>
);

const InfoItem = ({ label, value, className = "" }) => (
  <div className="bg-gray-800 rounded-md shadow-sm p-2 hover:bg-gray-700 transition duration-300">
    <span className="block text-xs font-medium text-lightGreen mb-1">
      {label}
    </span>
    <span className={`block text-sm text-white ${className}`}>{value}</span>
  </div>
);

export default Profile;
