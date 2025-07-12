# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## File name conventions

Always use kebab-case for file names.

## Development Commands

### Backend (packages/backend)

- `pnpm --filter @classroom/backend dev` - Start development server with hot reload
- `pnpm --filter @classroom/backend build` - Build TypeScript to JavaScript
- `pnpm --filter @classroom/backend typecheck` - Run TypeScript type checking
- `pnpm --filter @classroom/backend test` - Run tests with Vitest
- `pnpm --filter @classroom/backend test:watch` - Run tests in watch mode
- `pnpm --filter @classroom/backend test:coverage` - Run tests with coverage
- `pnpm --filter @classroom/backend lint` - Run ESLint
- `pnpm --filter @classroom/backend lint:fix` - Run ESLint with fix
- `pnpm --filter @classroom/backend check` - Run both typecheck and lint

### Mobile (packages/mobile)

- `pnpm --filter @classroom/mobile start` - Start Expo development server
- `pnpm --filter @classroom/mobile android` - Run on Android emulator
- `pnpm --filter @classroom/mobile ios` - Run on iOS simulator
- `pnpm --filter @classroom/mobile web` - Run on web browser
- `pnpm --filter @classroom/mobile test` - Run Jest tests
- `pnpm --filter @classroom/mobile lint` - Run ESLint
- `pnpm --filter @classroom/mobile lint:fix` - Run ESLint with fix

### All

- `pnpm check` - Run both typecheck and lint for all packages
- `pnpm typecheck` - Run TypeScript type checking for all packages
- `pnpm lint` - Run ESLint for all packages
- `pnpm lint:fix` - Run ESLint with fix for all packages

### Database

- `docker compose up -d` - Start PostgreSQL databases (dev: 5432, test: 5433)
- Database credentials: postgres/postgres
- Development DB: classroom, Test DB: classroom_test

#### Drizzle ORM Commands

- `pnpm --filter @classroom/backend db:generate` - Generate migration files from schema changes
- `pnpm --filter @classroom/backend db:migrate` - Run pending migrations
- `pnpm --filter @classroom/backend db:push` - Push schema changes directly to database (development)
- `pnpm --filter @classroom/backend db:push:force` - Force push schema changes (used in tests)
- `pnpm --filter @classroom/backend db:studio` - Open Drizzle Studio for database management
- `pnpm --filter @classroom/backend db:drop` - Drop and recreate test database
- `pnpm --filter @classroom/backend db:drop:force` - Force drop and recreate test database

## Architecture Overview

This is a monorepo classroom management system with separate backend and mobile packages:

### Backend Architecture

- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based auth with configurable expiration
- **API Structure**: RESTful API at `/api/v1/` with modular routing
- **Configuration**: Uses `config` package with environment-specific JSON files
- **Testing**: Vitest with Supertest for integration tests

### Key Backend Components

- **Database Layer**: Drizzle ORM with type-safe schema definitions in `src/db/`
- **Schema**: Type-safe table definitions in `src/db/schema.ts`
- **Utilities**: Database utility functions in `src/db/utils.ts`
- **Controllers**: Business logic in `src/controllers/` (auth implemented)
- **Routes**: Express routes in `src/routes/` with CORS handling
- **Helpers**: Utilities for pagination, sorting, request/response handling
- **Config**: Environment configs in `src/config/` (development.json, test.json)
- **Tests**: Comprehensive test suite in `src/__tests__/`

### Database Schema

- **Users**: id (UUID), email, username, password, fullName, avatarUrl, role (admin/teacher/student), isActive, profile (JSONB)
- **Classes**: id (UUID), name, description, classCode, inviteCode, ownerId, status, settings (JSONB)
- **Assignments**: id (UUID), title, description, classId, createdBy, dueDate, points, status, assignmentType, attachments (JSONB)
- **ClassEnrollments**: id (UUID), userId, classId, role, status, joinedAt
- **Submissions**: id (UUID), assignmentId, studentId, content, attachments (JSONB), grade, feedback, status

