# Backend Modules

## Overview

This directory contains documentation for all **backend service modules** in the CEX Pilot platform.

---

## Module List

- **[auth.md](./auth.md)** - Authentication service (JWT, sessions)
- **[trading.md](./trading.md)** - Trading engine (orders, matching)
- **[wallet.md](./wallet.md)** - Wallet service (balances, deposits, withdrawals)
- **[admin.md](./admin.md)** - Admin service (dashboard, user management)
- **[logging.md](./logging.md)** - Logging service (audit trail)

---

## Common Backend Patterns

### 1. Service Class Structure

```typescript
// modules/{module}/services/{module}.service.ts
export class ModuleService {
  constructor(
    private db: DatabaseClient,
    private logger: LoggingService
  ) {}

  async create(data: CreateDto): Promise<Entity> {
    // 1. Validate input
    // 2. Business logic
    // 3. Database operation
    // 4. Log event
    // 5. Return result
  }

  async findById(id: string): Promise<Entity | null> {
    // Database query
  }

  async update(id: string, data: UpdateDto): Promise<Entity> {
    // Update logic
  }

  async delete(id: string): Promise<void> {
    // Delete logic
  }
}
```

### 2. Controller Pattern

```typescript
// modules/{module}/controllers/{module}.controller.ts
import { Request, Response, NextFunction } from 'express';

export class ModuleController {
  constructor(private service: ModuleService) {}

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1. Extract and validate input
      const data = createSchema.parse(req.body);
      
      // 2. Call service
      const result = await this.service.create(data);
      
      // 3. Return response
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  findById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await this.service.findById(id);
      
      if (!result) {
        return res.status(404).json({ error: 'Not found' });
      }
      
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
```

### 3. Route Definition

```typescript
// modules/{module}/routes/{module}.routes.ts
import { Router } from 'express';
import { ModuleController } from '../controllers/{module}.controller';
import { authenticateToken } from '@/shared/middleware/auth.middleware';
import { validateRequest } from '@/shared/middleware/validation.middleware';
import { createSchema, updateSchema } from '../schemas';

export function createModuleRoutes(controller: ModuleController): Router {
  const router = Router();

  // All routes require authentication
  router.use(authenticateToken);

  router.post(
    '/',
    validateRequest(createSchema),
    controller.create
  );

  router.get('/:id', controller.findById);

  router.put(
    '/:id',
    validateRequest(updateSchema),
    controller.update
  );

  router.delete('/:id', controller.delete);

  return router;
}
```

### 4. Database Model

```typescript
// modules/{module}/models/{module}.model.ts
import { Pool } from 'pg';

export class ModuleModel {
  constructor(private db: Pool) {}

  async create(data: CreateData): Promise<Entity> {
    const query = `
      INSERT INTO table_name (col1, col2, col3)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const values = [data.col1, data.col2, data.col3];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async findById(id: string): Promise<Entity | null> {
    const query = 'SELECT * FROM table_name WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async update(id: string, data: Partial<Entity>): Promise<Entity> {
    const query = `
      UPDATE table_name
      SET col1 = COALESCE($1, col1),
          col2 = COALESCE($2, col2),
          updated_at = NOW()
      WHERE id = $3
      RETURNING *
    `;
    const values = [data.col1, data.col2, id];
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM table_name WHERE id = $1', [id]);
  }
}
```

---

## Input Validation

### Zod Schemas

```typescript
// modules/{module}/schemas/index.ts
import { z } from 'zod';

export const createSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

export const updateSchema = createSchema.partial();

export type CreateDto = z.infer<typeof createSchema>;
export type UpdateDto = z.infer<typeof updateSchema>;
```

### Validation Middleware

```typescript
// shared/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}
```

---

## Error Handling

### Custom Error Classes

```typescript
// shared/errors/index.ts
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export class NotFoundError extends ApiError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Unauthorized') {
    super(401, message, 'UNAUTHORIZED');
  }
}

export class ValidationError extends ApiError {
  constructor(message: string) {
    super(400, message, 'VALIDATION_ERROR');
  }
}
```

### Global Error Handler

```typescript
// shared/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors';
import { logger } from '../utils/logger';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle known errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
    });
  }

  // Handle unknown errors
  res.status(500).json({
    error: 'Internal server error',
  });
}
```

---

## Database Patterns

### Transaction Management

```typescript
// Example: Order creation with balance update (atomic)
async createOrder(userId: string, data: CreateOrderDto): Promise<Order> {
  const client = await this.db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Lock balance
    await client.query(
      'UPDATE balances SET locked = locked + $1 WHERE user_id = $2 AND asset = $3',
      [data.totalCost, userId, data.quoteAsset]
    );
    
    // Create order
    const orderResult = await client.query(
      'INSERT INTO orders (...) VALUES (...) RETURNING *',
      [...]
    );
    
    await client.query('COMMIT');
    return orderResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}
