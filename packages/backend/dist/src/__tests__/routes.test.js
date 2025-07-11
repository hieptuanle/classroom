// import bodyParser from "body-parser";
// import express from "express";
// import request from "supertest";
export {};
// import { setHeadersForCORS } from "../helpers/response";
// import User from "../models/user";
// import routes from "../routes/index";
// // Create test app
// function createTestApp() {
//   const app = express();
//   app.use(bodyParser.json());
//   app.use(bodyParser.urlencoded({ extended: true }));
//   app.use(setHeadersForCORS);
//   app.use("/api/v1", routes);
//   return app;
// }
// describe("main routes", () => {
//   const app = createTestApp();
//   it("request GET to /api/v1/ should return hello world message", async () => {
//     const response = await request(app)
//       .get("/api/v1/")
//       .expect(200);
//     expect(response.body).toEqual({
//       message: "Hello World",
//     });
//   });
//   it("request GET to /api/v1/nonexistent should return 404", async () => {
//     const response = await request(app)
//       .get("/api/v1/nonexistent")
//       .expect(404);
//     expect(response.body).toEqual({
//       message: "Not Found",
//     });
//   });
//   it("request GET to /api/v1/ should set CORS headers", async () => {
//     const response = await request(app)
//       .get("/api/v1/")
//       .expect(200);
//     expect(response.headers["access-control-allow-origin"]).toBe("*");
//     expect(response.headers["access-control-allow-headers"]).toBe(
//       "Origin, X-Requested-With, X-Access-Token, Content-Type, Accept",
//     );
//   });
// });
// describe("auth routes", () => {
//   const app = createTestApp();
//   it("request GET to /api/v1/auth/ should return hello world auth message", async () => {
//     const response = await request(app)
//       .get("/api/v1/auth/")
//       .expect(200);
//     expect(response.body).toEqual({
//       message: "Hello World auth",
//     });
//   });
//   it("request POST to /api/v1/auth/register should create a new user", async () => {
//     const userData = {
//       email: "testuser@example.com",
//       username: "testuser",
//       password: "password123",
//       full_name: "Test User",
//     };
//     const response = await request(app)
//       .post("/api/v1/auth/register")
//       .send(userData)
//       .expect(200);
//     expect(response.body).toMatchObject({
//       message: "User registered successfully",
//       data: {
//         user: expect.objectContaining({
//           username: userData.username,
//           email: userData.email,
//           full_name: userData.full_name,
//           role: "student",
//         }),
//         token: expect.any(String),
//       },
//     });
//     // Verify user was created in database
//     const user = await User.findOne({ where: { username: "testuser" } });
//     expect(user).toBeTruthy();
//   });
//   it("request POST to /api/v1/auth/register should return error for duplicate username", async () => {
//     const userData = {
//       email: "duplicate@example.com",
//       username: "duplicateuser",
//       password: "password123",
//       full_name: "Duplicate User",
//     };
//     // Create user first
//     await User.create({ ...userData, role: "student" });
//     const response = await request(app)
//       .post("/api/v1/auth/register")
//       .send(userData)
//       .expect(400);
//     expect(response.body).toMatchObject({
//       success: false,
//       message: "User with this email or username already exists",
//     });
//   });
//   it("request POST to /api/v1/auth/login should authenticate user with correct credentials", async () => {
//     const userData = {
//       email: "login@example.com",
//       username: "loginuser",
//       password: "password123",
//       full_name: "Login User",
//       role: "student" as const,
//     };
//     // Create user
//     await User.create(userData);
//     const response = await request(app)
//       .post("/api/v1/auth/login")
//       .send({
//         email: "login@example.com",
//         password: "password123",
//       })
//       .expect(200);
//     expect(response.body).toMatchObject({
//       message: "Login successful",
//       data: {
//         user: expect.objectContaining({
//           email: userData.email,
//           username: userData.username,
//         }),
//         token: expect.any(String),
//       },
//     });
//   });
//   it("request POST to /api/v1/auth/login should return error for invalid credentials", async () => {
//     const userData = {
//       email: "invalid@example.com",
//       username: "invaliduser",
//       password: "correctpass",
//       full_name: "Invalid User",
//       role: "student" as const,
//     };
//     // Create user
//     await User.create(userData);
//     const response = await request(app)
//       .post("/api/v1/auth/login")
//       .send({
//         email: "invalid@example.com",
//         password: "wrongpass",
//       })
//       .expect(401);
//     expect(response.body).toMatchObject({
//       success: false,
//       message: "Invalid credentials",
//     });
//   });
//   it("request POST to /api/v1/auth/login should return error for non-existent user", async () => {
//     const response = await request(app)
//       .post("/api/v1/auth/login")
//       .send({
//         email: "nonexistent@example.com",
//         password: "password123",
//       })
//       .expect(401);
//     expect(response.body).toMatchObject({
//       success: false,
//       message: "Invalid credentials",
//     });
//   });
// });
