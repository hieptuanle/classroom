import type { Request, Response } from "express";

import config from "config";
import jwt from "jsonwebtoken";
import { vi } from "vitest";

import { login, register } from "../controllers/auth/index";
import {
  sendBadRequest,
  sendSuccess,
  sendUnauthorized,
} from "../helpers/response";
import User from "../models/user";

// Mock the response helpers
vi.mock("../helpers/response", () => ({
  sendSuccess: vi.fn(),
  sendCreated: vi.fn(),
  sendBadRequest: vi.fn(),
  sendInternalServerError: vi.fn(),
  sendUnauthorized: vi.fn(),
}));

describe("auth Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    };

    // Clear all mocks
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        email: "newuser@example.com",
        username: "newuser",
        password: "password123",
        full_name: "New User",
      };

      mockRequest.body = userData;

      await register(mockRequest as Request, mockResponse as Response);

      // Verify user was created
      const user = await User.findOne({ where: { username: "newuser" } });
      expect(user).toBeTruthy();
      expect(user?.dataValues.username).toBe(userData.username);
      expect(user?.dataValues.email).toBe(userData.email);
      expect(user?.dataValues.role).toBe("student");

      // Verify response
      expect(sendSuccess).toHaveBeenCalledWith(mockResponse, {
        message: "User registered successfully",
        data: {
          user: expect.any(Object),
          token: expect.any(String),
        },
      });
    });

    it("should return error when user already exists", async () => {
      const userData = {
        email: "existing@example.com",
        username: "existinguser",
        password: "password123",
        full_name: "Existing User",
      };

      // Create user first
      await User.create({ ...userData, role: "student" });

      mockRequest.body = userData;

      await register(mockRequest as Request, mockResponse as Response);

      expect(sendBadRequest).toHaveBeenCalledWith(
        mockResponse,
        "User with this email or username already exists",
      );
    });
  });

  describe("login", () => {
    it("should authenticate user with correct credentials", async () => {
      const userData = {
        email: "auth@example.com",
        username: "authuser",
        password: "password123",
        full_name: "Auth User",
        role: "student" as const,
      };

      // Create user
      await User.create(userData);

      mockRequest.body = {
        email: "auth@example.com",
        password: "password123",
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(sendSuccess).toHaveBeenCalledWith(mockResponse, {
        message: "Login successful",
        data: {
          user: expect.any(Object),
          token: expect.any(String),
        },
      });

      // Verify token is valid
      const call = (sendSuccess as any).mock.calls[0];
      const token = call[1].data.token;
      const decoded = jwt.verify(token, config.get("key.privateKey") as string);
      expect(decoded).toHaveProperty("email", "auth@example.com");
    });

    it("should return error for non-existent user", async () => {
      mockRequest.body = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(sendUnauthorized).toHaveBeenCalledWith(
        mockResponse,
        "Invalid credentials",
      );
    });

    it("should return error for wrong password", async () => {
      const userData = {
        email: "wrongpass@example.com",
        username: "wrongpass",
        password: "correctpass",
        full_name: "Wrong Pass User",
        role: "student" as const,
      };

      // Create user
      await User.create(userData);

      mockRequest.body = {
        email: "wrongpass@example.com",
        password: "wrongpassword",
      };

      await login(mockRequest as Request, mockResponse as Response);

      expect(sendUnauthorized).toHaveBeenCalledWith(
        mockResponse,
        "Invalid credentials",
      );
    });
  });
});
