import express from "express";
import bodyParser from "body-parser";
import initWebRoutes from "./routes/webRoutes";
import connectDB from "./config/connectDB";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import viewEngine from "./config/viewEngine";
dotenv.config();

const app = express();

// Cấu hình CORS cho phép React Frontend gọi API
app.use(
  cors({
    origin: ["http://localhost:5137"], // Các cổng phát triển React
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
const port = process.env.PORT || 8081;

// Start the server
app.listen(port, () => {
  console.log(`API Server is running on port: ${port}`);
});
