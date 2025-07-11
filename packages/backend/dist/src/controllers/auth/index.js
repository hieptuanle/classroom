import { users } from "@backend-db/schema";
import { comparePassword, createUser, findUserByEmail, findUserById, updateUserLastLogin, } from "@backend-db/utils";
import config from "config";
import { eq, or } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { sendBadRequest, sendInternalServerError, sendNotFound, sendSuccess, sendUnauthorized, } from "@backend/helpers/response";
import { db } from "@backend/index";
import logger from "@backend/libs/logger";
const privateKey = config.get("key.privateKey");
const tokenExpireInSeconds = config.get("key.tokenExpireInSeconds");
// Register new user
export async function register(req, res) {
    try {
        const { email, username, password, fullName, role = "student" } = req.body;
        // Validate required fields
        if (!email || !username || !password || !fullName) {
            return sendBadRequest(res, "All fields are required");
        }
        // Check if user already exists
        const existingUser = await db.select().from(users).where(or(eq(users.email, email), eq(users.username, username)));
        if (existingUser.length > 0) {
            return sendBadRequest(res, "User with this email or username already exists");
        }
        // Create new user
        const newUser = await createUser({
            email,
            username,
            password,
            fullName,
            role,
        });
        // Generate token
        const token = jwt.sign({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        }, privateKey, { expiresIn: tokenExpireInSeconds });
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
            },
        });
    }
    catch (error) {
        logger.error("Registration error:", error);
        return sendInternalServerError(res, "Registration failed");
    }
}
// Login user
export async function login(req, res) {
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
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            role: user.role,
        }, privateKey, { expiresIn: tokenExpireInSeconds });
        return sendSuccess(res, {
            message: "Login successful",
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
export async function logout(_req, res) {
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
export async function getProfile(req, res) {
    try {
        const user = await findUserById(req.currentUser.id);
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
export async function updateProfile(req, res) {
    try {
        const { fullName, avatar_url, profile } = req.body;
        const user = await findUserById(req.currentUser.id);
        if (!user) {
            return sendNotFound(res, "User not found");
        }
        // Update allowed fields
        const updateData = {};
        if (fullName)
            updateData.fullName = fullName;
        if (avatar_url)
            updateData.avatarUrl = avatar_url;
        if (profile)
            updateData.profile = { ...user.profile, ...profile };
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
export async function verifyToken(req, res, next) {
    try {
        const token = req.body.token
            || req.query.token
            || req.headers["x-access-token"]
            || req.headers.authorization?.replace("Bearer ", "");
        if (!token) {
            return sendUnauthorized(res, "No token provided");
        }
        const decoded = jwt.verify(token, privateKey);
        const user = await findUserById(decoded.id);
        if (!user || !user.isActive) {
            return sendUnauthorized(res, "Invalid token");
        }
        req.currentUser = user;
        next();
    }
    catch (error) {
        logger.error("Token verification error:", error);
        return sendUnauthorized(res, "Invalid token");
    }
}
// Legacy alias for backward compatibility
export const authenticate = login;
