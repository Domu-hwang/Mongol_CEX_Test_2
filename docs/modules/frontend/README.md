# Modules Overview

## Purpose

This directory contains the **complete module documentation** for the CEX Pilot platform. Each module is documented in its own file with detailed specifications, responsibilities, and implementation guidelines.

---

## Directory Structure

```
modules/
├── README.md                    # This file - common rules and overview
├── ARCHITECTURE.md              # System architecture and data flow
│
├── frontend/                    # Frontend modules
│   ├── README.md                # Frontend common patterns
│   ├── auth.md                  # Authentication module
│   ├── trade.md                 # Trading module
│   ├── wallet.md                # Wallet module
│   ├── account.md               # Account module
│   ├── admin.md                 # Admin module
│   ├── landing.md               # Landing pages
│   └── shared.md                # Shared components
│
├── backend/                     # Backend services
│   ├── README.md                # Backend common patterns
│   ├── auth.md                  # Auth service
│   ├── trading.md               # Trading service
│   ├── wallet.md                # Wallet service
│   ├── admin.md                 # Admin service
│   └── logging.md               # Logging service
│
├── database/                    # Database design
│   ├── README.md                # Database principles
│   └── schema.sql               # Complete schema
│
└── infrastructure/              # Infrastructure setup
    ├── deployment.md            # Deployment guide
    ├── monitoring.md            # Monitoring setup
    └── security.md              # Security configuration
```

---

## Common Rules for All Modules

### 1. Module Responsibilities

Each module must have:
- **Clear boundary**: Single responsibility principle
- **Well-defined interface**: Explicit inputs/outputs
- **Minimal dependencies**: Loose coupling with other modules
- **Self-contained**: Can be developed and tested independently

### 2. Documentation Standard

Every module document must include:

```markdown
# Module Name

## 1. Overview
- Purpose
- Scope
- Key features

## 2. Responsibilities
- What this module does
- What this module does NOT do

## 3. Structure
- Directory/file organization
- Component/service hierarchy

## 4. API/Interface
- Public methods/components
- Props/parameters
- Return values/events

## 5. Dependencies
- External dependencies
- Internal module dependencies

## 6. Data Models
- TypeScript interfaces
- Database schemas (if applicable)

## 7. Implementation Examples
- Code snippets
- Usage patterns

## 8. Testing
- Test strategy
- Key test cases

## 9. Future Enhancements
- Planned features beyond Pilot scope
```

### 3. Naming Conventions

**Files:**
- Lowercase with hyphens: `user-profile.component.tsx`
- Module docs: lowercase with `.md`: `auth.md`

**Components (Frontend):**
- PascalCase: `OrderForm`, `BalanceCard`
- Prefixes for types: `use` for hooks, `with` for HOCs

**Services (Backend):**
- PascalCase classes: `AuthService`, `OrderService`
- camelCase methods: `createOrder()`, `getUserById()`

**Database:**
- Lowercase with underscores: `users`, `order_history`
- Plural for tables: `orders` not `order`

### 4. Code Organization

**Frontend Module Structure:**
```
src/features/{module}/
├── components/          # React components
├── hooks/              # Custom hooks
├── services/           # API calls
├── types/              # TypeScript types
├── utils/              # Helper functions
└── index.ts            # Public exports
```

**Backend Module Structure:**
```
src/modules/{module}/
├── controllers/        # HTTP handlers
├── services/           # Business logic
├── models/            # Database models
├── middleware/        # Module-specific middleware
├── routes/            # Route definitions
└── types/             # TypeScript types
```

### 5. Dependency Rules

**Allowed Dependencies:**
```
Frontend:
features/auth → core/api ✓
features/trade → features/auth (via hooks) ✓
features/admin → features/trade ✗ (violation)

Backend:
modules/trading → modules/wallet ✓
modules/wallet → modules/trading ✗ (circular dependency)
```

**Principle:** Higher-level modules can depend on lower-level, but not vice versa.

### 6. Testing Requirements

**Frontend:**
- Component tests for all UI components
- Hook tests for custom hooks
- Integration tests for critical user flows

**Backend:**
- Unit tests for all services
- Integration tests for API endpoints
- E2E tests for critical workflows

**Minimum Coverage:**
- Unit tests: 80%
- Integration tests: Critical paths only (for Pilot)

### 7. Error Handling

**Frontend:**
```typescript
// All API calls must handle errors
try {
  const result = await apiCall();
  return result;
} catch (error) {
  if (error instanceof ApiError) {
    showToast(error.message);
  } else {
    showToast('An unexpected error occurred');
  }
  throw error;
}
```

**Backend:**
```typescript
// All endpoints must have error middleware
app.use((err, req, res, next) => {
  logger.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});
```

### 8. Logging Requirements

**Critical Events to Log:**
- Authentication (login, logout, failed attempts)
- Trading (orders created, filled, cancelled)
- Wallet (deposits, withdrawals, approvals)
- Admin actions (user management, settings changes)
- Errors (all errors with context)

**Log Format:**
```typescript
{
  timestamp: '2025-01-20T10:30:00Z',
  level: 'info' | 'warning' | 'error',
  event: 'user_login',
  userId: 'uuid',
  metadata: { /* context */ },
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
}
```

