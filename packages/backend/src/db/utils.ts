import bcrypt from "bcryptjs";
import { and, count, eq, or, sql } from "drizzle-orm";

import db from "@backend/db";

import type { NewAssignment, NewClass, NewClassEnrollment, NewSubmission, NewUser } from "./schema";

import { assignments, classEnrollments, classes, submissions, users } from "./schema";

// User utilities
export async function createUser(userData: Omit<NewUser, "id" | "createdAt" | "updatedAt">) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const [user] = await db.insert(users).values({
    ...userData,
    password: hashedPassword,
  }).returning();

  return user;
}

export async function findUserByEmail(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));
  return user;
}

export async function findUserById(id: string) {
  const [user] = await db.select().from(users).where(eq(users.id, id));
  return user;
}

export async function findUserByUsername(username: string) {
  const [user] = await db.select().from(users).where(eq(users.username, username));
  return user;
}

export async function updateUserLastLogin(userId: string) {
  const [user] = await db.update(users)
    .set({ lastLogin: new Date() })
    .where(eq(users.id, userId))
    .returning();
  return user;
}

export async function comparePassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

// Class utilities
export async function createClass(classData: Omit<NewClass, "id" | "createdAt" | "updatedAt" | "classCode">) {
  const classCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  const [classRecord] = await db.insert(classes).values({
    ...classData,
    classCode,
  }).returning();

  return classRecord;
}

export async function findClassById(id: string) {
  const [classRecord] = await db.select().from(classes).where(eq(classes.id, id));
  return classRecord;
}

export async function findClassByCode(classCode: string) {
  const [classRecord] = await db.select().from(classes).where(eq(classes.classCode, classCode));
  return classRecord;
}

export async function findClassesByOwner(ownerId: string) {
  return await db.select().from(classes).where(eq(classes.ownerId, ownerId));
}

export async function updateClassInviteCode(classId: string) {
  const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  const [classRecord] = await db.update(classes)
    .set({ inviteCode })
    .where(eq(classes.id, classId))
    .returning();
  return classRecord;
}

// Assignment utilities
export async function createAssignment(assignmentData: Omit<NewAssignment, "id" | "createdAt" | "updatedAt">) {
  const [assignment] = await db.insert(assignments).values({
    ...assignmentData,
    dueDate: assignmentData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  }).returning();

  return assignment;
}

export async function findAssignmentById(id: string) {
  const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
  return assignment;
}

export async function findAssignmentsByClass(classId: string) {
  return await db.select().from(assignments).where(eq(assignments.classId, classId));
}

// Enrollment utilities
export async function createEnrollment(enrollmentData: Omit<NewClassEnrollment, "id" | "createdAt" | "updatedAt">) {
  const [enrollment] = await db.insert(classEnrollments).values(enrollmentData).returning();
  return enrollment;
}

export async function findEnrollment(userId: string, classId: string) {
  const [enrollment] = await db.select()
    .from(classEnrollments)
    .where(and(eq(classEnrollments.userId, userId), eq(classEnrollments.classId, classId)));
  return enrollment;
}

export async function findUserEnrollments(userId: string) {
  return await db.select().from(classEnrollments).where(eq(classEnrollments.userId, userId));
}

export async function findClassEnrollments(classId: string) {
  return await db.select().from(classEnrollments).where(eq(classEnrollments.classId, classId));
}

// Submission utilities
export async function createSubmission(submissionData: Omit<NewSubmission, "id" | "createdAt" | "updatedAt">) {
  const [submission] = await db.insert(submissions).values(submissionData).returning();
  return submission;
}

export async function findSubmissionById(id: string) {
  const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
  return submission;
}

export async function findSubmissionByAssignmentAndStudent(assignmentId: string, studentId: string) {
  const [submission] = await db.select()
    .from(submissions)
    .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, studentId)));
  return submission;
}

export async function findSubmissionsByAssignment(assignmentId: string) {
  return await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
}

export async function findSubmissionsByStudent(studentId: string) {
  return await db.select().from(submissions).where(eq(submissions.studentId, studentId));
}

export async function updateSubmissionGrade(
  submissionId: string,
  grade: number,
  feedback: string,
  gradedBy: string,
) {
  const [submission] = await db.update(submissions)
    .set({
      grade: grade.toString(),
      feedback,
      status: "graded" as const,
      gradedBy,
      gradedAt: new Date(),
    })
    .where(eq(submissions.id, submissionId))
    .returning();
  return submission;
}

// Pagination utilities
export async function getPaginatedResults(
  query: any,
  page: number = 1,
  limit: number = 10,
) {
  const offset = (page - 1) * limit;

  const results = await query.limit(limit).offset(offset);
  const [{ count: total }] = await db.select({ count: count() }).from(query);

  return {
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

// Search utilities
export async function searchUsers(searchTerm: string) {
  return await db.select()
    .from(users)
    .where(or(
      sql`${users.fullName} ILIKE ${`%${searchTerm}%`}`,
      sql`${users.email} ILIKE ${`%${searchTerm}%`}`,
      sql`${users.username} ILIKE ${`%${searchTerm}%`}`,
    ));
}

export async function searchClasses(searchTerm: string) {
  return await db.select()
    .from(classes)
    .where(or(
      sql`${classes.name} ILIKE ${`%${searchTerm}%`}`,
      sql`${classes.description} ILIKE ${`%${searchTerm}%`}`,
      sql`${classes.classCode} ILIKE ${`%${searchTerm}%`}`,
    ));
}
