import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// User routes (JSON-only)
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
