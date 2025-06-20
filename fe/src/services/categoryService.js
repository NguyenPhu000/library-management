import { API, PublicAPI } from "./api";

// Hàm lấy danh sách các danh mục từ API
const getCategories = async () => {
  try {
    const response = await PublicAPI.get("/category");

    if (!response.data || !response.data.success) {
      console.warn("Phản hồi API không hợp lệ:", response.data);
      return { categories: [] };
    }

    return { categories: response.data.categories || [] };
  } catch (error) {
    console.error("❌ API Error:", error);
    return { categories: [] };
  }
};

export default { getCategories };
