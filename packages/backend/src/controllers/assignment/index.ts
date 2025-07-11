import type { Submission } from "@backend-db/schema";
import type { NextFunction, Request, Response } from "express";

import { assignments, classes, submissions, users } from "@backend-db/schema";
import {
  createAssignment,
  createSubmission,
  findAssignmentById,
  // findAssignmentsByClass,
  findEnrollment,
  findSubmissionByAssignmentAndStudent,
  // findSubmissionsByAssignment,
  // updateSubmissionGrade,
} from "@backend-db/utils";
import { and, asc, desc, eq, sql } from "drizzle-orm";

import {
  sendBadRequest,
  sendForbidden,
  sendInternalServerError,
  sendNotFound,
  sendSuccess,
  // sendUnauthorized,
} from "@backend/helpers/response";
import { db } from "@backend/index";
import logger from "@backend/libs/logger";

// Create a new assignment
export async function createAssignmentController(
  req: Request<any, any, {
    title: string;
    description?: string;
    classId: string;
    dueDate?: string;
    points?: number;
    assignmentType?: "assignment" | "quiz" | "material";
    attachments?: any[];
    settings?: any;
  }>,
  res: Response,
) {
  try {
    const {
      title,
      description,
      classId,
      dueDate,
      points = 100,
      assignmentType = "assignment",
      attachments = [],
      settings,
    } = req.body;
    const currentUser = (req as any).currentUser;

    // Validate required fields
    if (!title || !classId) {
      return sendBadRequest(res, "Title and class ID are required");
    }

    // Check if class exists and user has access
    const classRecord = await db.select().from(classes).where(eq(classes.id, classId));
    if (!classRecord.length) {
      return sendNotFound(res, "Class not found");
    }

    // Check if user can create assignments in this class
    const enrollment = await findEnrollment(currentUser.id, classId);
    const canCreate
      = currentUser.role === "admin"
        || classRecord[0].ownerId === currentUser.id
        || (enrollment && enrollment.role === "teacher");

    if (!canCreate) {
      return sendForbidden(res, "You don't have permission to create assignments in this class");
    }

    // Create the assignment
    const newAssignment = await createAssignment({
      title,
      description,
      classId,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      points,
      assignmentType,
      attachments,
      settings,
      createdBy: currentUser.id,
    });

    return sendSuccess(res, {
      message: "Assignment created successfully",
      data: {
        assignment: {
          id: newAssignment.id,
          title: newAssignment.title,
          description: newAssignment.description,
          classId: newAssignment.classId,
          dueDate: newAssignment.dueDate,
          points: newAssignment.points,
          assignmentType: newAssignment.assignmentType,
          status: newAssignment.status,
          createdAt: newAssignment.createdAt,
        },
      },
    });
  }
  catch (error) {
    logger.error("Create assignment error:", error);
    return sendInternalServerError(res, "Failed to create assignment");
  }
}

