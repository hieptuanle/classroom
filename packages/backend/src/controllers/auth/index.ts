import type { NextFunction, Request, Response } from "express";

import config from "config";
import "dotenv/config";
import { eq, or } from "drizzle-orm";
import jwt from "jsonwebtoken";

import db from "@backend/db";
import { users } from "@backend/db/schema";
import {
  comparePassword,
  createUser,
  findUserByEmail,
  findUserById,
  updateUserLastLogin,
} from "@backend/db/utils";
import {
  sendBadRequest,
  sendInternalServerError,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from "@backend/helpers/response";
import logger from "@backend/libs/logger";

const NODE_ENV = process.env.NODE_ENV as string || "development";

const privateKey = config.get("key.privateKey") as string || "secret";
const tokenExpireInSeconds = config.get("key.tokenExpireInSeconds") as number || 60 * 60 * 24 * 7; // 7 days default
const refreshTokenSecret = config.get("key.refreshTokenSecret") as string || privateKey;
const refreshTokenExpireInSeconds = config.get("key.refreshTokenExpireInSeconds") as number || 60 * 60 * 24 * 7; // 7 days default

// Register new user
export async function register(req: Request<any, any, { email: string; username: string; password: string; fullName: string; role?: "admin" | "teacher" | "student" }, any>, res: Response) {
  try {
    const { email, username, password, fullName, role = "student" } = req.body;

    // Validate required fields
    if (!email || !username || !password || !fullName) {
      return sendBadRequest(res, "All fields are required");
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(or(eq(users.email, email), eq(users.username, username)));
    if (existingUser.length > 0) {
      return sendBadRequest(
        res,
        "User with this email or username already exists",
      );
    }

    // Create new user
    const newUser = await createUser({
      email,
      username,
      password,
      fullName,
      role,
    });

    // Generate tokens
    const token = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, privateKey, { expiresIn: tokenExpireInSeconds });
    const refreshToken = jwt.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, refreshTokenSecret, { expiresIn: refreshTokenExpireInSeconds });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokenExpireInSeconds * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: refreshTokenExpireInSeconds * 1000,
    });

    return sendSuccess(res, {
      message: "User registered successfully",
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          fullName: newUser.fullName,
          avatarUrl: newUser.avatarUrl,
          role: newUser.role,
          profile: newUser.profile,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        },
        token,
        refreshToken,
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
    const user = await findUserByEmail(email);

    if (!user) {
      return sendUnauthorized(res, "Invalid credentials");
    }

    // Check if user is active
    if (!user.isActive) {
      return sendUnauthorized(res, "Account is deactivated");
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return sendUnauthorized(res, "Invalid credentials");
    }

    // Update last login
    await updateUserLastLogin(user.id);

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, privateKey, { expiresIn: tokenExpireInSeconds });
    const refreshToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, refreshTokenSecret, { expiresIn: refreshTokenExpireInSeconds });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokenExpireInSeconds * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: refreshTokenExpireInSeconds * 1000,
    });

    return sendSuccess(res, {
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
        refreshToken,
      },
    });
  }
  catch (error) {
    logger.error("Login error:", error);
    return sendInternalServerError(res, "Login failed");
  }
}

// Logout user (clear cookies)
export async function logout(req: Request, res: Response) {
  try {
    res.clearCookie("token");
    res.clearCookie("refreshToken");
    return sendSuccess(res, { message: "Logout successful" });
  }
  catch (error) {
    logger.error("Logout error:", error);
    return sendInternalServerError(res, "Logout failed");
  }
}

// Get current user profile
export async function getProfile(req: Request, res: Response) {
  try {
    const user = await findUserById((req as any).currentUser.id);
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
          profile: user.profile,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      },
    });
  }
  catch (error) {
    logger.error("Get profile error:", error);
    return sendInternalServerError(res, "Failed to get profile");
  }
}

// Update user profile
export async function updateProfile(req: Request<any, any, { fullName?: string; role?: "admin" | "teacher" | "student" }, any>, res: Response) {
  try {
    const { fullName, role } = req.body;
    const user = await findUserById((req as any).currentUser.id);

    if (!user) {
      return sendNotFound(res, "User not found");
    }

    // Update allowed fields
    const updateData: any = {};
    if (fullName)
      updateData.fullName = fullName;
    if (role)
      updateData.role = role;

    const [updatedUser] = await db.update(users)
      .set(updateData)
      .where(eq(users.id, user.id))
      .returning();

    return sendSuccess(res, {
      message: "Profile updated successfully",
      data: {
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
          fullName: updatedUser.fullName,
          avatarUrl: updatedUser.avatarUrl,
          role: updatedUser.role,
          profile: updatedUser.profile,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
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
    let token = req.body.token || req.query.token || req.headers["x-access-token"] || (req.headers.authorization && (req.headers.authorization as string).replace("Bearer ", ""));
    if (!token && req.cookies) {
      token = req.cookies.token;
    }
    if (!token) {
      return sendUnauthorized(res, "No token provided");
    }

    const decoded = jwt.verify(token, privateKey) as any;
    const user = await findUserById(decoded.id);

    if (!user || !user.isActive) {
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

// Refresh token endpoint
export async function refreshToken(req: Request<any, any, { refreshToken: string }, any>, res: Response) {
  try {
    let refreshToken = req.body.refreshToken;
    if (!refreshToken && req.cookies) {
      refreshToken = req.cookies.refreshToken;
    }
    if (!refreshToken) {
      return sendBadRequest(res, "Refresh token is required");
    }
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, refreshTokenSecret);
    }
    catch {
      return sendUnauthorized(res, "Invalid or expired refresh token");
    }
    const user = await findUserById(decoded.id);
    if (!user || !user.isActive) {
      return sendUnauthorized(res, "Invalid user");
    }
    // Issue new access token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      privateKey,
      { expiresIn: tokenExpireInSeconds },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokenExpireInSeconds * 1000,
    });
    return sendSuccess(res, {
      message: "Token refreshed successfully",
      data: {
        token,
        refreshToken,
      },
    });
  }
  catch (error) {
    logger.error("Refresh token error:", error);
    return sendInternalServerError(res, "Failed to refresh token");
  }
}
