import React, { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import Modal from "react-modal";

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData };

      if (!dataToSubmit.password) {
        delete dataToSubmit.password;
      }

      await updateUser(dataToSubmit);

      alert("Cập nhật thông tin thành công!");
      onClose();
      window.location.reload();
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      const errorMessage =
        error.response?.data?.message || "Cập nhật thông tin thất bại!";
      alert(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Cập nhật thông tin"
      className="bg-gray-900 p-12 rounded-lg w-full max-w-2xl"
      overlayClassName="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      ariaHideApp={false}
    >
      <h2 className="text-lightGreen text-3xl mb-8 text-center">
        Cập nhật thông tin
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-x-8 gap-y-6"
      >
        <div>
          <label
            className="block text-lightGreen text-sm font-bold mb-2"
            htmlFor="username"
          >
            Tên đăng nhập:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder={userData?.username ? "" : "Nhập tên đăng nhập"}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline border-gray-700 focus:ring focus:ring-lightGreen"
          />
        </div>
        <div>
          <label
            className="block text-lightGreen text-sm font-bold mb-2"
            htmlFor="password"
          >
            Mật khẩu mới:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Để trống nếu không đổi"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline border-gray-700 focus:ring focus:ring-lightGreen"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label
            className="block text-lightGreen text-sm font-bold mb-2"
            htmlFor="first_name"
          >
            Họ:
          </label>
          <input
            type="text"
            id="first_name"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder={userData?.first_name ? "" : "Nhập họ"}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline border-gray-700 focus:ring focus:ring-lightGreen"
          />
        </div>
        <div>
          <label
            className="block text-lightGreen text-sm font-bold mb-2"
            htmlFor="last_name"
          >
            Tên:
          </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder={userData?.last_name ? "" : "Nhập tên"}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline border-gray-700 focus:ring focus:ring-lightGreen"
          />
        </div>
        <div>
          <label
            className="block text-lightGreen text-sm font-bold mb-2"
            htmlFor="gender"
          >
            Giới tính:
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline border-gray-700 focus:ring focus:ring-lightGreen"
          >
            <option value="0">Nữ</option>
            <option value="1">Nam</option>
          </select>
        </div>
        <div>
          <label
            className="block text-lightGreen text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={userData?.email ? "" : "Nhập email"}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline border-gray-700 focus:ring focus:ring-lightGreen"
          />
        </div>
        <div className="col-span-2">
          <label
            className="block text-lightGreen text-sm font-bold mb-2"
            htmlFor="phone"
          >
            Số điện thoại:
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder={userData?.phone ? "" : "Nhập số điện thoại"}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline border-gray-700 focus:ring focus:ring-lightGreen"
          />
        </div>
        <div className="col-span-2">
          <label
            className="block text-lightGreen text-sm font-bold mb-2"
            htmlFor="address"
          >
            Địa chỉ:
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={userData?.address ? "" : "Nhập địa chỉ"}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-white bg-gray-800 leading-tight focus:outline-none focus:shadow-outline border-gray-700 focus:ring focus:ring-lightGreen"
          />
        </div>
        <div className="col-span-2 flex justify-center mt-6">
          <button
            type="submit"
            className="bg-lightGreen text-gray-900 font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline text-lg hover:bg-opacity-90 transition duration-200"
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-4 bg-gray-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline text-lg hover:bg-gray-500 transition duration-200"
          >
            Hủy
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
        className="bg-lightGreen text-gray-900 font-bold py-2 px-4 rounded hover:bg-opacity-90 focus:outline-none focus:shadow-outline transition duration-200"
      >
        Cập nhật thông tin thành viên
      </button>

      {modalIsOpen && (
        <UpdateProfileModal isOpen={modalIsOpen} onClose={closeModal} />
      )}
    </>
  );
};

export default UpdateProfileButton;
