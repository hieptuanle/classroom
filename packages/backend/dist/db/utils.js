import bcrypt from "bcryptjs";
import { and, count, eq, or, sql } from "drizzle-orm";
import { db } from "../src/index";
import { assignments, classEnrollments, classes, submissions, users } from "./schema";
// User utilities
export async function createUser(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db.insert(users).values({
        ...userData,
        password: hashedPassword,
    }).returning();
    return user;
}
export async function findUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
}
export async function findUserById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
}
export async function findUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
}
export async function updateUserLastLogin(userId) {
    const [user] = await db.update(users)
        .set({ lastLogin: new Date() })
        .where(eq(users.id, userId))
        .returning();
    return user;
}
export async function comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}
// Class utilities
export async function createClass(classData) {
    const classCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    const [classRecord] = await db.insert(classes).values({
        ...classData,
        classCode,
    }).returning();
    return classRecord;
}
export async function findClassById(id) {
    const [classRecord] = await db.select().from(classes).where(eq(classes.id, id));
    return classRecord;
}
export async function findClassByCode(classCode) {
    const [classRecord] = await db.select().from(classes).where(eq(classes.classCode, classCode));
    return classRecord;
}
export async function findClassesByOwner(ownerId) {
    return await db.select().from(classes).where(eq(classes.ownerId, ownerId));
}
export async function updateClassInviteCode(classId) {
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const [classRecord] = await db.update(classes)
        .set({ inviteCode })
        .where(eq(classes.id, classId))
        .returning();
    return classRecord;
}
// Assignment utilities
export async function createAssignment(assignmentData) {
    const [assignment] = await db.insert(assignments).values({
        ...assignmentData,
        dueDate: assignmentData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }).returning();
    return assignment;
}
export async function findAssignmentById(id) {
    const [assignment] = await db.select().from(assignments).where(eq(assignments.id, id));
    return assignment;
}
export async function findAssignmentsByClass(classId) {
    return await db.select().from(assignments).where(eq(assignments.classId, classId));
}
// Enrollment utilities
export async function createEnrollment(enrollmentData) {
    const [enrollment] = await db.insert(classEnrollments).values(enrollmentData).returning();
    return enrollment;
}
export async function findEnrollment(userId, classId) {
    const [enrollment] = await db.select()
        .from(classEnrollments)
        .where(and(eq(classEnrollments.userId, userId), eq(classEnrollments.classId, classId)));
    return enrollment;
}
export async function findUserEnrollments(userId) {
    return await db.select().from(classEnrollments).where(eq(classEnrollments.userId, userId));
}
export async function findClassEnrollments(classId) {
    return await db.select().from(classEnrollments).where(eq(classEnrollments.classId, classId));
}
// Submission utilities
export async function createSubmission(submissionData) {
    const [submission] = await db.insert(submissions).values(submissionData).returning();
    return submission;
}
export async function findSubmissionById(id) {
    const [submission] = await db.select().from(submissions).where(eq(submissions.id, id));
    return submission;
}
export async function findSubmissionByAssignmentAndStudent(assignmentId, studentId) {
    const [submission] = await db.select()
        .from(submissions)
        .where(and(eq(submissions.assignmentId, assignmentId), eq(submissions.studentId, studentId)));
    return submission;
}
export async function findSubmissionsByAssignment(assignmentId) {
    return await db.select().from(submissions).where(eq(submissions.assignmentId, assignmentId));
}
export async function findSubmissionsByStudent(studentId) {
    return await db.select().from(submissions).where(eq(submissions.studentId, studentId));
}
export async function updateSubmissionGrade(submissionId, grade, feedback, gradedBy) {
    const [submission] = await db.update(submissions)
        .set({
        grade: grade.toString(),
        feedback,
        status: "graded",
        gradedBy,
        gradedAt: new Date(),
    })
        .where(eq(submissions.id, submissionId))
        .returning();
    return submission;
}
// Pagination utilities
export async function getPaginatedResults(query, page = 1, limit = 10) {
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
export async function searchUsers(searchTerm) {
    return await db.select()
        .from(users)
        .where(or(sql `${users.fullName} ILIKE ${`%${searchTerm}%`}`, sql `${users.email} ILIKE ${`%${searchTerm}%`}`, sql `${users.username} ILIKE ${`%${searchTerm}%`}`));
}
export async function searchClasses(searchTerm) {
    return await db.select()
        .from(classes)
        .where(or(sql `${classes.name} ILIKE ${`%${searchTerm}%`}`, sql `${classes.description} ILIKE ${`%${searchTerm}%`}`, sql `${classes.classCode} ILIKE ${`%${searchTerm}%`}`));
}
