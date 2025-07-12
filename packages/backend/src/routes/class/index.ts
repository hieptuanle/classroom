import express from "express";

import { verifyToken } from "../../controllers/auth/index";
import {
  createClassController,
  generateInviteCode,
  getClassById,
  getClassEnrollments,
  getMyClasses,
  joinClass,
  removeUserFromClass,
  updateClass,
} from "../../controllers/class/index";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Class management routes
router.post("/", createClassController);
router.get("/my", getMyClasses);
router.get("/:id", getClassById);
router.put("/:id", updateClass);
router.post("/join", joinClass);
router.post("/:id/invite-code", generateInviteCode);
router.get("/:id/enrollments", getClassEnrollments);
router.delete("/:id/users/:userId", removeUserFromClass);

export default router;
