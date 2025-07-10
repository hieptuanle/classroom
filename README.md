# Classroom Management System

A modern classroom management system built with Express.js backend and Expo React Native frontend.

## Project Structure

This is a monorepo containing:

- **Backend**: Express.js API with TypeScript, PostgreSQL, and Sequelize ORM
- **Frontend**: Expo React Native app with TypeScript and Expo Router

## Prerequisites

Before getting started, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **pnpm** (package manager)
- **Docker** (for PostgreSQL database)
- **Expo CLI** (for React Native development)

### Installation Commands

```bash
# Install Node.js (if using nvm)
nvm install 18
nvm use 18

# Install pnpm
npm install -g pnpm

# Install Docker Desktop
# Download from: https://docs.docker.com/desktop/

# Install Expo CLI
npm install -g @expo/cli
```

## Getting Started

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone <repository-url>
cd classroom

# Install all dependencies for both backend and frontend
pnpm install
```

### 2. Database Setup

Start the PostgreSQL databases using Docker:

```bash
# Start both development and test databases
docker compose up -d

# This will create:
# - Development DB: localhost:5432/classroom
# - Test DB: localhost:5433/classroom_test
```

### 3. Backend Development

```bash
# Start backend development server
pnpm --filter @classroom/backend dev

# The API will be available at http://localhost:3232
```

#### Backend Commands

```bash
# Development
pnpm --filter @classroom/backend dev

# Build
pnpm --filter @classroom/backend build

# Type checking (passes with 0 errors)
pnpm --filter @classroom/backend typecheck

# Testing
pnpm --filter @classroom/backend test
pnpm --filter @classroom/backend test:watch
pnpm --filter @classroom/backend test:coverage
```

### 4. Frontend Development

```bash
# Start Expo development server
pnpm --filter frontend start

# Or run specific platforms
pnpm --filter frontend android  # Android emulator
pnpm --filter frontend ios      # iOS simulator
pnpm --filter frontend web      # Web browser
```

#### Frontend Commands

```bash
# Start development server
pnpm --filter frontend start

# Platform-specific development
pnpm --filter frontend android
pnpm --filter frontend ios
pnpm --filter frontend web

# Testing
pnpm --filter frontend test
```

## Development Workflow

### Backend Development

1. **API Development**: The backend runs on port 3232 with hot reload
2. **Database**: Uses PostgreSQL with Sequelize ORM
3. **Testing**: Comprehensive test suite with Vitest
4. **Authentication**: JWT-based authentication system

### Frontend Development

1. **Expo Router**: File-based routing system
2. **Cross-platform**: Runs on iOS, Android, and Web
3. **TypeScript**: Full TypeScript support
4. **Testing**: Jest with Expo preset

### Database Management

```bash
# View database logs
docker compose logs postgres

# Access database directly
docker exec -it classroom-postgres-1 psql -U postgres -d classroom

# Reset database (development)
docker compose down
docker volume rm classroom_postgres_data
docker compose up -d
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/` - Auth status check

### Base Routes
- `GET /api/v1/` - API health check

## Tech Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT
- **Testing**: Vitest with Supertest
- **Development**: tsx for hot reload

### Frontend
- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Testing**: Jest with Expo preset
- **Icons**: Expo Vector Icons

## Environment Configuration

### Backend Configuration

The backend uses the `config` package with environment-specific files:

- `packages/backend/src/config/development.json` - Development settings
- `packages/backend/src/config/test.json` - Test settings

### Frontend Configuration

Expo configuration is managed through `app.json` or `expo.json` in the frontend package.

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   ```bash
   # Ensure Docker is running
   docker compose ps
   
   # Restart database
   docker compose restart postgres
   ```

2. **Port Conflicts**
   - Backend: Check if port 3232 is available
   - Database: Check if ports 5432/5433 are available

3. **Expo Issues**
   ```bash
   # Clear Expo cache
   npx expo start --clear
   
   # Reset Metro bundler
   npx expo start --reset-cache
   ```

4. **Dependencies Issues**
   ```bash
   # Clean install
   rm -rf node_modules packages/*/node_modules
   pnpm install
   ```

## Testing

### Backend Testing

```bash
# Run all tests
pnpm --filter @classroom/backend test

# Run specific test file (recommended for development)
pnpm --filter @classroom/backend test src/__tests__/auth.test.ts
pnpm --filter @classroom/backend test src/__tests__/routes.test.ts
pnpm --filter @classroom/backend test src/__tests__/db.test.ts
pnpm --filter @classroom/backend test src/__tests__/helpers.test.ts

# Watch mode
pnpm --filter @classroom/backend test:watch

# Coverage report
pnpm --filter @classroom/backend test:coverage
```

**Note**: Tests are configured to run sequentially to avoid database enum conflicts. Individual test files can be run separately for faster development cycles.

### Frontend Testing

```bash
# Run tests
pnpm --filter frontend test
```

## Deployment

### Backend Deployment

1. Build the application:
   ```bash
   pnpm --filter @classroom/backend build
   ```

2. Set up production database and environment variables

3. Deploy the built application

### Frontend Deployment

1. **Expo Application Services (EAS)**:
   ```bash
   npx eas build --platform all
   ```

2. **Web Deployment**:
   ```bash
   pnpm --filter frontend web
   # Deploy the web-build folder
   ```

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run tests to ensure everything works
4. Create a pull request

## License

[Add your license information here]