# Issue #1: Implement Backend Authentication System

## Description

Implement a comprehensive authentication system for the classroom management platform including user registration, login, logout, and JWT token management.

## Requirements

- User registration and login endpoints
- JWT token generation and validation
- Password hashing and security
- Role-based access control (admin, teacher, student)
- Token refresh mechanism
- Logout functionality

## Acceptance Criteria

- [ ] `POST /api/v1/auth/register` - User registration
- [ ] `POST /api/v1/auth/login` - User login with JWT response
- [ ] `POST /api/v1/auth/logout` - User logout
- [ ] `POST /api/v1/auth/refresh` - Token refresh
- [ ] Password hashing using bcrypt
- [ ] JWT middleware for route protection
- [ ] Role-based authorization middleware
- [ ] Input validation for all auth endpoints
- [ ] Comprehensive test coverage

## Implementation Plan

1. **Setup Dependencies**: Install bcrypt, jsonwebtoken, express-validator
2. **User Model Enhancement**: Add password hashing, role fields
3. **Auth Controller**: Implement login, register, logout, refresh methods
4. **JWT Utilities**: Create token generation, validation, and refresh logic
5. **Middleware**: Create authentication and authorization middleware
6. **Routes**: Setup auth routes with validation
7. **Testing**: Write unit and integration tests
8. **Documentation**: Update API documentation

## API Specifications

### POST /api/v1/auth/register

```json
// Request
{
  "username": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "role": "teacher" | "student"
}

// Response
{
  "code": 200,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "ID",
      "username": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string"
    },
    "token": "string"
  }
}
```

### POST /api/v1/auth/login

```json
// Request
{
  "username": "string",
  "password": "string"
}

// Response
{
  "code": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "ID",
      "username": "string",
      "firstName": "string",
      "lastName": "string",
      "role": "string"
    },
    "token": "string"
  }
}
```

## Dependencies

None

## Priority

High

## Estimated Time

3-4 days

## Labels

- backend
- authentication
- security
- high-priority
