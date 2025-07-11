# Migration from Sequelize to Drizzle ORM

This document outlines the migration from Sequelize to Drizzle ORM for the backend service.

## Changes Made

### 1. Dependencies Updated

**Removed:**

- `sequelize`: ^6.37.7

**Added:**

- `drizzle-orm`: ^0.35.0
- `postgres`: ^3.4.4
- `drizzle-kit`: ^0.25.0 (dev dependency)

### 2. Database Schema

**New Files:**

- `src/db/schema.ts` - Complete Drizzle schema definition
- `src/db/utils.ts` - Database utility functions
- `src/db/migrate.ts` - Migration runner
- `drizzle.config.ts` - Drizzle configuration

**Schema Features:**

- Type-safe table definitions with TypeScript
- Proper foreign key relationships
- Indexes for performance
- Enums for constrained values
- JSONB support for flexible data
- Automatic timestamps

### 3. Database Connection

**Updated:**

- `src/db/db.ts` - Now uses Drizzle with postgres-js
- Connection pooling and SSL support
- Type-safe query builder

### 4. Models

**Removed:**

- All Sequelize model files in `src/models/`
- Sequelize associations

**New:**

- Drizzle schema with relations
- Type-safe CRUD operations
- Utility functions for common operations

## Database Schema

### Tables

1. **Users** - User accounts and authentication
2. **Classes** - Classroom management
3. **Assignments** - Course assignments
4. **ClassEnrollments** - Student/teacher enrollments
5. **Submissions** - Assignment submissions

### Key Features

- **UUID Primary Keys** - All tables use UUIDs
- **Timestamps** - Automatic created_at/updated_at
- **Soft Deletes** - Status-based archiving
- **JSONB Fields** - Flexible settings and metadata
- **Proper Indexes** - Performance optimization
- **Foreign Key Constraints** - Data integrity

## Usage Examples

### Creating a User

```typescript
import { createUser } from "@backend-db/utils.js";

const user = await createUser({
  email: "user@example.com",
  username: "username",
  password: "password123",
  fullName: "John Doe",
  role: "student"
});
```

### Finding Users

```typescript
import { findUserByEmail, findUserById } from "@backend-db/utils.js";

const user = await findUserByEmail("user@example.com");
const userById = await findUserById("user-id");
```

### Complex Queries

```typescript
import { db } from "@backend-db/db.js";
import { classes, users } from "@backend-db/schema.js";
import { and, eq, or } from "drizzle-orm";

// Find classes owned by a user
const userClasses = await db.select()
  .from(classes)
  .where(eq(classes.ownerId, userId));

// Search users
const searchResults = await db.select()
  .from(users)
  .where(or(
    sql`${users.fullName} ILIKE ${`%${searchTerm}%`}`,
    sql`${users.email} ILIKE ${`%${searchTerm}%`}`
  ));
```

## Migration Commands

### Generate Migrations

```bash
pnpm db:generate
```

### Run Migrations

```bash
pnpm db:migrate
```

### Push Schema Changes (Development)

```bash
pnpm db:push
```

### Open Drizzle Studio

```bash
pnpm db:studio
```

## Type Safety

All database operations are now fully type-safe:

```typescript
import type { NewUser, User } from "@backend-db/schema.js";

// Type-safe insert
const newUser: NewUser = {
  email: "user@example.com",
  username: "username",
  password: "hashedPassword",
  fullName: "John Doe"
};

// Type-safe select
const user: User = await findUserByEmail("user@example.com");
```

## Performance Benefits

1. **Smaller Bundle Size** - Drizzle is more lightweight than Sequelize
2. **Better Type Safety** - Compile-time query validation
3. **Faster Queries** - Optimized SQL generation
4. **Memory Efficient** - No model instantiation overhead

## Migration Steps

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Generate Initial Migration**

   ```bash
   pnpm db:generate
   ```

3. **Run Migrations**

   ```bash
   pnpm db:migrate
   ```

4. **Update Controllers**
   - Replace Sequelize model usage with Drizzle utilities
   - Update query syntax
   - Use type-safe operations

## Breaking Changes

### API Changes

- Model methods replaced with utility functions
- Query syntax changed from Sequelize to Drizzle
- Association methods replaced with relation queries

### Code Updates Required

1. **Controllers** - Update all database operations
2. **Services** - Replace model methods with utilities
3. **Tests** - Update test data and assertions

## Benefits of Drizzle

1. **Type Safety** - Full TypeScript support
2. **Performance** - Faster queries and smaller bundle
3. **Developer Experience** - Better IntelliSense and error messages
4. **Modern** - Built for modern TypeScript applications
5. **Flexible** - Raw SQL when needed, type-safe queries by default

## Next Steps

1. Update all controllers to use new database utilities
2. Update tests to use new schema
3. Add more utility functions as needed
4. Set up proper migration strategy for production
5. Add database seeding for development
