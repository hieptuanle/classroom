import type { NextFunction, Request, Response } from "express";

import config from "config";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

import {
  sendBadRequest,
  sendInternalServerError,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from "@backend/helpers/response.js";
import logger from "@backend/libs/logger.js";
import User from "@backend/models/user.js";

const privateKey = config.get("key.privateKey") as string;
const tokenExpireInSeconds = config.get("key.tokenExpireInSeconds") as number;

// Register new user
export async function register(req: Request<any, any, { email: string; username: string; password: string; full_name: string; role?: "admin" | "teacher" | "student" }, any>, res: Response) {
  try {
    const { email, username, password, full_name, role = "student" } = req.body;

    // Validate required fields
    if (!email || !username || !password || !full_name) {
      return sendBadRequest(res, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return sendBadRequest(
        res,
        "User with this email or username already exists",
      );
    }

    // Create new user
    const newUser = await User.create({
      email,
      username,
      password,
      full_name,
      role,
    });

    // Generate token
    const token = jwt.sign(
      {
        id: newUser.dataValues.id,
        email: newUser.dataValues.email,
        role: newUser.dataValues.role,
      },
      privateKey,
      { expiresIn: tokenExpireInSeconds },
    );

    return sendSuccess(res, {
      message: "User registered successfully",
      data: {
        user: (newUser as any).getPublicProfile(),
        token,
      },
    });
  }
  catch (error) {
    logger.error("Registration error:", error);
    return sendInternalServerError(res, "Registration failed");
  }
}

// Login user
export async function login(req: Request<any, any, { email: string; password: string }, any>, res: Response) {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return sendBadRequest(res, "Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return sendUnauthorized(res, "Invalid credentials");
    }

    // Check if user is active
    if (!user.dataValues.is_active) {
      return sendUnauthorized(res, "Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await (user as any).comparePassword(password);
    if (!isPasswordValid) {
      return sendUnauthorized(res, "Invalid credentials");
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate token
    const token = jwt.sign(
      {
        id: user.dataValues.id,
        email: user.dataValues.email,
        role: user.dataValues.role,
      },
      privateKey,
      { expiresIn: tokenExpireInSeconds },
    );

    return sendSuccess(res, {
      message: "Login successful",
      data: {
        user: (user as any).getPublicProfile(),
        token,
      },
    });
  }
  catch (error) {
    logger.error("Login error:", error);
    return sendInternalServerError(res, "Login failed");
  }
}

// Logout user (client-side token removal)
export async function logout(_req: Request, res: Response) {
  try {
    return sendSuccess(res, {
      message: "Logout successful",
    });
  }
  catch (error) {
    logger.error("Logout error:", error);
    return sendInternalServerError(res, "Logout failed");
  }
}

// Get current user profile
export async function getProfile(req: Request, res: Response) {
  try {
    const user = await User.findByPk((req as any).currentUser.id);
    if (!user) {
      return sendNotFound(res, "User not found");
    }

    return sendSuccess(res, {
      data: {
        user: (user as any).getPublicProfile(),
      },
    });
  }
  catch (error) {
    logger.error("Get profile error:", error);
    return sendInternalServerError(res, "Failed to get profile");
  }
}

// Update user profile
export async function updateProfile(req: Request<any, any, { full_name?: string; avatar_url?: string; profile?: any }, any>, res: Response) {
  try {
    const { full_name, avatar_url, profile } = req.body;
    const user = await User.findByPk((req as any).currentUser.id);

    if (!user) {
      return sendNotFound(res, "User not found");
    }

    // Update allowed fields
    const updateData: any = {};
    if (full_name)
      updateData.full_name = full_name;
    if (avatar_url)
      updateData.avatar_url = avatar_url;
    if (profile)
      updateData.profile = { ...user.dataValues.profile, ...profile };

    await user.update(updateData);

    return sendSuccess(res, {
      message: "Profile updated successfully",
      data: {
        user: (user as any).getPublicProfile(),
      },
    });
  }
  catch (error) {
    logger.error("Update profile error:", error);
    return sendInternalServerError(res, "Failed to update profile");
  }
}

// Verify JWT token middleware
export async function verifyToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token
      = req.body.token
        || req.query.token
        || req.headers["x-access-token"]
        || (req.headers.authorization as string)?.replace("Bearer ", "");

    if (!token) {
      return sendUnauthorized(res, "No token provided");
    }

    const decoded = jwt.verify(token, privateKey) as any;
    const user = await User.findByPk(decoded.id);

    if (!user || !user.dataValues.is_active) {
      return sendUnauthorized(res, "Invalid token");
    }

    (req as any).currentUser = user;
    next();
  }
  catch (error) {
    logger.error("Token verification error:", error);
    return sendUnauthorized(res, "Invalid token");
  }
}

// Legacy alias for backward compatibility
export const authenticate = login;
