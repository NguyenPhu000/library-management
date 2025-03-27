import API from "./api";

export const fetchUserById = async (userId) => {
  try {
    const { data } = await API.get(`/users/${userId}`);
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy thông tin người dùng:", error);
    throw error;
  }
};

export const updateMemberProfile = async (userId, data) => {
  try {
    const response = await API.post(`/users/update-profile/${userId}`, {
      ...data,
    });

    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin thành viên:", error);
    throw error;
  }
};
