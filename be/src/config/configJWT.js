// Cấu hình JWT
export default {
  secret: process.env.JWT_SECRET || "sern-library-secret-key",
  expiresIn: "7d", // Token hết hạn sau 7 ngày
};
