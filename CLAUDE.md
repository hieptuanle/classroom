# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (packages/backend)
- `pnpm --filter @classroom/backend dev` - Start development server with hot reload
- `pnpm --filter @classroom/backend build` - Build TypeScript to JavaScript
- `pnpm --filter @classroom/backend typecheck` - Run TypeScript type checking

### Frontend (packages/frontend)  
- `pnpm --filter @classroom/frontend dev` - Start Vite development server

### Database
- `docker compose up -d` - Start PostgreSQL database (runs on port 5432)
- Database credentials: postgres/postgres, database: classroom

## Architecture Overview

This is a monorepo classroom management system with separate backend and frontend packages:

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT-based auth with configurable expiration
- **API Structure**: RESTful API at `/api/v1/` with modular routing
- **Configuration**: Uses `config` package with environment-specific JSON files

### Key Backend Components
- **Models**: Sequelize models (User, Class, Post) in `src/models/`
- **Controllers**: Business logic in `src/controllers/` (auth implemented)
- **Routes**: Express routes in `src/routes/` with CORS handling
- **Helpers**: Utilities for pagination, sorting, request/response handling
- **Config**: Environment configs in `src/config/` (development.json, test.json)

### Database Schema
- **Users**: username, password, full_name, avatar, role (admin/teacher/student)
- **Classes**: (model exists but not fully implemented)
- **Posts**: (model exists but not fully implemented)

### Frontend Architecture
- **Framework**: Vite-based (minimal setup currently)
- **Package**: @classroom/frontend

## TypeScript Configuration
- Root tsconfig.json with strict mode enabled
- Backend uses path aliases: `@backend/*` maps to `src/*`
- Module resolution: ESNext with bundler resolution

## Development Notes
- Backend runs on port 3232 (configurable)
- Uses pnpm workspaces for package management
- JWT private key and token expiration configurable via config files
- CORS headers handled centrally in routes
- Database connection managed in `src/db/db.ts`