### 9. Security Requirements

**All Modules Must:**
- Validate all inputs (use Zod or similar)
- Sanitize outputs (prevent XSS)
- Use parameterized queries (prevent SQL injection)
- Implement rate limiting on public endpoints
- Log security-relevant events

**Authentication Required:**
- All `/api/*` endpoints except `/api/auth/login` and `/api/auth/register`
- WebSocket connections
- Admin endpoints require `role === 'admin'`

### 10. Performance Guidelines

**Frontend:**
- Lazy load routes and heavy components
- Memoize expensive calculations
- Debounce user inputs
- Optimize re-renders (React.memo, useMemo, useCallback)
- Bundle size < 500KB (initial load)

**Backend:**
- Database queries < 100ms (p95)
- API responses < 500ms (p95)
- Use indexes for all queries
- Cache frequently accessed data (Redis)
- Implement pagination for lists

### 11. Mobile-First Requirements

All frontend modules must:
- Design for 375px width first
- Touch targets ≥ 44×44px
- No horizontal scrolling
- Responsive breakpoints:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px

### 12. Internationalization (Future)

While Pilot is English-only, prepare for future i18n:
- Use string constants (no hardcoded text)
- Store strings in `/locales/en.json`
- Use library like `react-i18next` or `next-intl`

---

## Module Communication Patterns

### Frontend → Backend

**HTTP (REST):**
```typescript
// services/orderService.ts
export async function createOrder(data: CreateOrderRequest): Promise<Order> {
  const response = await apiClient.post('/api/orders', data);
  return response.data;
}
```

**WebSocket (Real-time):**
```typescript
// Subscribe to price updates
wsClient.subscribe('market.price.BTC-USDT', (data) => {
  setPrice(data.price);
});
```

### Backend → Database

**Query Pattern:**
```typescript
// Always use parameterized queries
const result = await db.query(
  'SELECT * FROM users WHERE id = $1',
  [userId]
);
```

### Module → Module (Frontend)

**Via Context/Hooks:**
```typescript
// features/trade/hooks/useOrders.ts
export function useOrders() {
  const { user } = useAuth(); // Dependency on auth module
  return useQuery(['orders', user?.id], fetchOrders);
}
```

### Module → Module (Backend)

**Via Service Injection:**
```typescript
// trading.service.ts
class TradingService {
  constructor(
    private balanceService: BalanceService,
    private loggingService: LoggingService
  ) {}
  
  async createOrder(data: CreateOrderDto) {
    await this.balanceService.lockBalance(/*...*/);
    await this.loggingService.log(/*...*/);
  }
}
```

---

## Development Workflow

### 1. Before Starting a Module

- [ ] Read this README
- [ ] Read the module-specific documentation
- [ ] Review related modules' interfaces
- [ ] Check `cex-pilot-skill.md` for implementation patterns

### 2. During Development

- [ ] Follow the structure defined in module docs
- [ ] Write tests alongside code
- [ ] Log all critical events
- [ ] Handle all error cases
- [ ] Document public APIs

### 3. Before Merging

- [ ] All tests pass
- [ ] Code follows naming conventions
- [ ] No console.log statements
- [ ] Error handling in place
- [ ] Module doc updated (if changed)

---

## Cross-Cutting Concerns

### Authentication
- Handled by: `frontend/auth.md` + `backend/auth.md`
- Used by: All modules requiring user identity

### Logging
- Handled by: `backend/logging.md`
- Used by: All backend modules

### Error Handling
- Frontend: Shared ErrorBoundary component
- Backend: Global error middleware

### State Management
- Frontend: React Context + React Query
- Backend: PostgreSQL (source of truth)

### Real-time Updates
- WebSocket for price updates
- HTTP polling fallback (5s interval)

---

## Quick Reference

### Frontend Module Checklist
```
- [ ] Components in /components
- [ ] Hooks in /hooks
- [ ] API calls in /services
- [ ] Types in /types
- [ ] Public exports in index.ts
- [ ] Tests in __tests__
- [ ] Mobile-first styling
- [ ] Error boundaries
- [ ] Loading states
- [ ] Empty states
```

### Backend Module Checklist
```
- [ ] Controllers in /controllers
- [ ] Services in /services
- [ ] Models in /models
- [ ] Routes in /routes
- [ ] Input validation (Zod)
- [ ] Error handling
- [ ] Logging critical events
- [ ] Rate limiting
- [ ] Authentication
- [ ] Tests
```

---

## Related Documents

- `../cex-pilot-context.md` - Project scope and constraints
- `../cex-pilot-skill.md` - Implementation patterns
- `../core_prd.md` - Feature requirements
- `ARCHITECTURE.md` - System architecture
- Individual module docs in `frontend/` and `backend/`

---

## Questions or Issues?

When documentation is unclear:
1. Check the specific module doc
2. Review `cex-pilot-skill.md` for patterns
3. Look at similar existing modules
4. Update documentation with clarifications

---

**This README serves as the constitution for all module development in CEX Pilot.**
