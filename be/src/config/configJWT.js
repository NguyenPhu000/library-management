// Cấu hình JWT
export default {
  secret: process.env.JWT_SECRET,
  expiresIn: "7d", // Token hết hạn sau 7 ngày
};
