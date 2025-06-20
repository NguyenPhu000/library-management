import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/webRoutes";
import connectDB from "./config/connectDB";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// Cấu hình CORS cho phép React Frontend gọi API
app.use(
  cors({
    origin: ["http://localhost:5137", "http://localhost:3000"], // Các cổng phát triển React
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Connect to the database
connectDB();

// Sử dụng cookie-parser để xử lý JWT trong cookies
app.use(cookieParser());

// Configure view engine
viewEngine(app);

// Configure app middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Initialize routes
initWebRoutes(app);

// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Đã xảy ra lỗi máy chủ",
    error: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// Fallback route to index.html for React Router (SPA)
app.get("*", (req, res) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ success: false, message: "API not found" });
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Set the port (thay đổi cổng để tránh xung đột)
const port = process.env.PORT || 8081;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
