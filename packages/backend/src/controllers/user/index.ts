import type { NextFunction, Request, Response } from "express";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

import db from "@backend/db";
import { users } from "@backend/db/schema";
import {
  comparePassword,
  findUserById,
  searchUsers as searchUsersUtil,
} from "@backend/db/utils";
import { processAndSaveAvatar } from "@backend/middleware/upload";

// --- Middleware stubs ---
export function validateUserIdParam(req: Request, res: Response, next: NextFunction) {
  if (!req.params.id) {
    return res.status(400).json({ error: "User ID is required" });
  }
  next();
}

export function authorizeSelfOrAdmin(req: Request, res: Response, next: NextFunction) {
  const currentUser = (req as any).currentUser;
  if (currentUser.role === "admin" || currentUser.id === req.params.id) {
    return next();
  }
  return res.status(403).json({ error: "Forbidden" });
}

// --- Controller implementations ---
export async function getUserProfile(req: Request, res: Response) {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Only return public fields
    const { id, email, username, fullName, avatarUrl, role, profile, createdAt, updatedAt } = user;
    return res.json({
      user: { id, email, username, fullName, avatarUrl, role, profile, createdAt, updatedAt },
    });
  }
  catch {
    return res.status(500).json({ error: "Failed to get user profile" });
  }
}

export async function updateUserProfile(req: Request, res: Response) {
  try {
    const { fullName, avatarUrl, profile, preferences } = req.body;
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Only allow updating certain fields
    const updateData: any = {};
    if (fullName)
      updateData.fullName = fullName;
    if (avatarUrl)
      updateData.avatarUrl = avatarUrl;
    if (profile)
      updateData.profile = { ...(user.profile || {}), ...profile };
    if (preferences) {
      const currentProfile: any = user.profile || {};
      updateData.profile = {
        ...currentProfile,
        preferences: { ...(currentProfile.preferences || {}), ...preferences },
      };
    }
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }
    const [updatedUser] = await db.update(users)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(users.id, req.params.id))
      .returning();
    const { id, email, username, fullName: name, avatarUrl: avatar, role, profile: prof, createdAt, updatedAt } = updatedUser;
    return res.json({
      user: { id, email, username, fullName: name, avatarUrl: avatar, role, profile: prof, createdAt, updatedAt },
    });
  }
  catch {
    return res.status(500).json({ error: "Failed to update user profile" });
  }
}

export async function changeUserPassword(req: Request, res: Response) {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Current password is incorrect" });
    }
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.update(users)
      .set({ password: hashed, updatedAt: new Date() })
      .where(eq(users.id, req.params.id));
    return res.json({ message: "Password changed successfully" });
  }
  catch {
    return res.status(500).json({ error: "Failed to change password" });
  }
}

export async function uploadUserAvatar(req: Request, res: Response) {
  try {
    const userId = req.params.id;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const user = await findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Process and save avatar using util
    const avatarUrl = await processAndSaveAvatar(userId, req.file);
    await db.update(users)
      .set({ avatarUrl, updatedAt: new Date() })
      .where(eq(users.id, userId));
    return res.json({ message: "Avatar uploaded successfully", avatarUrl });
  }
  catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to upload avatar" });
  }
}

export async function searchUsers(req: Request, res: Response) {
  try {
    const { q } = req.query;
    if (!q || typeof q !== "string") {
      return res.status(400).json({ error: "Search query is required" });
    }
    const results = await searchUsersUtil(q);
    // Only return public fields
    const usersList = results.map((user: any) => {
      const { id, email, username, fullName, avatarUrl, role, profile, createdAt, updatedAt } = user;
      return { id, email, username, fullName, avatarUrl, role, profile, createdAt, updatedAt };
    });
    return res.json({ users: usersList });
  }
  catch {
    return res.status(500).json({ error: "Failed to search users" });
  }
}
