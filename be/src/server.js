import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./routes/webRoutes";
import connectDB from "./config/connectDB";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine";
import loanService from "./services/loanService.js";
dotenv.config();

const app = express();

// Cấu hình CORS cho phép React Frontend gọi API
app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép request không có origin (mobile apps, Postman)
      if (!origin) return callback(null, true);

      // Cho phép localhost và các domain trong env
      const allowedOrigins = [
        "http://localhost:5137",
        "http://localhost:3000",
        process.env.FRONTEND_URL,
        process.env.ALLOWED_ORIGIN,
      ].filter(Boolean);

      if (allowedOrigins.includes(origin) || origin.includes("localhost")) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Connect to the database
connectDB();

// Sử dụng cookie-parser để xử lý JWT trong cookies
app.use(cookieParser());

// Serve static files (uploads, assets)
import path from "path";
const publicPath = path.join(process.cwd(), "src", "public");
app.use(express.static(publicPath));
app.use("/uploads", express.static(path.join(publicPath, "uploads")));

// Configure app middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

// Initialize routes (chỉ API routes)
initWebRoutes(app);
// Cấu hình view engine
viewEngine(app);
// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Đã xảy ra lỗi máy chủ",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// API not found handler
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found" });
});

// Set the port
const port = process.env.PORT || 8080;

// Auto cleanup expired loan requests - chạy mỗi giờ
const startAutoCleanup = () => {
  const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 giờ

  // Chạy lần đầu sau 5 phút
  setTimeout(() => {
    loanService.autoCleanupExpiredRequests();
  }, 5 * 60 * 1000);

  // Sau đó chạy mỗi giờ
  setInterval(() => {
    loanService.autoCleanupExpiredRequests();
  }, CLEANUP_INTERVAL);

  console.log("🧹 Auto cleanup scheduler started");
};

// Start the server
app.listen(port, () => {
  console.log(`API Server is running on port: ${port}`);
  startAutoCleanup();
});
