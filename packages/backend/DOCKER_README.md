# Docker Setup for Node.js Express Backend

This directory contains Docker configuration for the Node.js Express backend API service.

## Files

- `Dockerfile` - Multi-stage Dockerfile for development, production, and testing
- `.dockerignore` - Excludes unnecessary files from Docker build context
- `docker-compose.yml` - Docker Compose configuration with PostgreSQL database

## Quick Start

### Development Environment

To run the backend in development mode with PostgreSQL:

```bash
# Using Docker Compose (recommended)
docker-compose up backend-dev

# Or using Docker directly
docker build --target development -t backend-dev .
docker run -p 3232:3232 -v $(pwd):/app backend-dev
```

The development server will be available at `http://localhost:3232`

### Production Environment

```bash
# Using Docker Compose
docker-compose up backend-prod

# Or using Docker directly
docker build --target production -t backend-prod .
docker run -p 4000:4000 backend-prod
```

The production API will be available at `http://localhost:4000`

### Testing Environment

```bash
# Run tests
docker-compose up backend-test

# Or using Docker directly
docker build --target test -t backend-test .
docker run backend-test
```

## Database Setup

The docker-compose setup includes PostgreSQL databases for different environments:

- **Development**: `postgres-dev` on port 5432
- **Production**: `postgres-prod` on port 5433
- **Testing**: `postgres-test` on port 5434

### Database Connection

The backend will automatically connect to the PostgreSQL database. Make sure the database is running before starting the backend service.

## Build Stages

The Dockerfile includes multiple stages:

1. **base** - Common setup with Node.js and dependencies
2. **development** - Development environment with hot reloading using `tsx watch`
3. **build** - Compiles TypeScript to JavaScript
4. **production** - Optimized production build with minimal dependencies
5. **test** - Environment for running tests
6. **test-coverage** - Environment for running tests with coverage

## Environment Variables

You can customize the behavior by setting environment variables:

- `NODE_ENV` - Set to `development`, `production`, or `test`
- `PORT` - Server port (default: 3232 for dev, 4000 for prod)
- Database configuration is handled by the `config` package

## API Endpoints

The backend API is available at `/api/v1/` with the following structure:

- Authentication: `/api/v1/auth/`
- Routes: `/api/v1/` (main routes)

## Development Tips

1. **Hot Reloading**: The development container uses `tsx watch` for automatic reloading
2. **Database Migrations**: Run migrations manually or add them to the startup script
3. **Logs**: Use `docker-compose logs backend-dev` to view logs
4. **Debugging**: Attach to the running container with `docker-compose exec backend-dev sh`

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure PostgreSQL is running and accessible
2. **Port Conflicts**: Change port mappings in docker-compose.yml if needed
3. **Build Failures**: Check TypeScript compilation errors
4. **Permission Issues**: The production container runs as non-root user

### Debugging

To debug the container:

```bash
# Enter the development container
docker-compose exec backend-dev sh

# Check logs
docker-compose logs backend-dev

# Rebuild without cache
docker-compose build --no-cache backend-dev

# Run tests
docker-compose run backend-test
```

### Database Management

```bash
# Access PostgreSQL development database
docker-compose exec postgres-dev psql -U postgres -d classroom

# Reset development database
docker-compose down -v
docker-compose up postgres-dev
```

## Security Considerations

1. **Non-root User**: Production container runs as `nodejs` user
2. **Environment Variables**: Use `.env` files for sensitive data
3. **Database Passwords**: Change default passwords in production
4. **Network Isolation**: Services communicate through Docker networks

## Integration with Frontend

To connect the frontend to this backend:

1. Update frontend API endpoints to point to `http://localhost:3232/api/v1/` (dev)
2. For production, use the appropriate production URL
3. Ensure CORS is properly configured if needed

## Notes

- The backend uses TypeScript with `tsx` for development
- Production builds compile TypeScript to JavaScript
- Database migrations should be run manually or added to startup scripts
- The setup includes separate databases for development, testing, and production
