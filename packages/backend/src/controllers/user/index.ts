import type { Request, Response } from "express";

import { eq } from "drizzle-orm";

import db from "@backend/db";
import { users } from "@backend/db/schema";
import { findUserById } from "@backend/db/utils";
import {
  sendInternalServerError,
  sendNotFound,
  sendSuccess,
} from "@backend/helpers/response";
import logger from "@backend/libs/logger";

// Get all users
export async function getUsers(_req: Request, res: Response) {
  try {
    const allUsers = await db.select({
      id: users.id,
      email: users.email,
      username: users.username,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    }).from(users);

    return sendSuccess(res, {
      data: allUsers,
    });
  }
  catch (error) {
    logger.error("Get users error:", error);
    return sendInternalServerError(res, "Failed to get users");
  }
}

// Get user by ID
export async function getUserById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;

    const user = await findUserById(id);
    if (!user) {
      return sendNotFound(res, "User not found");
    }

    return sendSuccess(res, {
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  }
  catch (error) {
    logger.error("Get user by ID error:", error);
    return sendInternalServerError(res, "Failed to get user");
  }
}

// Update user status (admin only)
export async function updateUserStatus(req: Request<{ id: string }, any, { isActive: boolean }>, res: Response) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Check if current user is admin
    const currentUser = (req as any).currentUser;
    if (currentUser.role !== "admin") {
      return sendNotFound(res, "Unauthorized");
    }

    const user = await findUserById(id);
    if (!user) {
      return sendNotFound(res, "User not found");
    }

    const [updatedUser] = await db.update(users)
      .set({ isActive })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        email: users.email,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return sendSuccess(res, {
      message: "User status updated successfully",
      data: {
        user: updatedUser,
      },
    });
  }
  catch (error) {
    logger.error("Update user status error:", error);
    return sendInternalServerError(res, "Failed to update user status");
  }
}
