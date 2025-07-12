import express from "express";

import {
  createAssignmentController,
  getAssignmentById,
  getAssignmentSubmissions,
  getClassAssignments,
  getMySubmissions,
  gradeSubmission,
  submitAssignment,
  updateAssignment,
} from "../../controllers/assignment/index";
import { verifyToken } from "../../controllers/auth/index";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyToken);

// Assignment management routes
router.post("/", createAssignmentController);
router.get("/class/:classId", getClassAssignments);
router.get("/:id", getAssignmentById);
router.put("/:id", updateAssignment);

// Submission routes
router.post("/:id/submit", submitAssignment);
router.get("/:id/submissions", getAssignmentSubmissions);
router.post("/submissions/:submissionId/grade", gradeSubmission);
router.get("/submissions/my", getMySubmissions);

export default router;
