import multer from "multer";

// Chuyển sang memoryStorage để lưu file vào RAM thay vì disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
    fieldSize: 10 * 1024 * 1024, // Cho phép text field (current_cover) đến 10MB
  },
  fileFilter: (req, file, cb) => {
    // Chỉ chấp nhận file ảnh
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Chỉ chấp nhận file ảnh!"), false);
    }
  },
});
export default upload;
