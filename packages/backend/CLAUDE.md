## Logging

This backend uses Winston for structured logging. The logger is configured in `src/libs/logger.ts`.

### Log Levels

- `error`: Error conditions
- `warn`: Warning conditions
- `info`: Informational messages
- `http`: HTTP requests (via Morgan)
- `debug`: Debug information (development only)

### Usage

```typescript
import logger from "@backend/libs/logger";

logger.info("User logged in", { userId: 123 });
logger.error("Database connection failed", error);
logger.warn("Deprecated API endpoint used");
logger.debug("Processing request data", { data });
```

### Log Files

- `logs/combined.log`: All log entries in JSON format
- `logs/error.log`: Error level logs only
- Console output: Colorized logs in development

### Configuration

- Development: Debug level, console + file output
- Production: Info level, file output only
- Test: Silent mode (no output)

## Linting

```
pnpm lint
```

```
pnpm lint:fix
```

## Typechecking

```
pnpm typecheck
```
