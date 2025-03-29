import API from "./api";

// Hàm lấy danh sách các danh mục từ API
const getCategories = async () => {
  try {
    const response = await API.get("/category");

    if (!response.data || !Array.isArray(response.data)) {
      return { categories: [] };
    }

    return { categories: response.data };
  } catch (error) {
    console.error("❌ API Error:", error);
    return { categories: [] };
  }
};

export default { getCategories };
