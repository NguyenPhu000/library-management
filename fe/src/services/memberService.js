import API from "./api";

// Hàm lấy thông tin thành viên hiện tại theo userId
export const getCurrentMemberInfo = async (userId) => {
  try {
    const response = await API.get(`/members/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Không thể lấy thông tin thành viên"
    );
  }
};

// Hàm lấy member_id theo userId
export const getMemberIdByUserId = async (userId) => {
  try {
    const response = await API.get(`/members/member-id/${userId}`);

    if (!response.data || !response.data.member_id) {
      throw new Error("Không tìm thấy member_id");
    }

    return response.data.member_id;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Không thể lấy member_id");
  }
};
