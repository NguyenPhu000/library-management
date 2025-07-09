import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import Modal from "react-modal";
import {
  FaEdit,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLock,
  FaVenusMars,
} from "react-icons/fa";

const UpdateProfileModal = ({ isOpen, onClose }) => {
  const { userData, updateUser } = useUser();
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    gender: "0",
    email: "",
    phone: "",
    address: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      setFormData({
        username: userData.username || "",
        first_name: userData.first_name || "",
        last_name: userData.last_name || "",
        gender: userData.gender ? "1" : "0",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        password: "",
      });
    }
  }, [userData]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const dataToSubmit = { ...formData };

      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }

      await updateUser(dataToSubmit);

      // Success notification
      const successAlert = document.createElement("div");
      successAlert.className =
        "fixed top-4 right-4 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 border border-emerald-500";
      successAlert.textContent = "Cập nhật thông tin thành công!";
      document.body.appendChild(successAlert);

      setTimeout(() => {
        document.body.removeChild(successAlert);
      }, 3000);

      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      const errorMessage =
        error.response?.data?.message || "Cập nhật thông tin thất bại!";

      // Error notification
      const errorAlert = document.createElement("div");
      errorAlert.className =
        "fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-xl shadow-2xl z-50 border border-red-500";
      errorAlert.textContent = errorMessage;
      document.body.appendChild(errorAlert);

      setTimeout(() => {
        document.body.removeChild(errorAlert);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Cập nhật thông tin"
      className="bg-gray-800 rounded-2xl w-full max-w-2xl mx-auto my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 z-50"
      ariaHideApp={false}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 px-8 py-6 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <FaEdit className="w-5 h-5 text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold">Cập nhật thông tin</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-600/50 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors duration-200"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              <FaUser className="inline w-4 h-4 mr-2 text-emerald-400" />
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={(e) => handleInputChange("username", e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Họ
            </label>
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={(e) => handleInputChange("first_name", e.target.value)}
              placeholder="Nhập họ"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              Tên
            </label>
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={(e) => handleInputChange("last_name", e.target.value)}
              placeholder="Nhập tên"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              <FaEnvelope className="inline w-4 h-4 mr-2 text-emerald-400" />
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Nhập email"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              <FaVenusMars className="inline w-4 h-4 mr-2 text-emerald-400" />
              Giới tính
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={(e) => handleInputChange("gender", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            >
              <option value="0">Nữ</option>
              <option value="1">Nam</option>
            </select>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              <FaPhone className="inline w-4 h-4 mr-2 text-emerald-400" />
              Số điện thoại
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="Nhập số điện thoại"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              <FaLock className="inline w-4 h-4 mr-2 text-emerald-400" />
              Mật khẩu mới
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder="Để trống nếu không đổi"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
              autoComplete="new-password"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-gray-300 text-sm font-semibold mb-2">
              <FaMapMarkerAlt className="inline w-4 h-4 mr-2 text-emerald-400" />
              Địa chỉ
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              placeholder="Nhập địa chỉ"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-600">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Đang cập nhật...</span>
              </div>
            ) : (
              "Cập nhật thông tin"
            )}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold py-3 px-6 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200"
          >
            Hủy bỏ
          </button>
        </div>
      </form>
    </Modal>
  );
};

const UpdateProfileButton = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <button
        onClick={openModal}
        className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-100 font-semibold py-3 px-6 rounded-xl backdrop-blur-sm border border-emerald-500/30 hover:border-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-200 flex items-center gap-2"
      >
        <FaEdit className="w-4 h-4" />
        <span className="hidden sm:inline">Cập nhật thông tin</span>
        <span className="sm:hidden">Cập nhật</span>
      </button>
      <UpdateProfileModal isOpen={modalIsOpen} onClose={closeModal} />
    </>
  );
};

export default UpdateProfileButton;
