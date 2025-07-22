import API from "./api";

// Hàm lấy thông tin người dùng theo ID
export const fetchUserById = async (userId) => {
  try {
    const { data } = await API.get(`/users/${userId}`);
    // Backend trả về { success: true, user: {...} }
    return data.user;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw error;
  }
};

// Hàm cập nhật thông tin hồ sơ thành viên
export const updateMemberProfile = async (userId, data) => {
  try {
    const response = await API.post(`/users/update-profile/${userId}`, {
      ...data,
    });

    // Backend trả về { success: true, message: "...", user: {...} }
    return response.data.user;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin thành viên:", error);
    throw error;
  }
};