```

### Connection Pooling

```typescript
// config/database.ts
import { Pool } from 'pg';

export const db = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20, // Maximum number of clients in pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await db.end();
  process.exit(0);
});
```

---

## Authentication & Authorization

### JWT Middleware

```typescript
// shared/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors';

interface JWTPayload {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Check blacklist (Redis)
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    if (isBlacklisted) {
      throw new UnauthorizedError('Token revoked');
    }

    // Verify token
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTPayload;

    req.user = payload;
    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid token'));
  }
}

export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.user?.role !== 'admin') {
    return next(new UnauthorizedError('Admin access required'));
  }
  next();
}
```

---

## Logging

### Winston Logger

```typescript
// shared/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    
    // File for production
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
    }),
  ],
});
```

### Logging Events

```typescript
// Log important business events
logger.info({
  event: 'user_login',
  userId: user.id,
  email: user.email,
  ip: req.ip,
});

logger.warn({
  event: 'failed_login_attempt',
  email: attemptedEmail,
  ip: req.ip,
});

logger.error({
  event: 'order_creation_failed',
  userId: user.id,
  error: error.message,
});
```

---

## Testing

### Unit Tests (Jest)

```typescript
// modules/{module}/services/__tests__/{module}.service.test.ts
import { ModuleService } from '../{module}.service';

describe('ModuleService', () => {
  let service: ModuleService;
  let mockDb: jest.Mocked<DatabaseClient>;

  beforeEach(() => {
    mockDb = {
      query: jest.fn(),
    } as any;
    
    service = new ModuleService(mockDb);
  });

  describe('create', () => {
    it('should create a new entity', async () => {
      const data = { name: 'Test', email: 'test@example.com' };
      const expected = { id: '123', ...data };
      
      mockDb.query.mockResolvedValue({ rows: [expected] });
      
      const result = await service.create(data);
      
      expect(result).toEqual(expected);
      expect(mockDb.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT'),
        expect.arrayContaining([data.name, data.email])
      );
    });
  });
});
```

### Integration Tests

```typescript
// modules/{module}/__tests__/integration.test.ts
import request from 'supertest';
import { app } from '../../../server';

describe('Module API Integration', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get token
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' });
    
    authToken = response.body.accessToken;
  });

  describe('POST /api/module', () => {
    it('should create a new entity', async () => {
      const response = await request(app)
        .post('/api/module')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test' });
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should return 401 without auth token', async () => {
      const response = await request(app)
        .post('/api/module')
        .send({ name: 'Test' });
      
      expect(response.status).toBe(401);
    });
  });
});
```

---

## Performance Optimization

### Caching with Redis

```typescript
// Example: Cache frequently accessed data
async getUserById(id: string): Promise<User> {
  // Check cache first
  const cached = await redis.get(`user:${id}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // Fetch from database
  const user = await this.db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );

  // Cache for 5 minutes
  await redis.setex(`user:${id}`, 300, JSON.stringify(user));

  return user;
}

// Invalidate cache on update
async updateUser(id: string, data: UpdateUserDto): Promise<User> {
  const user = await this.db.query(
    'UPDATE users SET ... WHERE id = $1 RETURNING *',
    [...]
  );

  // Invalidate cache
  await redis.del(`user:${id}`);

  return user;
}
```

### Database Indexing

```sql
-- Always index foreign keys
CREATE INDEX idx_orders_user_id ON orders(user_id);

-- Composite indexes for common queries
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Partial indexes for frequently filtered data
CREATE INDEX idx_orders_pending ON orders(status) WHERE status = 'pending';
```

---

## Module Checklist

Before considering a backend module complete:

- [ ] Service class with business logic
- [ ] Controller with route handlers
- [ ] Database model/queries
- [ ] Input validation schemas (Zod)
- [ ] TypeScript types defined
- [ ] Authentication middleware applied
- [ ] Error handling implemented
- [ ] Logging for critical events
- [ ] Unit tests (minimum 80% coverage)
- [ ] Integration tests for main flows
- [ ] API documentation (endpoints, schemas)

---

## Related Documents

- `../README.md` - Module common rules
- `../ARCHITECTURE.md` - System architecture
- Individual module docs: `auth.md`, `trading.md`, etc.
- `../database/schema.sql` - Database schema
