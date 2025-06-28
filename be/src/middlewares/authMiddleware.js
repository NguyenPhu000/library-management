import jwt from "jsonwebtoken";
import config from "../config/configJWT.js";

// Middleware kiểm tra xác thực thông qua token
const verifyToken = (req, res, next) => {
  // Lấy token từ cookie hoặc header
  const token =
    req.cookies?.auth_token || req.headers?.authorization?.split(" ")[1];

  // Nếu không có token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
  }

  try {
    // Xác thực token
    const decoded = jwt.verify(token, config.secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid token",
    });
  }
};

// Middleware kiểm tra quyền admin
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin privileges required",
      });
    }
  });
};

// Middleware kiểm tra quyền member
const verifyMember = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && (req.user.role === "member" || req.user.role === "admin")) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Member privileges required",
      });
    }
  });
};

// Middleware kiểm tra quyền user
const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden: User privileges required",
      });
    }
  });
};

// Middleware kiểm tra quyền truy cập resource của user
const verifyResourceOwner = (req, res, next) => {
  verifyToken(req, res, () => {
    const resourceId = req.params.id || req.body.id;
    const userId = req.user.id;

    // Admin có thể truy cập tất cả resource
    if (req.user.role === "admin") {
      next();
      return;
    }

    // Kiểm tra nếu người dùng là chủ sở hữu của resource
    if (resourceId && resourceId === userId) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You don't have permission to access this resource",
      });
    }
  });
};

// Aliases for common usage
const requireAuth = verifyToken;
const requireAdmin = verifyAdmin;
const requireMember = verifyMember;

export default {
  verifyToken,
  verifyAdmin,
  verifyMember,
  verifyUser,
  verifyResourceOwner,
  requireAuth,
  requireAdmin,
  requireMember,
};

// Named exports for CommonJS compatibility
export {
  verifyToken,
  verifyAdmin,
  verifyMember,
  verifyUser,
  verifyResourceOwner,
  requireAuth,
  requireAdmin,
  requireMember,
};
