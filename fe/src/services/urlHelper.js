export const getUploadsBase = () => {
  // 1. Ưu tiên biến môi trường
  if (
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL
  ) {
    return import.meta.env.VITE_API_URL.replace(/\/api$/, "") + "/uploads/";
  }

  // 2. Tự động phát hiện tunnel
  if (typeof window !== "undefined") {
    const origin = window.location.origin;

    // DevTunnels
    if (origin.includes("devtunnels.ms")) {
      const backendUrl = origin
        .replace("-5137.", "-8081.")
        .replace(":5137", ":8081");
      return backendUrl + "/uploads/";
    }

    // Ngrok
    if (origin.includes(".ngrok.io") || origin.includes(".ngrok-free.app")) {
      const backendUrl = origin.replace("5137", "8081");
      return backendUrl + "/uploads/";
    }
  }

  // 3. Default localhost
  return "http://localhost:8081/uploads/";
};

export default getUploadsBase;
