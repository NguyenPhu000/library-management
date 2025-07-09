export const getUploadsBase = () => {
  const api =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL
      : "http://localhost:8081/api";

  return api.replace(/\/api$/, "") + "/uploads/";
};

export default getUploadsBase;
