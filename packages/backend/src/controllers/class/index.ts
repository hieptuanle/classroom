import type { NextFunction, Request, Response } from "express";

import { classEnrollments, classes, users } from "@backend-db/schema";
import {
  createClass,
  createEnrollment,
  findClassByCode,
  findClassById,
  findClassEnrollments,
  findClassesByOwner,
  findEnrollment,
  updateClassInviteCode,
} from "@backend-db/utils";
import { and, asc, desc, eq, or, sql } from "drizzle-orm";

import {
  sendBadRequest,
  sendForbidden,
  sendInternalServerError,
  sendNotFound,
  sendSuccess,
  sendUnauthorized,
} from "@backend/helpers/response";
import { db } from "@backend/index";
import logger from "@backend/libs/logger";

// Create a new class
export async function createClassController(
  req: Request<any, any, {
    name: string;
    description?: string;
    settings?: any;
  }>,
  res: Response,
) {
  try {
    const { name, description, settings } = req.body;
    const currentUser = (req as any).currentUser;

    // Validate required fields
    if (!name) {
      return sendBadRequest(res, "Class name is required");
    }

    // Check if user is teacher or admin
    if (currentUser.role !== "teacher" && currentUser.role !== "admin") {
      return sendForbidden(res, "Only teachers and admins can create classes");
    }

    // Create the class
    const newClass = await createClass({
      name,
      description,
      ownerId: currentUser.id,
      settings,
    });

    return sendSuccess(res, {
      message: "Class created successfully",
      data: {
        class: {
          id: newClass.id,
          name: newClass.name,
          description: newClass.description,
          classCode: newClass.classCode,
          status: newClass.status,
          createdAt: newClass.createdAt,
        },
      },
    });
  }
  catch (error) {
    logger.error("Create class error:", error);
    return sendInternalServerError(res, "Failed to create class");
  }
}

// Get all classes for current user
export async function getMyClasses(req: Request, res: Response) {
  try {
    const currentUser = (req as any).currentUser;
    const { page = 1, limit = 10, search } = req.query;

    let query = db.select().from(classes);
    const whereClauses = [];

    // Filter by ownership or enrollment
    if (currentUser.role === "admin") {
      // Admins can see all classes
    }
    else if (currentUser.role === "teacher") {
      // Teachers see their owned classes
      whereClauses.push(eq(classes.ownerId, currentUser.id));
    }
    else {
      // Students see classes they're enrolled in
      const enrollments = await findUserEnrollments(currentUser.id);
      const classIds = enrollments.map(e => e.classId);
      if (classIds.length > 0) {
        whereClauses.push(sql`${classes.id} IN (${sql.join(classIds, sql`, `)})`);
      }
      else {
        return sendSuccess(res, {
          data: {
            classes: [],
            pagination: {
              page: Number(page),
              limit: Number(limit),
              total: 0,
              totalPages: 0,
            },
          },
        });
      }
    }

    // Add search filter
    if (search) {
      whereClauses.push(or(
        sql`${classes.name} ILIKE ${`%${search}%`}`,
        sql`${classes.description} ILIKE ${`%${search}%`}`,
        sql`${classes.classCode} ILIKE ${`%${search}%`}`,
      ));
    }

    // Add pagination
    const offset = (Number(page) - 1) * Number(limit);
    const results = await query.limit(Number(limit)).offset(offset);

    // Get total count
    const [{ count: total }] = await db.select({ count: sql`count(*)` }).from(classes);

    return sendSuccess(res, {
      data: {
        classes: results.map(cls => ({
          id: cls.id,
          name: cls.name,
          description: cls.description,
          classCode: cls.classCode,
          status: cls.status,
          createdAt: cls.createdAt,
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: Number(total),
          totalPages: Math.ceil(Number(total) / Number(limit)),
        },
      },
    });
  }
  catch (error) {
    logger.error("Get my classes error:", error);
    return sendInternalServerError(res, "Failed to get classes");
  }
}

// Get a specific class by ID
export async function getClassById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const currentUser = (req as any).currentUser;

    const classRecord = await findClassById(id);
    if (!classRecord) {
      return sendNotFound(res, "Class not found");
    }

    // Check if user has access to this class
    const hasAccess
      = currentUser.role === "admin"
        || classRecord.ownerId === currentUser.id
        || await findEnrollment(currentUser.id, id);

    if (!hasAccess) {
      return sendForbidden(res, "You don't have access to this class");
    }

    // Get class enrollments count
    const enrollments = await findClassEnrollments(id);
    const studentCount = enrollments.filter(e => e.role === "student").length;
    const teacherCount = enrollments.filter(e => e.role === "teacher").length;

    return sendSuccess(res, {
      data: {
        class: {
          id: classRecord.id,
          name: classRecord.name,
          description: classRecord.description,
          classCode: classRecord.classCode,
          inviteCode: classRecord.inviteCode,
          status: classRecord.status,
          settings: classRecord.settings,
          createdAt: classRecord.createdAt,
          stats: {
            students: studentCount,
            teachers: teacherCount,
          },
        },
      },
    });
  }
  catch (error) {
    logger.error("Get class by ID error:", error);
    return sendInternalServerError(res, "Failed to get class");
  }
}

