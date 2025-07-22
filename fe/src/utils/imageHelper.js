// Helper function để tạo URL uploads động
const getUploadsUrl = (filename) => {
  // Tự động detect base URL từ environment hoặc window location
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL
  ) {
    return (
      import.meta.env.VITE_API_URL.replace(/\/api$/, "") +
      `/uploads/${filename}`
    );
  }

  if (typeof window !== "undefined") {
    const origin = window.location.origin;

    // DevTunnels
    if (origin.includes("devtunnels.ms")) {
      const backendUrl = origin
        .replace("-5137.", "-8081.")
        .replace(":5137", ":8081");
      return `${backendUrl}/uploads/${filename}`;
    }

    // Ngrok
    if (origin.includes(".ngrok.io") || origin.includes(".ngrok-free.app")) {
      const backendUrl = origin.replace("5137", "8081");
      return `${backendUrl}/uploads/${filename}`;
    }
  }

  // Default localhost
  return `http://localhost:8081/uploads/${filename}`;
};

// Helper tạo URL ảnh bìa - ưu tiên Base64, fallback filename
export const formatCoverImage = (coverImage) => {
  if (!coverImage) {
    return "https://via.placeholder.com/150";
  }

  // Ưu tiên Base64 (ảnh mới)
  if (typeof coverImage === "string" && coverImage.startsWith("data:")) {
    return coverImage;
  }

  // Fallback: filename cũ (để không bị mất ảnh hiện có)
  if (typeof coverImage === "string" && coverImage.trim()) {
    const filename = coverImage.replace(/['"']+/g, "").trim();
    return getUploadsUrl(filename);
  }

  // Không có ảnh hợp lệ
  return "https://via.placeholder.com/150";
};

export default formatCoverImage;
