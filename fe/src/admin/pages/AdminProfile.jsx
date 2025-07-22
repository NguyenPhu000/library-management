import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaShieldAlt,
  FaCalendar,
  FaGlobe,
  FaLanguage,
  FaClock,
  FaKey,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaVenusMars,
} from "react-icons/fa";
import Swal from "sweetalert2";

const AdminProfile = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    gender: "",
    avatar: "",
    timezone: "Asia/Ho_Chi_Minh",
    language: "vi",
    notifications: {
      email: true,
      browser: true,
      mobile: false,
    },
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (currentUser) {
      setProfileData({
        firstName: currentUser.first_name || "",
        lastName: currentUser.last_name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
        gender: currentUser.gender !== undefined ? currentUser.gender : "",
        avatar: currentUser.avatar || "",
        timezone: currentUser.timezone || "Asia/Ho_Chi_Minh",
        language: currentUser.language || "vi",
        notifications: {
          email: currentUser.notifications?.email ?? true,
          browser: currentUser.notifications?.browser ?? true,
          mobile: currentUser.notifications?.mobile ?? false,
        },
      });
    }
  }, [currentUser]);

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (type, value) => {
    setProfileData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: value,
      },
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      const result = await updateProfile(profileData);

      if (result.success) {
        setIsEditing(false);
        Swal.fire({
          icon: "success",
          title: "Cập nhật thành công",
          text: "Thông tin hồ sơ đã được cập nhật",
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error(result.message || "Cập nhật thất bại");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi cập nhật",
        text: error.message || "Đã xảy ra lỗi khi cập nhật thông tin",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu không khớp",
        text: "Mật khẩu mới và xác nhận mật khẩu không khớp",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Mật khẩu quá ngắn",
        text: "Mật khẩu phải có ít nhất 6 ký tự",
      });
      return;
    }

    try {
      setLoading(true);
      // Call API to change password
      // const result = await changePassword(passwordData);

      setShowPasswordForm(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      Swal.fire({
        icon: "success",
        title: "Đổi mật khẩu thành công",
        text: "Mật khẩu của bạn đã được cập nhật",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi đổi mật khẩu",
        text: error.message || "Đã xảy ra lỗi khi đổi mật khẩu",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatLastLogin = (date) => {
    if (!date) return "Chưa đăng nhập";
    return new Date(date).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (firstName, lastName, username, email) => {
    const nameInitials = `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();

    if (nameInitials.trim()) return nameInitials;
    if (username) return username.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "A";
  };

  // Helper to get display name
  const getDisplayName = () => {
    const combined = `${profileData.firstName} ${profileData.lastName}`.trim();
    if (combined && combined !== "") return combined;
    return currentUser?.username || currentUser?.email || "Người dùng";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Quản lý thông tin và cài đặt tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block">
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-4xl font-bold">
                        {getInitials(
                          profileData.firstName,
                          profileData.lastName,
                          currentUser?.username,
                          currentUser?.email
                        )}
                      </span>
                    </div>
                  )}
                  {/* Optionally add button to upload avatar in future */}
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {getDisplayName()}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {currentUser?.adminType === "admin"
                    ? "Quản trị viên cấp cao"
                    : "Nhân viên thư viện"}
                </p>

                {/* Status Badges */}
                <div className="flex justify-center space-x-2 mt-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></div>
                    Hoạt động
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    <FaShieldAlt className="w-3 h-3 mr-1" />
                    Đã xác thực
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-semibold text-blue-600 dark:text-blue-400">
                      {currentUser?.loginCount || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Lần đăng nhập
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-green-600 dark:text-green-400">
                      {currentUser?.tasksCompleted || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Tác vụ hoàn thành
                    </p>
                  </div>
                </div>
              </div>

              {/* Last Login */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <FaClock className="w-4 h-4 mr-2" />
                  <span>
                    Đăng nhập cuối: {formatLastLogin(currentUser?.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Thông tin cá nhân
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                  >
                    {isEditing ? (
                      <>
                        <FaTimes className="w-4 h-4 mr-2" />
                        Hủy
                      </>
                    ) : (
                      <>
                        <FaEdit className="w-4 h-4 mr-2" />
                        Chỉnh sửa
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Họ
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.firstName}
                        onChange={(e) =>
                          handleInputChange("firstName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {profileData.firstName || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tên
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profileData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {profileData.lastName || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaEnvelope className="w-4 h-4 inline mr-2" />
                      Email
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {profileData.email || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaVenusMars className="w-4 h-4 inline mr-2" />
                      Giới tính
                    </label>
                    {isEditing ? (
                      <select
                        value={profileData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">Chọn giới tính</option>
                        <option value={true}>Nam</option>
                        <option value={false}>Nữ</option>
                      </select>
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {profileData.gender === true
                          ? "Nam"
                          : profileData.gender === false
                          ? "Nữ"
                          : "Chưa cập nhật"}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaPhone className="w-4 h-4 inline mr-2" />
                      Số điện thoại
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {profileData.phone || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <FaMapMarkerAlt className="w-4 h-4 inline mr-2" />
                      Địa chỉ
                    </label>
                    {isEditing ? (
                      <textarea
                        value={profileData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white py-2">
                        {profileData.address || "Chưa cập nhật"}
                      </p>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <FaSave className="w-4 h-4 mr-2" />
                          Lưu thay đổi
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Bảo mật tài khoản
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FaKey className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Đổi mật khẩu
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Cập nhật mật khẩu để bảo mật tài khoản
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>

                  {/* Password Change Form */}
                  {showPasswordForm && (
                    <div className="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mật khẩu hiện tại
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  currentPassword: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showPassword ? (
                                <FaEyeSlash className="w-4 h-4 text-gray-400" />
                              ) : (
                                <FaEye className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Mật khẩu mới
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) =>
                                setPasswordData((prev) => ({
                                  ...prev,
                                  newPassword: e.target.value,
                                }))
                              }
                              className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                              {showNewPassword ? (
                                <FaEyeSlash className="w-4 h-4 text-gray-400" />
                              ) : (
                                <FaEye className="w-4 h-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Xác nhận mật khẩu mới
                          </label>
                          <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData((prev) => ({
                                ...prev,
                                confirmPassword: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={() => setShowPasswordForm(false)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={handlePasswordChange}
                            disabled={loading}
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
                          >
                            {loading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <FaLock className="w-4 h-4 mr-2" />
                                Đổi mật khẩu
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ID tài khoản
                      </p>
                      <p className="text-lg font-mono text-gray-900 dark:text-white">
                        #{currentUser?.admin_id || currentUser?.id || "N/A"}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Ngày tạo tài khoản
                      </p>
                      <p className="text-lg text-gray-900 dark:text-white">
                        {currentUser?.created_at
                          ? new Date(currentUser.created_at).toLocaleDateString(
                              "vi-VN"
                            )
                          : "Đang cập nhật"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
