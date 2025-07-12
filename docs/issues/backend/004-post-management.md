# Issue #4: Implement Post and Announcement Management

## Description

Implement comprehensive post management system for announcements, including rich content support, draft functionality, scheduling, and comment system.

## Requirements

- Create, read, update, delete posts/announcements
- Rich content support (text formatting, attachments, links, images, videos)
- Draft and scheduled post functionality
- Comment system for posts
- Post filtering by type, class, assignment status
- File upload and management

## Acceptance Criteria

- [ ] `POST /api/v1/posts` - Create new post/announcement
- [ ] `GET /api/v1/posts` - List posts with filters
- [ ] `GET /api/v1/posts/:id` - Get post details
- [ ] `PUT /api/v1/posts/:id` - Update post
- [ ] `DELETE /api/v1/posts/:id` - Delete post
- [ ] `POST /api/v1/posts/:id/comments` - Add comment to post
- [ ] `GET /api/v1/posts/:id/comments` - Get post comments
- [ ] File upload support for images, videos, PDFs
- [ ] Draft and scheduled post functionality
- [ ] Rich text content support
- [ ] Post filtering and search
- [ ] Comprehensive test coverage

## Implementation Plan

1. **Post Model**: Create comprehensive post model
2. **Comment Model**: Create comment model for post discussions
3. **File Upload**: Setup file upload system with validation
4. **Post Controller**: Implement CRUD operations
5. **Comment Controller**: Implement comment system
6. **Rich Content**: Support for rich text and attachments
7. **Draft System**: Handle draft and scheduled posts
8. **Filtering**: Implement post filtering and search
9. **Permissions**: Role-based access control
10. **Testing**: Write comprehensive tests
11. **Documentation**: Update API docs

## API Specifications

### POST /api/v1/posts

```json
// Request
{
  "title": "string",
  "content": "string",
  "type": "announcement" | "exercise" | "test" | "question" | "document",
  "classId": "ID",
  "assignedUserIds": ["ID"],
  "attachments": [],
  "draft": false,
  "scheduledAt": "datetime"
}

// Response
{
  "code": 200,
  "message": "Post created successfully",
  "data": {
    "post": {
      "id": "ID",
      "title": "string",
      "content": "string",
      "type": "string",
      "classId": "ID",
      "authorId": "ID",
      "assignedUserIds": [],
      "attachments": [],
      "draft": false,
      "scheduledAt": "datetime",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

### GET /api/v1/posts

```json
// Query params: ?classId=ID&type=exercise&draft=true&done=false&assignedToMe=true

// Response
{
  "code": 200,
  "message": "Posts retrieved successfully",
  "data": {
    "posts": [
      {
        "id": "ID",
        "title": "string",
        "content": "string",
        "type": "string",
        "classId": "ID",
        "author": {
          "id": "ID",
          "firstName": "string",
          "lastName": "string",
          "avatar": "string"
        },
        "attachments": [],
        "commentCount": 0,
        "draft": false,
        "scheduledAt": "datetime",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "totalPages": 5
    }
  }
}
```

### POST /api/v1/posts/:id/comments

```json
// Request
{
  "content": "string",
  "isPrivate": false
}

// Response
{
  "code": 200,
  "message": "Comment added successfully",
  "data": {
    "comment": {
      "id": "ID",
      "postId": "ID",
      "authorId": "ID",
      "content": "string",
      "isPrivate": false,
      "createdAt": "datetime",
      "updatedAt": "datetime"
    }
  }
}
```

## Dependencies

- Issue #1: Authentication System
- Issue #3: Class Management System

## Priority

High

## Estimated Time

5-6 days

## Labels

- backend
- post-management
- high-priority
