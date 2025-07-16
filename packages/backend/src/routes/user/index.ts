import express from "express";

import { verifyToken } from "@backend/controllers/auth";
import {
  getUserById,
  getUsers,
  updateUserStatus,
} from "@backend/controllers/user";

const router = express.Router();

// Get all users (public for demo)
router.get("/", getUsers);

// Get user by ID (requires authentication)
router.get("/:id", verifyToken, getUserById);

// Update user status (admin only)
router.patch("/:id/status", verifyToken, updateUserStatus);

export default router;
