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

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management endpoints
 */

/**
 * @swagger
 * /api/v1/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Class created successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /api/v1/classes/my:
 *   get:
 *     summary: Get all classes for the current user
 *     tags: [Classes]
 *     responses:
 *       200:
 *         description: List of classes
 */

/**
 * @swagger
 * /api/v1/classes/{id}:
 *   get:
 *     summary: Get a class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class details
 *       404:
 *         description: Class not found
 *   put:
 *     summary: Update a class by ID
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Class ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class updated
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/v1/classes/join:
 *   post:
 *     summary: Join a class
 *     tags: [Classes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               classCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Joined class
 *       400:
 *         description: Invalid class code
 */

/**
 * @swagger
 * /api/v1/classes/{id}/invite-code:
 *   post:
 *     summary: Generate invite code for a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Invite code generated
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/v1/classes/{id}/enrollments:
 *   get:
 *     summary: Get enrollments for a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Class ID
 *     responses:
 *       200:
 *         description: List of enrollments
 *       404:
 *         description: Class not found
 */

/**
 * @swagger
 * /api/v1/classes/{id}/users/{userId}:
 *   delete:
 *     summary: Remove a user from a class
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Class ID
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User removed from class
 *       404:
 *         description: Class or user not found
 */

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
