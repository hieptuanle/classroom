# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (packages/backend)
- `pnpm --filter @classroom/backend dev` - Start development server with hot reload
- `pnpm --filter @classroom/backend build` - Build TypeScript to JavaScript
- `pnpm --filter @classroom/backend typecheck` - Run TypeScript type checking
- `pnpm --filter @classroom/backend test` - Run tests with Vitest
- `pnpm --filter @classroom/backend test:watch` - Run tests in watch mode
- `pnpm --filter @classroom/backend test:coverage` - Run tests with coverage

### Frontend (packages/frontend)  
- `pnpm --filter frontend start` - Start Expo development server
- `pnpm --filter frontend android` - Run on Android emulator
- `pnpm --filter frontend ios` - Run on iOS simulator
- `pnpm --filter frontend web` - Run on web browser
- `pnpm --filter frontend test` - Run Jest tests

### Database
- `docker compose up -d` - Start PostgreSQL databases (dev: 5432, test: 5433)
- Database credentials: postgres/postgres
- Development DB: classroom, Test DB: classroom_test

## Architecture Overview

This is a monorepo classroom management system with separate backend and frontend packages:

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based auth with configurable expiration
- **API Structure**: RESTful API at `/api/v1/` with modular routing
- **Configuration**: Uses `config` package with environment-specific JSON files
- **Testing**: Vitest with Supertest for integration tests

### Key Backend Components
- **Models**: Sequelize models (User, Class, Post) in `src/models/`
- **Controllers**: Business logic in `src/controllers/` (auth implemented)
- **Routes**: Express routes in `src/routes/` with CORS handling
- **Helpers**: Utilities for pagination, sorting, request/response handling
- **Config**: Environment configs in `src/config/` (development.json, test.json)
- **Tests**: Comprehensive test suite in `src/__tests__/`

### Database Schema
- **Users**: username, password, full_name, avatar, role (admin/teacher/student)
- **Classes**: (model exists but not fully implemented)
- **Posts**: (model exists but not fully implemented)

### Frontend Architecture
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Testing**: Jest with Expo preset
- **Package**: frontend (not scoped)

### Frontend Structure
- Uses Expo Router for navigation
- Supports iOS, Android, and Web platforms
- TypeScript configuration for React Native
- Cross-platform development with shared codebase

## TypeScript Configuration
- Root tsconfig.json with strict mode enabled
- Backend uses path aliases: `@backend/*` maps to `src/*`
- Backend includes Vitest globals for test files
- Frontend uses standard Expo TypeScript setup
- Module resolution: ESNext with bundler resolution
- All packages pass strict TypeScript checking

## Testing Strategy
### Backend Testing
- **Framework**: Vitest (migrated from Jest)
- **Database**: Uses test database on port 5433 (classroom_test)
- **Coverage**: Models, controllers, routes, helpers
- **Setup**: Automated database sync and cleanup
- **Configuration**: Sequential test execution to avoid enum conflicts
- **Commands**: Individual test files can be run separately for faster development

### Frontend Testing
- **Framework**: Jest with Expo preset
- **React Native**: Uses react-test-renderer
- **Cross-platform**: Tests work for all platforms

## Development Notes
- Backend runs on port 3232 (configurable)
- Uses pnpm workspaces for package management
- JWT private key and token expiration configurable via config files
- CORS headers handled centrally in routes
- Database connection managed in `src/db/db.ts`
- Expo development server provides hot reload for mobile development
- Both packages support TypeScript with strict type checking