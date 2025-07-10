import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import { register, authenticate } from '../controllers/auth/index';
import User from '../models/User';

import { vi } from 'vitest';

// Mock the response helpers
vi.mock('../helpers/response', () => ({
  sendSuccess: vi.fn(),
  sendCreated: vi.fn(),
  sendBadRequest: vi.fn(),
  sendInternalServerError: vi.fn(),
  sendUnauthorized: vi.fn(),
}));

import {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendInternalServerError,
  sendUnauthorized,
} from '../helpers/response';

describe('Auth Controller', () => {
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

  describe('register', () => {
    test('should register a new user successfully', async () => {
      const userData = {
        username: 'newuser',
        password: 'password123',
        full_name: 'New User',
        avatar: 'https://example.com/avatar.jpg',
      };

      mockRequest.body = userData;

      await register(mockRequest as Request, mockResponse as Response);

      // Verify user was created
      const user = await User.findOne({ where: { username: 'newuser' } });
      expect(user).toBeTruthy();
      expect(user?.dataValues.username).toBe(userData.username);
      expect(user?.dataValues.role).toBe('student');

      // Verify response
      expect(sendCreated).toHaveBeenCalledWith(mockResponse, {
        success: true,
        message: 'User created.',
        data: { user: expect.any(Object) },
      });
    });

    test('should return error when user already exists', async () => {
      const userData = {
        username: 'existinguser',
        password: 'password123',
        full_name: 'Existing User',
        avatar: 'https://example.com/avatar.jpg',
      };

      // Create user first
      await User.create({ ...userData, role: 'student' });

      mockRequest.body = userData;

      await register(mockRequest as Request, mockResponse as Response);

      expect(sendBadRequest).toHaveBeenCalledWith(
        mockResponse,
        'User already exists.'
      );
    });
  });

  describe('authenticate', () => {
    test('should authenticate user with correct credentials', async () => {
      const userData = {
        username: 'authuser',
        password: 'password123',
        full_name: 'Auth User',
        role: 'student' as const,
      };

      // Create user
      await User.create(userData);

      mockRequest.body = {
        username: 'authuser',
        password: 'password123',
      };

      await authenticate(mockRequest as Request, mockResponse as Response);

      expect(sendSuccess).toHaveBeenCalledWith(mockResponse, {
        success: true,
        message: 'Token created.',
        data: { token: expect.any(String) },
      });

      // Verify token is valid
      const call = (sendSuccess as any).mock.calls[0];
      const token = call[1].data.token;
      const decoded = jwt.verify(token, config.get('key.privateKey') as string);
      expect(decoded).toHaveProperty('username', 'authuser');
    });

    test('should return error for non-existent user', async () => {
      mockRequest.body = {
        username: 'nonexistent',
        password: 'password123',
      };

      await authenticate(mockRequest as Request, mockResponse as Response);

      expect(sendUnauthorized).toHaveBeenCalledWith(
        mockResponse,
        'Authentication failed.'
      );
    });

    test('should return error for wrong password', async () => {
      const userData = {
        username: 'wrongpass',
        password: 'correctpass',
        full_name: 'Wrong Pass User',
        role: 'student' as const,
      };

      // Create user
      await User.create(userData);

      mockRequest.body = {
        username: 'wrongpass',
        password: 'wrongpassword',
      };

      await authenticate(mockRequest as Request, mockResponse as Response);

      expect(sendUnauthorized).toHaveBeenCalledWith(
        mockResponse,
        'Authentication failed.'
      );
    });
  });
});