### Mobile Architecture

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Server State**: TanStack Query v5 for server state management
- **UI State**: Jotai v2 for simple atomic state management
- **Styling**: NativeWind v4 (Tailwind CSS for React Native)
- **Testing**: Jest with Expo preset
- **Package**: mobile (not scoped)

### Mobile Structure

- Uses Expo Router for navigation
- Supports iOS, Android, and Web platforms
- TypeScript configuration for React Native
- Cross-platform development with shared codebase
- TanStack Query setup in `app/_layout.tsx` with QueryClient and QueryClientProvider
- Jotai Provider setup in `app/_layout.tsx` for atomic state management
- Demo API integration on home screen (`app/(tabs)/index.tsx`) fetching JSONPlaceholder posts
- Jotai state management demo in `components/jotai-demo.tsx` with interactive UI components
- Atomic state store in `store/atoms.ts` with various UI state atoms and derived computations

### Mobile Key Dependencies

- **@tanstack/react-query**: v5.83.0 - Server state management with caching
- **@tanstack/eslint-plugin-query**: v5.81.2 - ESLint rules for TanStack Query
- **jotai**: v2.12.5 - Atomic state management for UI state
- **nativewind**: v4.1.23 - Tailwind CSS for React Native styling
- **expo-router**: v5.1.3 - File-based routing system

## TypeScript Configuration

- Root tsconfig.json with strict mode enabled
- Backend uses path aliases: `@backend/*` maps to `src/*`
- Backend includes Vitest globals for test files
- mobile uses standard Expo TypeScript setup
- Module resolution: ESNext with bundler resolution
- All packages pass strict TypeScript checking

## Testing Strategy

### Backend Testing

- **Framework**: Vitest (migrated from Jest)
- **Database**: Uses test database on port 5433 (classroom_test)
- **Coverage**: Models, controllers, routes, helpers
- **Setup**: Automated database schema push and cleanup with Drizzle
- **Configuration**: Proper database connection lifecycle with client connect/disconnect
- **Commands**: Individual test files can be run separately for faster development

### mobile Testing

- **Framework**: Jest with Expo preset
- **React Native**: Uses react-test-renderer
- **Cross-platform**: Tests work for all platforms

## Development Notes

- Backend runs on port 3232 (configurable)
- Uses pnpm workspaces for package management
- JWT private key and token expiration configurable via config files
- CORS headers handled centrally in routes
- Database connection managed in `src/db/index.ts` with node-postgres client
- Expo development server provides hot reload for mobile development
- Both packages support TypeScript with strict type checking
- Cross-platform development with `cross-env` for Windows compatibility
- TanStack Query provides automatic caching, background updates, and error handling for API calls
- Jotai provides simple atomic state management for UI state without boilerplate
- Mobile app demonstrates modern React Native patterns with both server and UI state management
- Comprehensive test coverage for both individual atoms and integration scenarios

## Database Architecture with Drizzle ORM

### Schema Definition

- **Type-safe Schema**: Located in `src/db/schema.ts` with full TypeScript support
- **Enums**: PostgreSQL enums for user roles, class status, assignment types, etc.
- **Relations**: Defined using Drizzle's relations API for type-safe joins
- **Indexes**: Performance optimization with proper database indexes
- **JSONB Support**: Flexible data storage for settings, attachments, and metadata

### Database Utilities

- **CRUD Operations**: Pre-built utility functions in `src/db/utils.ts`
- **Type Safety**: All operations are fully type-safe with TypeScript inference
- **Transactions**: Support for database transactions when needed
- **Pagination**: Built-in pagination utilities for large datasets

### Migration Strategy

- **Development**: Use `db:push` for rapid development and schema changes
- **Production**: Use `db:generate` and `db:migrate` for controlled migrations
- **Testing**: Automated schema push with `db:push:force` for clean test environments

### Key Advantages

- **Performance**: Faster queries with optimized SQL generation
- **Type Safety**: Compile-time query validation and error detection
- **Developer Experience**: Better IntelliSense and autocomplete
- **Bundle Size**: Smaller bundle compared to traditional ORMs
- **Modern TypeScript**: Built specifically for modern TypeScript applications
