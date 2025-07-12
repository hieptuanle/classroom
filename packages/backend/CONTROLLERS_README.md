# Class and Assignment Controllers

This document describes the Class and Assignment controllers that have been created using Drizzle ORM.

## Class Controller

### Endpoints

#### `POST /api/v1/classes`

Create a new class.

**Request Body:**

```json
{
  "name": "Mathematics 101",
  "description": "Introduction to basic mathematics",
  "settings": {
    "allowStudentsPost": false,
    "showGrades": true,
    "notificationsEnabled": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Class created successfully",
  "data": {
    "class": {
      "id": "uuid",
      "name": "Mathematics 101",
      "description": "Introduction to basic mathematics",
      "classCode": "ABC12345",
      "status": "active",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### `GET /api/v1/classes/my`

Get all classes for the current user (filtered by role).

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search term for class name, description, or code

**Response:**

```json
{
  "success": true,
  "data": {
    "classes": [
      {
        "id": "uuid",
        "name": "Mathematics 101",
        "description": "Introduction to basic mathematics",
        "classCode": "ABC12345",
        "status": "active",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### `GET /api/v1/classes/:id`

Get a specific class by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "class": {
      "id": "uuid",
      "name": "Mathematics 101",
      "description": "Introduction to basic mathematics",
      "classCode": "ABC12345",
      "inviteCode": "ABC123",
      "status": "active",
      "settings": {
        "allowStudentsPost": false,
        "showGrades": true,
        "notificationsEnabled": true
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "stats": {
        "students": 25,
        "teachers": 2
      }
    }
  }
}
```

#### `PUT /api/v1/classes/:id`

Update a class.

**Request Body:**

```json
{
  "name": "Advanced Mathematics 101",
  "description": "Advanced introduction to mathematics",
  "status": "active",
  "settings": {
    "allowStudentsPost": true,
    "showGrades": true,
    "notificationsEnabled": true
  }
}
```

#### `POST /api/v1/classes/join`

Join a class using invite code.

**Request Body:**

```json
{
  "inviteCode": "ABC123"
}
```

#### `POST /api/v1/classes/:id/invite-code`

Generate a new invite code for a class.

#### `GET /api/v1/classes/:id/enrollments`

Get all enrollments for a class.

**Response:**

```json
{
  "success": true,
  "data": {
    "enrollments": [
      {
        "id": "uuid",
        "role": "student",
        "status": "active",
        "joinedAt": "2024-01-01T00:00:00.000Z",
        "lastActivity": "2024-01-01T00:00:00.000Z",
        "user": {
          "id": "uuid",
          "username": "john_doe",
          "fullName": "John Doe",
          "avatarUrl": "https://example.com/avatar.jpg",
          "role": "student"
        }
      }
    ]
  }
}
```

#### `DELETE /api/v1/classes/:id/users/:userId`

Remove a user from a class.

## Assignment Controller

### Endpoints

#### `POST /api/v1/assignments`

Create a new assignment.

**Request Body:**

```json
{
  "title": "Algebra Quiz",
  "description": "Basic algebra concepts",
  "classId": "uuid",
  "dueDate": "2024-01-15T23:59:59.000Z",
  "points": 100,
  "assignmentType": "quiz",
  "attachments": [],
  "settings": {
    "allowLateSubmissions": false,
    "requireAttachments": false,
    "allowComments": true
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Assignment created successfully",
  "data": {
    "assignment": {
      "id": "uuid",
      "title": "Algebra Quiz",
      "description": "Basic algebra concepts",
      "classId": "uuid",
      "dueDate": "2024-01-15T23:59:59.000Z",
      "points": 100,
      "assignmentType": "quiz",
      "status": "draft",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### `GET /api/v1/assignments/class/:classId`

Get all assignments for a class.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status (draft, published, archived)

**Response:**

```json
{
  "success": true,
  "data": {
    "assignments": [
      {
        "id": "uuid",
        "title": "Algebra Quiz",
        "description": "Basic algebra concepts",
        "dueDate": "2024-01-15T23:59:59.000Z",
        "points": 100,
        "assignmentType": "quiz",
        "status": "published",
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### `GET /api/v1/assignments/:id`

Get a specific assignment by ID.

**Response:**

```json
{
  "success": true,
  "data": {
    "assignment": {
      "id": "uuid",
      "title": "Algebra Quiz",
      "description": "Basic algebra concepts",
      "classId": "uuid",
      "dueDate": "2024-01-15T23:59:59.000Z",
      "points": 100,
      "assignmentType": "quiz",
      "status": "published",
      "attachments": [],
      "settings": {
        "allowLateSubmissions": false,
        "requireAttachments": false,
        "allowComments": true
      },
      "createdAt": "2024-01-01T00:00:00.000Z",
      "creator": {
        "id": "uuid",
        "username": "teacher_jane",
        "fullName": "Jane Smith"
      }
    }
  }
}
```

#### `PUT /api/v1/assignments/:id`

Update an assignment.

**Request Body:**

```json
{
  "title": "Advanced Algebra Quiz",
  "description": "Advanced algebra concepts",
  "dueDate": "2024-01-20T23:59:59.000Z",
  "points": 150,
  "status": "published"
}
```

#### `POST /api/v1/assignments/:id/submit`

Submit an assignment.

**Request Body:**

```json
{
  "content": "My answers to the quiz questions...",
  "attachments": [
    {
      "name": "quiz_answers.pdf",
      "url": "https://example.com/file.pdf"
    }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "message": "Assignment submitted successfully",
  "data": {
    "submission": {
      "id": "uuid",
      "content": "My answers to the quiz questions...",
      "attachments": [
        {
          "name": "quiz_answers.pdf",
          "url": "https://example.com/file.pdf"
        }
      ],
      "submittedAt": "2024-01-10T12:00:00.000Z",
      "status": "submitted"
    }
  }
}
```

#### `GET /api/v1/assignments/:id/submissions`

Get all submissions for an assignment (teachers/admins only).

**Response:**

```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "content": "My answers to the quiz questions...",
        "attachments": [],
        "submittedAt": "2024-01-10T12:00:00.000Z",
        "grade": 85.5,
        "feedback": "Great work!",
        "status": "graded",
        "gradedAt": "2024-01-12T10:00:00.000Z",
        "student": {
          "id": "uuid",
          "username": "john_doe",
          "fullName": "John Doe",
          "avatarUrl": "https://example.com/avatar.jpg"
        },
        "grader": {
          "id": "uuid",
          "username": "teacher_jane",
          "fullName": "Jane Smith"
        }
      }
    ]
  }
}
```

#### `POST /api/v1/assignments/submissions/:submissionId/grade`

Grade a submission.

**Request Body:**

```json
{
  "grade": 85.5,
  "feedback": "Great work on the algebra problems!"
}
```

#### `GET /api/v1/assignments/submissions/my`

Get current user's submissions.

**Response:**

```json
{
  "success": true,
  "data": {
    "submissions": [
      {
        "id": "uuid",
        "content": "My answers to the quiz questions...",
        "attachments": [],
        "submittedAt": "2024-01-10T12:00:00.000Z",
        "grade": 85.5,
        "feedback": "Great work!",
        "status": "graded",
        "assignment": {
          "id": "uuid",
          "title": "Algebra Quiz",
          "dueDate": "2024-01-15T23:59:59.000Z",
          "points": 100
        }
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10
    }
  }
}
```

## Authentication

All endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Role-Based Access Control

### Class Access

- **Admins**: Can access all classes
- **Teachers**: Can access classes they own or are enrolled in
- **Students**: Can only access classes they're enrolled in

### Assignment Access

- **Admins**: Can create/edit assignments in any class
- **Teachers**: Can create/edit assignments in classes they own or teach
- **Students**: Can view and submit assignments in enrolled classes

### Submission Access

- **Admins/Teachers**: Can view and grade all submissions
- **Students**: Can only view their own submissions

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

Common HTTP status codes:

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error
