# Issue #2: Implement User Management System

## Description

Implement comprehensive user management functionality including profile updates, settings management, and user preferences for the classroom management system.

## Requirements

- User profile management (avatar, name, settings)
- User preferences (notifications, theme, etc.)
- Password change functionality
- User search and lookup capabilities
- Avatar upload and management

## Acceptance Criteria

- [ ] `GET /api/v1/users/:id` - Get user profile
- [ ] `PUT /api/v1/users/:id` - Update user profile
- [ ] `PUT /api/v1/users/:id/password` - Change password
- [ ] `POST /api/v1/users/:id/avatar` - Upload avatar
- [ ] `GET /api/v1/users/search` - Search users by name/username
- [ ] User preferences management
- [ ] Proper authorization (users can only edit their own profile)
- [ ] Image upload validation and processing
- [ ] Comprehensive test coverage

## Implementation Plan

1. **User Controller**: Implement profile CRUD operations
2. **File Upload**: Setup multer for avatar uploads
3. **Image Processing**: Add image validation and resizing
4. **Search Functionality**: Implement user search with filters
5. **Authorization**: Ensure users can only modify their own data
6. **Validation**: Add input validation for all endpoints
7. **Testing**: Write comprehensive tests
8. **Documentation**: Update API docs

## API Specifications

### GET /api/v1/users/:id

```json
// Response
{
  "code": 200,
  "message": "User retrieved successfully",
  "data": {
    "user": {
      "id": "ID",
      "username": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string",
      "role": "string",
      "preferences": {
        "notifications": ["email"],
        "darkTheme": false
      }
    }
  }
}
```

### PUT /api/v1/users/:id

```json
// Request
{
  "firstName": "string",
  "lastName": "string",
  "preferences": {
    "notifications": ["email"],
    "darkTheme": false
  }
}

// Response
{
  "code": 200,
  "message": "User updated successfully",
  "data": {
    "user": {
      "id": "ID",
      "username": "string",
      "firstName": "string",
      "lastName": "string",
      "avatar": "string",
      "preferences": {
        "notifications": ["email"],
        "darkTheme": false
      }
    }
  }
}
```

### PUT /api/v1/users/:id/password

```json
// Request
{
  "currentPassword": "string",
  "newPassword": "string"
}

// Response
{
  "code": 200,
  "message": "Password updated successfully",
  "data": {}
}
```

## Dependencies

- Issue #1: Authentication System must be completed first

## Priority

High

## Estimated Time

2-3 days

## Labels

- backend
- user-management
- high-priority
