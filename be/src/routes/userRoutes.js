import express from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Admin User routes (cần xác thực admin)
router.get(
  "/admin/users",
  authMiddleware.verifySuperAdmin,
  userController.listUsers
);
router.get(
  "/admin/users/stats",
  authMiddleware.verifyAdmin,
  userController.getUserStats
);
router.get(
  "/admin/users/:id",
  authMiddleware.verifySuperAdmin,
  userController.getUserById
);
router.post(
  "/admin/users/create",
  authMiddleware.verifySuperAdmin,
  userController.createUser
);
router.post(
  "/admin/users/update",
  authMiddleware.verifySuperAdmin,
  userController.updateUser
);
router.post(
  "/admin/users/delete",
  authMiddleware.verifySuperAdmin,
  userController.deleteUser
);
router.post(
  "/admin/users/toggle-active",
  authMiddleware.verifySuperAdmin,
  userController.toggleActive
);
router.post(
  "/admin/users/sync",
  authMiddleware.verifySuperAdmin,
  userController.syncUsers
);

// User routes công khai
router.get("/users", userController.listUsers);
router.post("/users", userController.createUser);
router.post("/users/update", userController.updateUser);
router.post("/users/delete", userController.deleteUser);
router.post("/users/toggle-active", userController.toggleActive);
router.get("/users/stats", userController.getUserStats);
router.post("/users/sync", userController.syncUsers);

router.get("/users/:userId", userController.getUserById);
router.post("/users/update-profile/:userId", userController.updateUserProfile);

export default router;
