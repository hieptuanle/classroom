# Issue #3: Implement Class Management System

## Description

Implement comprehensive class management functionality including CRUD operations for classes, enrollment management, and class invitation system.

## Requirements

- Class creation, editing, and archiving
- Teacher and student enrollment management
- Class invitation system with unique codes
- Class search and filtering
- Permission-based access control

## Acceptance Criteria

- [ ] `POST /api/v1/classes` - Create new class (teachers only)
- [ ] `GET /api/v1/classes` - List classes with filters (teaching/enrolled)
- [ ] `GET /api/v1/classes/:id` - Get class details
- [ ] `PUT /api/v1/classes/:id` - Update class (teachers only)
- [ ] `DELETE /api/v1/classes/:id` - Archive class (teachers only)
- [ ] `POST /api/v1/classes/join` - Join class by code
- [ ] `POST /api/v1/classes/:id/invite` - Generate invitation codes
- [ ] Role-based permissions for class operations
- [ ] Class code generation and validation
- [ ] Comprehensive test coverage

## Implementation Plan

1. **Class Model**: Create/enhance class model with all required fields
2. **Class Controller**: Implement CRUD operations
3. **Enrollment System**: Handle teacher/student enrollment
4. **Invitation System**: Generate unique class codes and handle joins
5. **Permissions**: Implement role-based access control
6. **Filtering**: Add query filters for teaching/enrolled classes
7. **Validation**: Add input validation for all endpoints
8. **Testing**: Write comprehensive tests
9. **Documentation**: Update API documentation

## API Specifications

### POST /api/v1/classes

```json
// Request
{
  "name": "string",
  "section": "string",
  "subject": "string",
  "room": "string"
}

// Response
{
  "code": 200,
  "message": "Class created successfully",
  "data": {
    "class": {
      "id": "ID",
      "name": "string",
      "section": "string",
      "subject": "string",
      "room": "string",
      "inviteCode": "string",
      "teachers": [],
      "students": [],
      "archived": false,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### GET /api/v1/classes

```json
// Query params: ?teaching=true&enrolled=true&archived=true

// Response
{
  "code": 200,
  "message": "Classes retrieved successfully",
  "data": {
    "classes": [
      {
        "id": "ID",
        "name": "string",
        "section": "string",
        "subject": "string",
        "room": "string",
        "teachers": [],
        "students": [],
        "posts": [],
        "categories": [],
        "archived": false,
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ]
  }
}
```

### POST /api/v1/classes/join

```json
// Request
{
  "inviteCode": "string"
}

// Response
{
  "code": 200,
  "message": "Joined class successfully",
  "data": {
    "class": {
      "id": "ID",
      "name": "string",
      "section": "string",
      "subject": "string",
      "room": "string"
    }
  }
}
```

### POST /api/v1/classes/:id/invite

```json
// Request
{
  "role": "teacher" | "student"
}

// Response
{
  "code": 200,
  "message": "Invitation code generated",
  "data": {
    "inviteCode": "string",
    "expiresAt": "datetime"
  }
}
```

## Dependencies

- Issue #1: Authentication System
- Issue #2: User Management System

## Priority

High

## Estimated Time

4-5 days

## Labels

- backend
- class-management
- high-priority