// Update a class
export async function updateClass(
  req: Request<{ id: string }, any, {
    name?: string;
    description?: string;
    status?: "active" | "archived" | "draft";
    settings?: any;
  }>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const { name, description, status, settings } = req.body;
    const currentUser = (req as any).currentUser;

    const classRecord = await findClassById(id);
    if (!classRecord) {
      return sendNotFound(res, "Class not found");
    }

    // Check if user can edit this class
    if (classRecord.ownerId !== currentUser.id && currentUser.role !== "admin") {
      return sendForbidden(res, "You can only edit your own classes");
    }

    // Update the class
    const [updatedClass] = await db.update(classes)
      .set({
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(status && { status }),
        ...(settings && { settings }),
        updatedAt: new Date(),
      })
      .where(eq(classes.id, id))
      .returning();

    return sendSuccess(res, {
      message: "Class updated successfully",
      data: {
        class: {
          id: updatedClass.id,
          name: updatedClass.name,
          description: updatedClass.description,
          classCode: updatedClass.classCode,
          status: updatedClass.status,
          settings: updatedClass.settings,
          updatedAt: updatedClass.updatedAt,
        },
      },
    });
  }
  catch (error) {
    logger.error("Update class error:", error);
    return sendInternalServerError(res, "Failed to update class");
  }
}

// Join a class using invite code
export async function joinClass(
  req: Request<any, any, { inviteCode: string }>,
  res: Response,
) {
  try {
    const { inviteCode } = req.body;
    const currentUser = (req as any).currentUser;

    if (!inviteCode) {
      return sendBadRequest(res, "Invite code is required");
    }

    // Find class by invite code
    const classRecord = await findClassByCode(inviteCode);
    if (!classRecord) {
      return sendNotFound(res, "Invalid invite code");
    }

    // Check if class is active
    if (classRecord.status !== "active") {
      return sendBadRequest(res, "This class is not accepting new members");
    }

    // Check if user is already enrolled
    const existingEnrollment = await findEnrollment(currentUser.id, classRecord.id);
    if (existingEnrollment) {
      return sendBadRequest(res, "You are already enrolled in this class");
    }

    // Create enrollment
    const enrollment = await createEnrollment({
      userId: currentUser.id,
      classId: classRecord.id,
      role: "student",
      status: "active",
    });

    return sendSuccess(res, {
      message: "Successfully joined class",
      data: {
        class: {
          id: classRecord.id,
          name: classRecord.name,
          classCode: classRecord.classCode,
        },
        enrollment: {
          id: enrollment.id,
          role: enrollment.role,
          status: enrollment.status,
          joinedAt: enrollment.joinedAt,
        },
      },
    });
  }
  catch (error) {
    logger.error("Join class error:", error);
    return sendInternalServerError(res, "Failed to join class");
  }
}

// Generate new invite code for a class
export async function generateInviteCode(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const currentUser = (req as any).currentUser;

    const classRecord = await findClassById(id);
    if (!classRecord) {
      return sendNotFound(res, "Class not found");
    }

    // Check if user can generate invite code
    if (classRecord.ownerId !== currentUser.id && currentUser.role !== "admin") {
      return sendForbidden(res, "You can only generate invite codes for your own classes");
    }

    const updatedClass = await updateClassInviteCode(id);

    return sendSuccess(res, {
      message: "Invite code generated successfully",
      data: {
        inviteCode: updatedClass.inviteCode,
      },
    });
  }
  catch (error) {
    logger.error("Generate invite code error:", error);
    return sendInternalServerError(res, "Failed to generate invite code");
  }
}

// Get class enrollments
export async function getClassEnrollments(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const currentUser = (req as any).currentUser;

    const classRecord = await findClassById(id);
    if (!classRecord) {
      return sendNotFound(res, "Class not found");
    }

    // Check if user has access to this class
    const hasAccess
      = currentUser.role === "admin"
        || classRecord.ownerId === currentUser.id
        || await findEnrollment(currentUser.id, id);

    if (!hasAccess) {
      return sendForbidden(res, "You don't have access to this class");
    }

    const enrollments = await db.select({
      id: classEnrollments.id,
      role: classEnrollments.role,
      status: classEnrollments.status,
      joinedAt: classEnrollments.joinedAt,
      lastActivity: classEnrollments.lastActivity,
      user: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
        role: users.role,
      },
    })
      .from(classEnrollments)
      .innerJoin(users, eq(classEnrollments.userId, users.id))
      .where(eq(classEnrollments.classId, id))
      .orderBy(asc(classEnrollments.joinedAt));

    return sendSuccess(res, {
      data: {
        enrollments: enrollments.map(e => ({
          id: e.id,
          role: e.role,
          status: e.status,
          joinedAt: e.joinedAt,
          lastActivity: e.lastActivity,
          user: {
            id: e.user.id,
            username: e.user.username,
            fullName: e.user.fullName,
            avatarUrl: e.user.avatarUrl,
            role: e.user.role,
          },
        })),
      },
    });
  }
  catch (error) {
    logger.error("Get class enrollments error:", error);
    return sendInternalServerError(res, "Failed to get class enrollments");
  }
}

// Remove user from class (for class owners/admins)
export async function removeUserFromClass(
  req: Request<{ id: string; userId: string }>,
  res: Response,
) {
  try {
    const { id, userId } = req.params;
    const currentUser = (req as any).currentUser;

    const classRecord = await findClassById(id);
    if (!classRecord) {
      return sendNotFound(res, "Class not found");
    }

    // Check if user can remove members
    if (classRecord.ownerId !== currentUser.id && currentUser.role !== "admin") {
      return sendForbidden(res, "You can only remove members from your own classes");
    }

    // Check if user is enrolled
    const enrollment = await findEnrollment(userId, id);
    if (!enrollment) {
      return sendNotFound(res, "User is not enrolled in this class");
    }

    // Remove enrollment
    await db.delete(classEnrollments)
      .where(and(eq(classEnrollments.userId, userId), eq(classEnrollments.classId, id)));

    return sendSuccess(res, {
      message: "User removed from class successfully",
    });
  }
  catch (error) {
    logger.error("Remove user from class error:", error);
    return sendInternalServerError(res, "Failed to remove user from class");
  }
}
