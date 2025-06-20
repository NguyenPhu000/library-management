import express from "express";
import memberController from "../controllers/memberController.js";

const router = express.Router();

// Member routes
router.get("/members", memberController.listMembers);
router.post("/members/update", memberController.updateMember);
router.post("/members/delete", memberController.deleteMember);
router.post("/members/sync", memberController.syncMember);

router.get("/members/:userId", memberController.getMemberByUserId);
router.get("/members/member-id/:userId", memberController.getMemberIdByUserId);

export default router;
