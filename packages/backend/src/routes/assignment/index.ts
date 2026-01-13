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
} from "@backend/controllers/assignment/index";
import { verifyToken } from "@backend/controllers/auth/index";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Assignments
 *   description: Assignment management endpoints
 */

/**
 * @swagger
 * /api/v1/assignments:
 *   post:
 *     summary: Create a new assignment
 *     tags: [Assignments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               classId:
 *                 type: string
 *               points:
 *                 type: number
 *     responses:
 *       201:
 *         description: Assignment created
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/assignments/class/{classId}:
 *   get:
 *     summary: Get assignments for a class
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: classId
 *         schema:
 *           type: string
 *         required: true
 *         description: Class ID
 *     responses:
 *       200:
 *         description: List of assignments
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/v1/assignments/{id}:
 *   get:
 *     summary: Get an assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: Assignment details
 *       404:
 *         description: Assignment not found
 *   put:
 *     summary: Update an assignment by ID
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               points:
 *                 type: number
 *     responses:
 *       200:
 *         description: Assignment updated
 *       404:
 *         description: Assignment not found
 */

/**
 * @swagger
 * /api/v1/assignments/{id}/submit:
 *   post:
 *     summary: Submit an assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Assignment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     url:
 *                       type: string
 *     responses:
 *       201:
 *         description: Assignment submitted
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Assignment not found
 */

/**
 * @swagger
 * /api/v1/assignments/{id}/submissions:
 *   get:
 *     summary: Get all submissions for an assignment
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Assignment ID
 *     responses:
 *       200:
 *         description: List of submissions
 *       404:
 *         description: Assignment not found
 */

/**
 * @swagger
 * /api/v1/assignments/submissions/{submissionId}/grade:
 *   post:
 *     summary: Grade a submission
 *     tags: [Assignments]
 *     parameters:
 *       - in: path
 *         name: submissionId
 *         schema:
 *           type: string
 *         required: true
 *         description: Submission ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               grade:
 *                 type: number
 *               feedback:
 *                 type: string
 *     responses:
 *       200:
 *         description: Submission graded
 *       404:
 *         description: Submission not found
 */

/**
 * @swagger
 * /api/v1/assignments/submissions/my:
 *   get:
 *     summary: Get current user's submissions
 *     tags: [Assignments]
 *     responses:
 *       200:
 *         description: List of submissions
 */

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
