import express from "express";
import {
    getUserProfile,
    updateUserProfile,
    changeUserPassword,
    uploadUserAvatar,
    searchUsers,
    validateUserIdParam,
    authorizeSelfOrAdmin,
} from "@backend/controllers/user/index";

const router = express.Router();

// GET /api/v1/users/:id - Get user profile
router.get("/:id", validateUserIdParam, getUserProfile);

// PUT /api/v1/users/:id - Update user profile
router.put("/:id", validateUserIdParam, authorizeSelfOrAdmin, updateUserProfile);

// PUT /api/v1/users/:id/password - Change password
router.put("/:id/password", validateUserIdParam, authorizeSelfOrAdmin, changeUserPassword);

// POST /api/v1/users/:id/avatar - Upload avatar
router.post("/:id/avatar", validateUserIdParam, authorizeSelfOrAdmin, uploadUserAvatar);

// GET /api/v1/users/search - Search users
router.get("/search", searchUsers);

export default router; 