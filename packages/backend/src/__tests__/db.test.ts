import db from "@backend/db";
import { users } from "@backend/db/schema";
import {
  comparePassword,
  createAssignment,
  createClass,
  createUser,
  findUserByUsername,
} from "@backend/db/utils";

describe("database Connection", () => {
  it("should execute queries without errors", async () => {
    const result = await db.select().from(users).limit(1);
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("user Model", () => {
  it("should create a user with valid data", async () => {
    const userData = {
      email: "test@example.com",
      username: "testuser",
      password: "password123",
      fullName: "Test User",
      avatarUrl: "https://example.com/avatar.jpg",
      role: "student" as const,
    };

    const user = await createUser(userData);

    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.fullName).toBe(userData.fullName);
    expect(user.avatarUrl).toBe(userData.avatarUrl);
    expect(user.role).toBe(userData.role);
    expect(user.id).toBeDefined();
    expect(user.isActive).toBe(true);
  });

  it("should find user by username", async () => {
    const userData = {
      email: "find@example.com",
      username: "finduser",
      password: "password123",
      fullName: "Find User",
      role: "teacher" as const,
    };

    await createUser(userData);

    const foundUser = await findUserByUsername("finduser");

    expect(foundUser).toBeTruthy();
    expect(foundUser?.username).toBe(userData.username);
    expect(foundUser?.email).toBe(userData.email);
    expect(foundUser?.role).toBe(userData.role);
  });

  it("should validate required fields", async () => {
    const invalidData = {
      // Missing required email and username
      password: "password123",
      fullName: "Test User",
    };

    await expect(createUser(invalidData as any)).rejects.toThrow();
  });

  it("should hash password before saving", async () => {
    const userData = {
      email: "hash@example.com",
      username: "hashuser",
      password: "plainpassword",
      fullName: "Hash User",
    };

    const user = await createUser(userData);

    // Password should be hashed, not plain text
    expect(user.password).not.toBe("plainpassword");
    expect(user.password).toMatch(/^\$2[aby]\$/);

    // Should be able to compare password
    const isValid = await comparePassword("plainpassword", user.password);
    expect(isValid).toBe(true);

    const isInvalid = await comparePassword("wrongpassword", user.password);
    expect(isInvalid).toBe(false);
  });
});

describe("class Model", () => {
  it("should create a class with valid data", async () => {
    // First create a user to be the owner
    const ownerUser = await createUser({
      email: "teacher@example.com",
      username: "teacher1",
      password: "password123",
      fullName: "Teacher User",
      role: "teacher",
    });

    const classData = {
      name: "Math 101",
      description: "Basic Mathematics",
      ownerId: ownerUser.id,
    };

    const classInstance = await createClass(classData);

    expect(classInstance.name).toBe(classData.name);
    expect(classInstance.description).toBe(classData.description);
    expect(classInstance.ownerId).toBe(classData.ownerId);
    expect(classInstance.classCode).toBeDefined();
    expect(classInstance.status).toBe("active");
    expect(classInstance.settings).toBeDefined();
  });

  it("should generate class code if not provided", async () => {
    const ownerUser = await createUser({
      email: "teacher2@example.com",
      username: "teacher2",
      password: "password123",
      fullName: "Teacher User 2",
      role: "teacher",
    });

    const classData = {
      name: "Science 101",
      ownerId: ownerUser.id,
    };

    const classInstance = await createClass(classData);

    expect(classInstance.classCode).toBeDefined();
    expect(classInstance.classCode).toMatch(/^[A-Z0-9]{8}$/);
  });
});

describe("assignment Model", () => {
  it("should create an assignment with valid data", async () => {
    // Create required related records
    const teacherUser = await createUser({
      email: "assign-teacher@example.com",
      username: "assignteacher",
      password: "password123",
      fullName: "Assignment Teacher",
      role: "teacher",
    });

    const testClass = await createClass({
      name: "Test Class",
      ownerId: teacherUser.id,
    });

    const assignmentData = {
      title: "Assignment 1",
      description: "Complete the math homework",
      classId: testClass.id,
      createdBy: teacherUser.id,
      points: 100,
    };

    const assignment = await createAssignment(assignmentData);

    expect(assignment.title).toBe(assignmentData.title);
    expect(assignment.description).toBe(assignmentData.description);
    expect(assignment.classId).toBe(assignmentData.classId);
    expect(assignment.createdBy).toBe(assignmentData.createdBy);
    expect(assignment.points).toBe(assignmentData.points);
    expect(assignment.status).toBe("draft");
    expect(assignment.dueDate).toBeDefined();
  });
});
