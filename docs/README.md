# Classroom Management System - Development Issues

This repository contains structured GitHub issues for developing a comprehensive classroom management system similar to Google Classroom. The system consists of a backend API and a mobile application.

## Project Overview

The classroom management system provides:

- **Teacher functionality**: Class creation, assignment management, grading, announcements
- **Student functionality**: Class enrollment, assignment submission, grade viewing
- **Cross-platform support**: React Native mobile app with Expo
- **Robust backend**: Express.js API with PostgreSQL database

## Technology Stack

### Backend

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based authentication
- **File Storage**: Multer for file uploads
- **Email**: SendGrid/Nodemailer for notifications
- **Testing**: Vitest with Supertest

### Mobile

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: TanStack Query + Jotai
- **Styling**: NativeWind (Tailwind for React Native)
- **Testing**: Jest with Expo preset

## Issue Structure

Issues are organized by platform and numbered sequentially. Each issue includes:

- Detailed requirements and acceptance criteria
- Implementation plan with step-by-step approach
- API specifications with request/response examples
- Component structures for mobile issues
- Dependencies on other issues
- Time estimates and priority levels

### Backend Issues

| Issue                                                     | Title                            | Priority | Estimated Time | Dependencies       |
| --------------------------------------------------------- | -------------------------------- | -------- | -------------- | ------------------ |
| [#001](./issues/backend/001-authentication-system.md)     | Authentication System            | High     | 3-4 days       | None               |
| [#002](./issues/backend/002-user-management.md)           | User Management                  | High     | 2-3 days       | #001               |
| [#003](./issues/backend/003-class-management.md)          | Class Management                 | High     | 4-5 days       | #001, #002         |
| [#004](./issues/backend/004-post-management.md)           | Post and Announcement Management | High     | 5-6 days       | #001, #003         |
| [#005](./issues/backend/005-assignment-system.md)         | Assignment and Submission System | High     | 6-7 days       | #003, #004         |
| [#006](./issues/backend/006-file-upload-system.md)        | File Upload and Media Management | Medium   | 3-4 days       | #001               |
| [#007](./issues/backend/007-email-notification-system.md) | Email Notification System        | Medium   | 3-4 days       | #003, #005         |
| [#008](./issues/backend/008-api-documentation.md)         | API Documentation                | Low      | 2-3 days       | All backend issues |

### Mobile Issues

| Issue                                                    | Title                            | Priority | Estimated Time | Dependencies                   |
| -------------------------------------------------------- | -------------------------------- | -------- | -------------- | ------------------------------ |
| [#007](./issues/mobile/007-authentication-navigation.md) | Authentication and Navigation    | High     | 4-5 days       | Backend #001, #002             |
| [#008](./issues/mobile/008-class-management.md)          | Class Management                 | High     | 5-6 days       | #007, Backend #003             |
| [#009](./issues/mobile/009-announcements-posts.md)       | Announcements and Posts          | High     | 6-7 days       | #008, Backend #004, #006       |
| [#010](./issues/mobile/010-assignments-submissions.md)   | Assignment and Submission System | High     | 7-8 days       | #008, #009, Backend #005, #006 |
| [#011](./issues/mobile/011-profile-settings.md)          | Profile and Settings             | Medium   | 4-5 days       | #007, Backend #002             |

## Development Roadmap

### Phase 1: Core Authentication and User Management (Week 1-2)

- Backend: Authentication System (#001)
- Backend: User Management (#002)
- Mobile: Authentication and Navigation (#007)

### Phase 2: Class and Content Management (Week 3-4)

- Backend: Class Management (#003)
- Backend: Post Management (#004)
- Mobile: Class Management (#008)

### Phase 3: Assignment System (Week 5-6)

- Backend: Assignment System (#005)
- Backend: File Upload System (#006)
- Mobile: Announcements and Posts (#009)

### Phase 4: Advanced Features (Week 7-8)

- Mobile: Assignment and Submission System (#010)
- Mobile: Profile and Settings (#011)
- Backend: Email Notification System (#007)

### Phase 5: Documentation and Polish (Week 9)

- Backend: API Documentation (#008)
- Testing and bug fixes
- Performance optimization

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd classroom
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Setup databases**

   ```bash
   docker compose up -d
   ```

4. **Start backend development**

   ```bash
   pnpm --filter @classroom/backend dev
   ```

5. **Start mobile development**
   ```bash
   pnpm --filter @classroom/mobile start
   ```

## Contributing Guidelines

When working on issues:

1. **Create feature branches** from main using the issue number:

   ```bash
   git checkout -b feature/001-authentication-system
   ```

2. **Follow the implementation plan** outlined in each issue

3. **Write comprehensive tests** for all new functionality

4. **Update documentation** as needed

5. **Create pull requests** with detailed descriptions and reference the issue number

6. **Ensure all tests pass** before merging:
   ```bash
   pnpm -r test
   pnpm -r typecheck
   pnpm -r lint
   ```

## Testing Strategy

### Backend Testing

- **Unit Tests**: Test individual functions and modules
- **Integration Tests**: Test API endpoints with database
- **Authentication Tests**: Verify JWT handling and permissions
- **File Upload Tests**: Test file validation and storage

### Mobile Testing

- **Component Tests**: Test UI components in isolation
- **Integration Tests**: Test component interactions
- **Navigation Tests**: Test route handling and navigation
- **State Management Tests**: Test Jotai atoms and TanStack Query

## API Documentation

Once backend issues are completed, comprehensive API documentation will be available at:

- Development: `http://localhost:3232/api-docs`
- Swagger JSON: `http://localhost:3232/api-docs.json`

## Database Schema

The system uses PostgreSQL with the following core models:

- **Users**: Authentication and profile information
- **Classes**: Class management and enrollment
- **Posts**: Announcements and assignments
- **Submissions**: Student assignment submissions
- **Comments**: Discussion threads on posts
- **Categories**: Assignment organization
- **Files**: Media and document storage

## Support and Questions

For questions about specific issues:

1. Check the issue description and implementation plan
2. Review dependencies and prerequisites
3. Consult the CLAUDE.md file for project-specific guidance
4. Create a discussion thread if clarification is needed

## License

This project is for educational purposes as part of the HUST Project 2 coursework.