// Get assignments for a class
export async function getClassAssignments(req: Request<{ classId: string }>, res: Response) {
  try {
    const { classId } = req.params;
    const currentUser = (req as any).currentUser;
    const { page = 1, limit = 10, status } = req.query;

    // Check if user has access to this class
    const classRecord = await db.select().from(classes).where(eq(classes.id, classId));
    if (!classRecord.length) {
      return sendNotFound(res, "Class not found");
    }

    const enrollment = await findEnrollment(currentUser.id, classId);
    const hasAccess
      = currentUser.role === "admin"
        || classRecord[0].ownerId === currentUser.id
        || enrollment;

    if (!hasAccess) {
      return sendForbidden(res, "You don't have access to this class");
    }

    const whereClauses = [eq(assignments.classId, classId)];
    if (status) {
      whereClauses.push(eq(assignments.status, status as any));
    }

    const query = db.select().from(assignments).where(and(...whereClauses));

    // Add pagination
    const offset = (Number(page) - 1) * Number(limit);
    const results = await query
      .orderBy(desc(assignments.createdAt))
      .limit(Number(limit))
      .offset(offset);

    // Get total count
    const [{ count: total }] = await db.select({ count: sql`count(*)` })
      .from(assignments)
      .where(eq(assignments.classId, classId));

    return sendSuccess(res, {
      data: {
        assignments: results.map(assignment => ({
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          dueDate: assignment.dueDate,
          points: assignment.points,
          assignmentType: assignment.assignmentType,
          status: assignment.status,
          createdAt: assignment.createdAt,
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
    logger.error("Get class assignments error:", error);
    return sendInternalServerError(res, "Failed to get assignments");
  }
}

// Get a specific assignment by ID
export async function getAssignmentById(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const currentUser = (req as any).currentUser;

    const assignment = await findAssignmentById(id);
    if (!assignment) {
      return sendNotFound(res, "Assignment not found");
    }

    // Check if user has access to this assignment's class
    const classRecord = await db.select().from(classes).where(eq(classes.id, assignment.classId));
    if (!classRecord.length) {
      return sendNotFound(res, "Class not found");
    }

    const enrollment = await findEnrollment(currentUser.id, assignment.classId);
    const hasAccess
      = currentUser.role === "admin"
        || classRecord[0].ownerId === currentUser.id
        || enrollment;

    if (!hasAccess) {
      return sendForbidden(res, "You don't have access to this assignment");
    }

    // Get creator info
    const creator = await db.select({
      id: users.id,
      username: users.username,
      fullName: users.fullName,
    }).from(users).where(eq(users.id, assignment.createdBy));

    return sendSuccess(res, {
      data: {
        assignment: {
          id: assignment.id,
          title: assignment.title,
          description: assignment.description,
          classId: assignment.classId,
          dueDate: assignment.dueDate,
          points: assignment.points,
          assignmentType: assignment.assignmentType,
          status: assignment.status,
          attachments: assignment.attachments,
          settings: assignment.settings,
          createdAt: assignment.createdAt,
          creator: creator[0] || null,
        },
      },
    });
  }
  catch (error) {
    logger.error("Get assignment by ID error:", error);
    return sendInternalServerError(res, "Failed to get assignment");
  }
}

// Update an assignment
export async function updateAssignment(
  req: Request<{ id: string }, any, {
    title?: string;
    description?: string;
    dueDate?: string;
    points?: number;
    status?: "draft" | "published" | "archived";
    assignmentType?: "assignment" | "quiz" | "material";
    attachments?: any[];
    settings?: any;
  }>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const currentUser = (req as any).currentUser;

    const assignment = await findAssignmentById(id);
    if (!assignment) {
      return sendNotFound(res, "Assignment not found");
    }

    // Check if user can edit this assignment
    const classRecord = await db.select().from(classes).where(eq(classes.id, assignment.classId));
    if (!classRecord.length) {
      return sendNotFound(res, "Class not found");
    }

    const canEdit
      = currentUser.role === "admin"
        || classRecord[0].ownerId === currentUser.id
        || assignment.createdBy === currentUser.id;

    if (!canEdit) {
      return sendForbidden(res, "You can only edit assignments you created");
    }

    // Update the assignment
    const [updatedAssignment] = await db.update(assignments)
      .set({
        ...(updateData.title && { title: updateData.title }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.dueDate && { dueDate: new Date(updateData.dueDate) }),
        ...(updateData.points && { points: updateData.points }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.assignmentType && { assignmentType: updateData.assignmentType }),
        ...(updateData.attachments && { attachments: updateData.attachments }),
        ...(updateData.settings && { settings: updateData.settings }),
        updatedAt: new Date(),
      })
      .where(eq(assignments.id, id))
      .returning();

    return sendSuccess(res, {
      message: "Assignment updated successfully",
      data: {
        assignment: {
          id: updatedAssignment.id,
          title: updatedAssignment.title,
          description: updatedAssignment.description,
          dueDate: updatedAssignment.dueDate,
          points: updatedAssignment.points,
          assignmentType: updatedAssignment.assignmentType,
          status: updatedAssignment.status,
          updatedAt: updatedAssignment.updatedAt,
        },
      },
    });
  }
  catch (error) {
    logger.error("Update assignment error:", error);
    return sendInternalServerError(res, "Failed to update assignment");
  }
}

// Submit an assignment
export async function submitAssignment(
  req: Request<{ id: string }, any, {
    content?: string;
    attachments?: any[];
  }>,
  res: Response,
) {
  try {
    const { id } = req.params;
    const { content, attachments = [] } = req.body;
    const currentUser = (req as any).currentUser;

    const assignment = await findAssignmentById(id);
    if (!assignment) {
      return sendNotFound(res, "Assignment not found");
    }

    // Check if assignment is published
    if (assignment.status !== "published") {
      return sendBadRequest(res, "This assignment is not available for submission");
    }

    // Check if user is enrolled in the class
    const enrollment = await findEnrollment(currentUser.id, assignment.classId);
    if (!enrollment || enrollment.role !== "student") {
      return sendForbidden(res, "Only enrolled students can submit assignments");
    }

    // Check if user has already submitted
    const existingSubmission = await findSubmissionByAssignmentAndStudent(id, currentUser.id);
    if (existingSubmission) {
      return sendBadRequest(res, "You have already submitted this assignment");
    }

    // Check if assignment is due
    if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) {
      return sendBadRequest(res, "This assignment is past due");
    }

    // Create submission
    const submission = await createSubmission({
      assignmentId: id,
      studentId: currentUser.id,
      content,
      attachments,
      status: "submitted",
    });

    return sendSuccess(res, {
      message: "Assignment submitted successfully",
      data: {
        submission: {
          id: submission.id,
          content: submission.content,
          attachments: submission.attachments,
          submittedAt: submission.submittedAt,
          status: submission.status,
        },
      },
    });
  }
  catch (error) {
    logger.error("Submit assignment error:", error);
    return sendInternalServerError(res, "Failed to submit assignment");
  }
}

// Get submissions for an assignment (for teachers/admins)
export async function getAssignmentSubmissions(req: Request<{ id: string }>, res: Response) {
  try {
    const { id } = req.params;
    const currentUser = (req as any).currentUser;

    const assignment = await findAssignmentById(id);
    if (!assignment) {
      return sendNotFound(res, "Assignment not found");
    }

    // Check if user can view submissions
    const classRecord = await db.select().from(classes).where(eq(classes.id, assignment.classId));
    if (!classRecord.length) {
      return sendNotFound(res, "Class not found");
    }

    const canViewSubmissions
      = currentUser.role === "admin"
        || classRecord[0].ownerId === currentUser.id
        || assignment.createdBy === currentUser.id;

    if (!canViewSubmissions) {
      return sendForbidden(res, "You don't have permission to view submissions");
    }

    const submissionsData: any[] = await db.select({
      id: submissions.id,
      content: submissions.content,
      attachments: submissions.attachments,
      submittedAt: submissions.submittedAt,
      grade: submissions.grade,
      feedback: submissions.feedback,
      status: submissions.status,
      gradedAt: submissions.gradedAt,
      student: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
        avatarUrl: users.avatarUrl,
      },
      grader: {
        id: users.id,
        username: users.username,
        fullName: users.fullName,
      },
    })
      .from(submissions)
      .innerJoin(users, eq(submissions.studentId, users.id))
      .leftJoin(users, eq(submissions.gradedBy, users.id))
      .where(eq(submissions.assignmentId, id))
      .orderBy(asc(submissions.submittedAt));

    return sendSuccess(res, {
      data: {
        submissions: submissionsData.map(sub => ({
          id: sub.id,
          content: sub.content,
          attachments: sub.attachments,
          submittedAt: sub.submittedAt,
          grade: sub.grade,
          feedback: sub.feedback,
          status: sub.status,
          gradedAt: sub.gradedAt,
          student: sub.student,
          grader: sub.grader,
        })),
      },
    });
  }
  catch (error) {
    logger.error("Get assignment submissions error:", error);
    return sendInternalServerError(res, "Failed to get submissions");
  }
}

// Grade a submission
export async function gradeSubmission(
  req: Request<{ submissionId: string }, any, {
    grade: number;
    feedback?: string;
  }>,
  res: Response,
) {
  try {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    const currentUser = (req as any).currentUser;

    // Validate grade
    if (grade < 0 || grade > 100) {
      return sendBadRequest(res, "Grade must be between 0 and 100");
    }

    const submission = await db.select().from(submissions).where(eq(submissions.id, submissionId));
    if (!submission.length) {
      return sendNotFound(res, "Submission not found");
    }

    const assignment = await findAssignmentById(submission[0].assignmentId);
    if (!assignment) {
      return sendNotFound(res, "Assignment not found");
    }

    // Check if user can grade this submission
    const classRecord = await db.select().from(classes).where(eq(classes.id, assignment.classId));
    if (!classRecord.length) {
      return sendNotFound(res, "Class not found");
    }

    const canGrade
      = currentUser.role === "admin"
        || classRecord[0].ownerId === currentUser.id
        || assignment.createdBy === currentUser.id;

    if (!canGrade) {
      return sendForbidden(res, "You don't have permission to grade this submission");
    }

    // Update the submission
    const [updatedSubmission] = await db.update(submissions)
      .set({
        grade: grade.toString(),
        feedback,
        status: "graded",
        gradedBy: currentUser.id,
        gradedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(submissions.id, submissionId))
      .returning();

    return sendSuccess(res, {
      message: "Submission graded successfully",
      data: {
        submission: {
          id: updatedSubmission.id,
          grade: updatedSubmission.grade,
          feedback: updatedSubmission.feedback,
          status: updatedSubmission.status,
          gradedAt: updatedSubmission.gradedAt,
        },
      },
    });
  }
  catch (error) {
    logger.error("Grade submission error:", error);
    return sendInternalServerError(res, "Failed to grade submission");
  }
}

// Get my submissions (for students)
export async function getMySubmissions(req: Request, res: Response) {
  try {
    const currentUser = (req as any).currentUser;
    const { page = 1, limit = 10 } = req.query;

    const submissionsData: any[] = await db.select({
      id: submissions.id,
      content: submissions.content,
      attachments: submissions.attachments,
      submittedAt: submissions.submittedAt,
      grade: submissions.grade,
      feedback: submissions.feedback,
      status: submissions.status,
      assignment: {
        id: assignments.id,
        title: assignments.title,
        dueDate: assignments.dueDate,
        points: assignments.points,
      },
    })
      .from(submissions)
      .innerJoin(assignments, eq(submissions.assignmentId, assignments.id))
      .where(eq(submissions.studentId, currentUser.id))
      .orderBy(desc(submissions.submittedAt))
      .limit(Number(limit))
      .offset((Number(page) - 1) * Number(limit));

    return sendSuccess(res, {
      data: {
        submissions: submissionsData.map(sub => ({
          id: sub.id,
          content: sub.content,
          attachments: sub.attachments,
          submittedAt: sub.submittedAt,
          grade: sub.grade,
          feedback: sub.feedback,
          status: sub.status,
          assignment: sub.assignment,
        })),
        pagination: {
          page: Number(page),
          limit: Number(limit),
        },
      },
    });
  }
  catch (error) {
    logger.error("Get my submissions error:", error);
    return sendInternalServerError(res, "Failed to get submissions");
  }
}
