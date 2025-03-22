import { useMember } from "../../contexts/MemberContext";
import { FaUserCircle, FaIdCard, FaBookOpen } from "react-icons/fa";
import { motion } from "framer-motion";

const Profile = () => {
  const { memberData, loading, error } = useMember();

  if (loading) {
    return <div className="text-lg">Đang tải thông tin...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-lg">{error}</div>;
  }

  if (!memberData || !memberData.member) {
    return (
      <div className="text-red-500 text-lg">
        Không tìm thấy thông tin thành viên!
      </div>
    );
  }

  const member = memberData.member;

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gray-900 shadow-lg rounded-2xl overflow-hidden mb-4">
        <div className="flex">
          <motion.div
            className="bg-lightGreen p-4 hover:bg-lightGreen-dark transition-colors duration-300 cursor-pointer flex flex-col items-center justify-center border-r border-gray-700"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              className="mb-2"
              whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
            >
              <FaUserCircle size={80} className="text-gray-900" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-center text-gray-900 uppercase tracking-tight">
              {member.User.first_name} {member.User.last_name}
            </h2>
          </motion.div>
          <div className="p-4 space-y-6 text-white flex-1">
            <div>
              <SectionTitle icon={<FaIdCard />} title="Thông tin Tài khoản" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <InfoItem
                  label="Họ và Tên"
                  value={`${member.User.first_name} ${member.User.last_name}`}
                />
                <InfoItem label="Email" value={member.User.email} />
                <InfoItem label="Tên đăng nhập" value={member.User.username} />
                <InfoItem label="Vai trò" value={member.User.role} />
                <InfoItem
                  label="Giới tính"
                  value={member.User.gender ? "Nam" : "Nữ"}
                />
                <InfoItem label="Số điện thoại" value={member.User.phone} />
                <InfoItem label="Địa chỉ" value={member.User.address} />
              </div>
            </div>

            <div>
              <SectionTitle
                icon={<FaIdCard />}
                title="Thông tin Thẻ Thành Viên"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <InfoItem label="Mã thành viên" value={member.member_code} />
                <InfoItem
                  label="Ngày tham gia"
                  value={new Date(member.join_date).toLocaleDateString("vi-VN")}
                />
                <InfoItem
                  label="Ngày hết hạn"
                  value={new Date(member.expiry_date).toLocaleDateString(
                    "vi-VN"
                  )}
                />
                <InfoItem
                  label="Số sách được mượn tối đa"
                  value={member.max_loans}
                />
                <InfoItem
                  label="Số sách đang mượn"
                  value={member.current_loans}
                />
              </div>
            </div>

            {member.current_loans > 0 && (
              <div>
                <SectionTitle icon={<FaBookOpen />} title="Sách Đang Mượn" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SectionTitle = ({ icon, title }) => (
  <motion.div
    className="flex items-center mb-2"
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    {icon && <span className="mr-2 text-lightGreen">{icon}</span>}
    <h3 className="text-xl font-semibold text-lightGreen border-b border-lightGreen pb-2">
      {title}
    </h3>
  </motion.div>
);

const InfoItem = ({ label, value, className = "" }) => (
  <motion.div
    className="bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition duration-300 p-2"
    whileHover={{ scale: 1.05, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)" }}
  >
    <span className="block text-sm font-medium text-lightGreen mb-1">
      {label}
    </span>
    <span className={`block text-lg text-white ${className}`}>{value}</span>
  </motion.div>
);

export default Profile;
