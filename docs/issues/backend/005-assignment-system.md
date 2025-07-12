# Issue #5: Implement Assignment and Submission System

## Description

Implement comprehensive assignment management including assignment creation, student submissions, grading system, and assignment categorization.

## Requirements

- Assignment creation with different types (exercise, test, question, document)
- Student submission system with multiple content types
- Grading and feedback system
- Assignment categories/topics management
- Submission status tracking
- Bulk grading capabilities

## Acceptance Criteria

- [ ] `POST /api/v1/assignments` - Create assignment
- [ ] `GET /api/v1/assignments` - List assignments with filters
- [ ] `GET /api/v1/assignments/:id` - Get assignment details
- [ ] `PUT /api/v1/assignments/:id` - Update assignment
- [ ] `POST /api/v1/assignments/:id/submissions` - Submit assignment
- [ ] `GET /api/v1/assignments/:id/submissions` - Get all submissions (teachers)
- [ ] `PUT /api/v1/submissions/:id/grade` - Grade submission
- [ ] `POST /api/v1/categories` - Create assignment category
- [ ] Assignment types: exercise, test, question, document
- [ ] Submission types: text, file upload, image, link
- [ ] Grading system with scores and feedback
- [ ] Comprehensive test coverage

## Implementation Plan

1. **Assignment Model**: Create assignment model extending posts
2. **Submission Model**: Create submission/answer model
3. **Category Model**: Create category model for organization
4. **Assignment Controller**: Implement assignment CRUD
5. **Submission Controller**: Handle student submissions
6. **Grading System**: Implement grading and feedback
7. **Category Management**: Handle assignment categories
8. **File Handling**: Support various submission types
9. **Permissions**: Role-based access control
10. **Testing**: Write comprehensive tests
11. **Documentation**: Update API docs

## API Specifications

### POST /api/v1/assignments

```json
// Request
{
  "title": "string",
  "description": "string",
  "type": "exercise" | "test" | "question" | "document",
  "classId": "ID",
  "categoryId": "ID",
  "dueDate": "datetime",
  "maxScore": 100,
  "instructions": "string",
  "attachments": []
}

// Response
{
  "code": 200,
  "message": "Assignment created successfully",
  "data": {
    "assignment": {
      "id": "ID",
      "title": "string",
      "description": "string",
      "type": "string",
      "classId": "ID",
      "categoryId": "ID",
      "dueDate": "datetime",
      "maxScore": 100,
      "instructions": "string",
      "attachments": [],
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### POST /api/v1/assignments/:id/submissions

```json
// Request
{
  "content": "string",
  "attachments": [],
  "submissionType": "text" | "file" | "image" | "link"
}

// Response
{
  "code": 200,
  "message": "Assignment submitted successfully",
  "data": {
    "submission": {
      "id": "ID",
      "assignmentId": "ID",
      "studentId": "ID",
      "content": "string",
      "attachments": [],
      "status": "submitted",
      "score": null,
      "feedback": null,
      "submittedAt": "datetime",
      "gradedAt": null
    }
  }
}
```

### GET /api/v1/assignments/:id/submissions

```json
// Response (Teachers only)
{
  "code": 200,
  "message": "Submissions retrieved successfully",
  "data": {
    "submissions": [
      {
        "id": "ID",
        "assignmentId": "ID",
        "student": {
          "id": "ID",
          "firstName": "string",
          "lastName": "string",
          "avatar": "string"
        },
        "content": "string",
        "attachments": [],
        "status": "submitted" | "graded" | "returned",
        "score": 95,
        "feedback": "string",
        "submittedAt": "datetime",
        "gradedAt": "datetime"
      }
    ]
  }
}
```

### PUT /api/v1/submissions/:id/grade

```json
// Request (Teachers only)
{
  "score": 95,
  "feedback": "string",
  "isPrivate": false
}

// Response
{
  "code": 200,
  "message": "Submission graded successfully",
  "data": {
    "submission": {
      "id": "ID",
      "score": 95,
      "feedback": "string",
      "status": "graded",
      "gradedAt": "datetime"
    }
  }
}
```

### POST /api/v1/categories

```json
// Request
{
  "title": "string",
  "classId": "ID",
  "order": 1
}

// Response
{
  "code": 200,
  "message": "Category created successfully",
  "data": {
    "category": {
      "id": "ID",
      "title": "string",
      "classId": "ID",
      "order": 1,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

## Dependencies

- Issue #3: Class Management System
- Issue #4: Post Management System

## Priority

High

## Estimated Time

6-7 days

## Labels

- backend
- assignment-system
- high-priority
