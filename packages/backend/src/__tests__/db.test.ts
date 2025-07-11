// import { db } from "../../db/db";
// import Assignment from "../models/assignment";
// import Class from "../models/class";
// import User from "../models/user";

// describe("database Connection", () => {
//   it("should connect to test database", async () => {
//     await expect(db.authenticate()).resolves.not.toThrow();
//   });

//   it("should sync models without errors", async () => {
//     await expect(db.sync({ force: true })).resolves.not.toThrow();
//   });
// });

// describe("user Model", () => {
//   it("should create a user with valid data", async () => {
//     const userData = {
//       email: "test@example.com",
//       username: "testuser",
//       password: "password123",
//       full_name: "Test User",
//       avatar_url: "https://example.com/avatar.jpg",
//       role: "student" as const,
//     };

//     const user = await User.create(userData);

//     expect(user.dataValues.username).toBe(userData.username);
//     expect(user.dataValues.email).toBe(userData.email);
//     expect(user.dataValues.full_name).toBe(userData.full_name);
//     expect(user.dataValues.avatar_url).toBe(userData.avatar_url);
//     expect(user.dataValues.role).toBe(userData.role);
//     expect(user.dataValues.id).toBeDefined();
//     expect(user.dataValues.is_active).toBe(true);
//   });

//   it("should find user by username", async () => {
//     const userData = {
//       email: "find@example.com",
//       username: "finduser",
//       password: "password123",
//       full_name: "Find User",
//       role: "teacher" as const,
//     };

//     await User.create(userData);

//     const foundUser = await User.findOne({ where: { username: "finduser" } });

//     expect(foundUser).toBeTruthy();
//     expect(foundUser?.dataValues.username).toBe(userData.username);
//     expect(foundUser?.dataValues.email).toBe(userData.email);
//     expect(foundUser?.dataValues.role).toBe(userData.role);
//   });

//   it("should validate required fields", async () => {
//     const invalidData = {
//       // Missing required email and username
//       password: "password123",
//       full_name: "Test User",
//     };

//     await expect(User.create(invalidData as any)).rejects.toThrow();
//   });

//   it("should hash password before saving", async () => {
//     const userData = {
//       email: "hash@example.com",
//       username: "hashuser",
//       password: "plainpassword",
//       full_name: "Hash User",
//     };

//     const user = await User.create(userData);

//     // Password should be hashed, not plain text
//     expect(user.dataValues.password).not.toBe("plainpassword");
//     expect(user.dataValues.password).toMatch(/^\$2[aby]\$/);

//     // Should be able to compare password
//     const isValid = await (user as any).comparePassword("plainpassword");
//     expect(isValid).toBe(true);

//     const isInvalid = await (user as any).comparePassword("wrongpassword");
//     expect(isInvalid).toBe(false);
//   });
// });

// describe("class Model", () => {
//   it("should create a class with valid data", async () => {
//     // First create a user to be the owner
//     const ownerUser = await User.create({
//       email: "teacher@example.com",
//       username: "teacher1",
//       password: "password123",
//       full_name: "Teacher User",
//       role: "teacher",
//     });

//     const classData = {
//       name: "Math 101",
//       description: "Basic Mathematics",
//       owner_id: ownerUser.dataValues.id,
//       class_code: "MATH101",
//     };

//     const classInstance = await Class.create(classData);

//     expect(classInstance.dataValues.name).toBe(classData.name);
//     expect(classInstance.dataValues.description).toBe(classData.description);
//     expect(classInstance.dataValues.owner_id).toBe(classData.owner_id);
//     expect(classInstance.dataValues.class_code).toBe(classData.class_code);
//     expect(classInstance.dataValues.status).toBe("active");
//     expect(classInstance.dataValues.settings).toBeDefined();
//   });

//   it("should generate class code if not provided", async () => {
//     const ownerUser = await User.create({
//       email: "teacher2@example.com",
//       username: "teacher2",
//       password: "password123",
//       full_name: "Teacher User 2",
//       role: "teacher",
//     });

//     const classData = {
//       name: "Science 101",
//       owner_id: ownerUser.dataValues.id,
//     };

//     const classInstance = await Class.create(classData);

//     expect(classInstance.dataValues.class_code).toBeDefined();
//     expect(classInstance.dataValues.class_code).toMatch(/^[A-Z0-9]{8}$/);
//   });
// });

// describe("assignment Model", () => {
//   it("should create an assignment with valid data", async () => {
//     // Create required related records
//     const teacherUser = await User.create({
//       email: "assign-teacher@example.com",
//       username: "assignteacher",
//       password: "password123",
//       full_name: "Assignment Teacher",
//       role: "teacher",
//     });

//     const testClass = await Class.create({
//       name: "Test Class",
//       owner_id: teacherUser.dataValues.id,
//       class_code: "TEST123",
//     });

//     const assignmentData = {
//       title: "Assignment 1",
//       description: "Complete the math homework",
//       class_id: testClass.dataValues.id,
//       created_by: teacherUser.dataValues.id,
//       points: 100,
//     };

//     const assignment = await Assignment.create(assignmentData);

//     expect(assignment.dataValues.title).toBe(assignmentData.title);
//     expect(assignment.dataValues.description).toBe(assignmentData.description);
//     expect(assignment.dataValues.class_id).toBe(assignmentData.class_id);
//     expect(assignment.dataValues.created_by).toBe(assignmentData.created_by);
//     expect(assignment.dataValues.points).toBe(assignmentData.points);
//     expect(assignment.dataValues.status).toBe("draft");
//     expect(assignment.dataValues.due_date).toBeDefined();
//   });
// });
