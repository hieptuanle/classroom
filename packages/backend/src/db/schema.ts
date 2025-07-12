import { relations } from "drizzle-orm";
import { boolean, decimal, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["admin", "teacher", "student"]);
export const classStatusEnum = pgEnum("class_status", ["active", "archived", "draft"]);
export const assignmentStatusEnum = pgEnum("assignment_status", ["draft", "published", "archived"]);
export const assignmentTypeEnum = pgEnum("assignment_type", ["assignment", "quiz", "material"]);
export const enrollmentRoleEnum = pgEnum("enrollment_role", ["student", "teacher", "co-teacher"]);
export const enrollmentStatusEnum = pgEnum("enrollment_status", ["active", "inactive", "pending"]);
export const submissionStatusEnum = pgEnum("submission_status", ["submitted", "late", "graded", "returned"]);

// Users table
export const users = pgTable("Users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: varchar("password", { length: 100 }).notNull(),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 500 }),
  role: userRoleEnum("role").notNull().default("student"),
  isActive: boolean("is_active").notNull().default(true),
  lastLogin: timestamp("last_login"),
  profile: jsonb("profile").default({}),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, table => ({
  emailIdx: index("users_email_idx").on(table.email),
  usernameIdx: index("users_username_idx").on(table.username),
}));

// Classes table
export const classes = pgTable("Classes", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  classCode: varchar("class_code", { length: 8 }).notNull().unique(),
  inviteCode: varchar("invite_code", { length: 6 }).unique(),
  ownerId: uuid("owner_id").notNull().references(() => users.id),
  status: classStatusEnum("status").notNull().default("active"),
  settings: jsonb("settings").default({
    allowStudentsPost: false,
    showGrades: true,
    notificationsEnabled: true,
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, table => ({
  classCodeIdx: index("classes_class_code_idx").on(table.classCode),
  ownerIdIdx: index("classes_owner_id_idx").on(table.ownerId),
}));

// Assignments table
export const assignments = pgTable("Assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  classId: uuid("class_id").notNull().references(() => classes.id),
  createdBy: uuid("created_by").notNull().references(() => users.id),
  dueDate: timestamp("due_date"),
  points: integer("points").notNull().default(100),
  status: assignmentStatusEnum("status").notNull().default("draft"),
  assignmentType: assignmentTypeEnum("assignment_type").notNull().default("assignment"),
  attachments: jsonb("attachments").default([]),
  settings: jsonb("settings").default({
    allowLateSubmissions: false,
    requireAttachments: false,
    allowComments: true,
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, table => ({
  classIdIdx: index("assignments_class_id_idx").on(table.classId),
  createdByIdx: index("assignments_created_by_idx").on(table.createdBy),
}));

// Class Enrollments table
export const classEnrollments = pgTable("ClassEnrollments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  classId: uuid("class_id").notNull().references(() => classes.id),
  role: enrollmentRoleEnum("role").notNull().default("student"),
  status: enrollmentStatusEnum("status").notNull().default("active"),
  joinedAt: timestamp("joined_at").notNull().defaultNow(),
  lastActivity: timestamp("last_activity").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, table => ({
  userIdIdx: index("class_enrollments_user_id_idx").on(table.userId),
  classIdIdx: index("class_enrollments_class_id_idx").on(table.classId),
  uniqueUserClass: index("class_enrollments_user_class_unique_idx").on(table.userId, table.classId),
}));

// Submissions table
export const submissions = pgTable("Submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  assignmentId: uuid("assignment_id").notNull().references(() => assignments.id),
  studentId: uuid("student_id").notNull().references(() => users.id),
  content: text("content"),
  attachments: jsonb("attachments").default([]),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  grade: decimal("grade", { precision: 5, scale: 2 }),
  feedback: text("feedback"),
  status: submissionStatusEnum("status").notNull().default("submitted"),
  gradedBy: uuid("graded_by").references(() => users.id),
  gradedAt: timestamp("graded_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, table => ({
  assignmentIdIdx: index("submissions_assignment_id_idx").on(table.assignmentId),
  studentIdIdx: index("submissions_student_id_idx").on(table.studentId),
  uniqueAssignmentStudent: index("submissions_assignment_student_unique_idx").on(table.assignmentId, table.studentId),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedClasses: many(classes, { relationName: "userOwnedClasses" }),
  createdAssignments: many(assignments, { relationName: "userCreatedAssignments" }),
  enrollments: many(classEnrollments, { relationName: "userEnrollments" }),
  submissions: many(submissions, { relationName: "studentSubmissions" }),
  gradedSubmissions: many(submissions, { relationName: "userGradedSubmissions" }),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  owner: one(users, {
    fields: [classes.ownerId],
    references: [users.id],
    relationName: "userOwnedClasses",
  }),
  assignments: many(assignments, { relationName: "classAssignments" }),
  enrollments: many(classEnrollments, { relationName: "classEnrollments" }),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
  creator: one(users, {
    fields: [assignments.createdBy],
    references: [users.id],
    relationName: "userCreatedAssignments",
  }),
  class: one(classes, {
    fields: [assignments.classId],
    references: [classes.id],
    relationName: "classAssignments",
  }),
  submissions: many(submissions, { relationName: "assignmentSubmissions" }),
}));

export const classEnrollmentsRelations = relations(classEnrollments, ({ one }) => ({
  user: one(users, {
    fields: [classEnrollments.userId],
    references: [users.id],
    relationName: "userEnrollments",
  }),
  class: one(classes, {
    fields: [classEnrollments.classId],
    references: [classes.id],
    relationName: "classEnrollments",
  }),
}));

export const submissionsRelations = relations(submissions, ({ one }) => ({
  assignment: one(assignments, {
    fields: [submissions.assignmentId],
    references: [assignments.id],
    relationName: "assignmentSubmissions",
  }),
  student: one(users, {
    fields: [submissions.studentId],
    references: [users.id],
    relationName: "studentSubmissions",
  }),
  grader: one(users, {
    fields: [submissions.gradedBy],
    references: [users.id],
    relationName: "userGradedSubmissions",
  }),
}));

// Export types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Class = typeof classes.$inferSelect;
export type NewClass = typeof classes.$inferInsert;
export type Assignment = typeof assignments.$inferSelect;
export type NewAssignment = typeof assignments.$inferInsert;
export type ClassEnrollment = typeof classEnrollments.$inferSelect;
export type NewClassEnrollment = typeof classEnrollments.$inferInsert;
export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
