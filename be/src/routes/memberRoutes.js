import express from "express";
import memberController from "../controllers/memberController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Member routes (cần xác thực admin)
router.get(
  "/admin/members",
  authMiddleware.verifyAdmin,
  memberController.listMembers
);
router.post(
  "/admin/members/update",
  authMiddleware.verifyAdmin,
  memberController.updateMember
);
router.post(
  "/admin/members/sync",
  authMiddleware.verifyAdmin,
  memberController.syncMember
);
router.get(
  "/admin/members/:userId",
  authMiddleware.verifyAdmin,
  memberController.getMemberByUserId
);

// Member routes công khai (không cần admin)
router.get("/members/:userId", memberController.getMemberByUserId);
router.get("/members/member-id/:userId", memberController.getMemberIdByUserId);

export default router;
