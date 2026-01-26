# System Architecture

## Overview

This document describes the **complete system architecture** for the CEX Pilot platform, including component interactions, data flows, and integration patterns.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Mobile Web   │  │ Desktop Web  │  │ Admin Panel  │      │
│  │  (React)     │  │   (React)    │  │   (React)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTPS / WebSocket
┌────────────────────────▼────────────────────────────────────┐
│                     API GATEWAY LAYER                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Nginx (Rate Limiting, Auth, Routing, SSL)          │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Auth      │  │   Trading   │  │   Wallet    │         │
│  │  Service    │  │   Service   │  │  Service    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   User      │  │   Admin     │  │  Logging    │         │
│  │  Service    │  │  Service    │  │  Service    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                      DATA LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  PostgreSQL  │  │    Redis     │  │  File Storage│      │
│  │  (Primary)   │  │   (Cache)    │  │   (Logs)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend
- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context + React Query
- **Routing**: React Router v6
- **WebSocket**: Socket.io Client
- **HTTP Client**: Axios
- **Validation**: Zod
- **Charts**: Recharts
- **QR Codes**: qrcode.react

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **WebSocket**: Socket.io
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Zod
- **Logging**: Winston

### Infrastructure
- **OS**: Ubuntu 24 LTS
- **Web Server**: Nginx
- **Container**: Docker (optional for Pilot)
- **CI/CD**: GitHub Actions (future)
- **Monitoring**: Basic health checks (Pilot)

---

## Module Architecture

### Frontend Modules

```
frontend/src/
├── features/                    # Feature modules (domain logic)
│   ├── auth/                    # Authentication
│   ├── trade/                   # Trading interface
│   ├── wallet/                  # Wallet management
│   ├── account/                 # User account settings
│   ├── admin/                   # Admin console
│   └── landing/                 # Public pages
│
├── shared/                      # Shared components
│   ├── components/              # Reusable UI
│   ├── hooks/                   # Common hooks
│   ├── utils/                   # Utilities
│   └── types/                   # Global types
│
├── core/                        # Core infrastructure
│   ├── api/                     # HTTP client
│   ├── auth/                    # Auth logic
│   ├── routing/                 # Route guards
│   └── websocket/               # WebSocket client
│
└── app/                         # App entry
    ├── App.tsx
    ├── Router.tsx
    └── Providers.tsx
```

### Backend Modules

```
backend/src/
├── modules/                     # Feature modules
│   ├── auth/                    # Authentication service
│   ├── user/                    # User management
│   ├── trading/                 # Trading engine
│   ├── wallet/                  # Wallet operations
│   ├── admin/                   # Admin operations
│   └── logging/                 # Logging service
│
├── shared/                      # Shared resources
│   ├── database/                # DB connection
│   ├── middleware/              # Express middleware
│   ├── utils/                   # Utilities
│   └── types/                   # Global types
│
├── config/                      # Configuration
│   ├── database.ts
│   ├── redis.ts
│   └── environment.ts
│
└── server.ts                    # App entry point
```

---

## Data Flow Patterns

### 1. User Authentication Flow

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/auth/login {email, password}
       ▼
┌─────────────┐
│    Nginx    │ (Rate limit: 5 req/15min)
└──────┬──────┘
       │ 2. Forward to backend
       ▼
┌─────────────────┐
│  Auth Service   │
│  ──────────────│
│  • Find user    │
│  • Verify pwd   │
│  • Generate JWT │
└──────┬──────────┘
       │ 3. Query user
       ▼
┌─────────────┐
│ PostgreSQL  │
└──────┬──────┘
       │ 4. Return user
       ▼
┌─────────────────┐
│  Auth Service   │
│  ──────────────│
│  • Create token │
│  • Log event    │
└──────┬──────────┘
       │ 5. Return token
       ▼
┌─────────────┐
│   Browser   │ (Store token in localStorage)
└─────────────┘
```

### 2. Order Placement Flow (Market Order)

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/orders {symbol, side, type, amount}
       │    Authorization: Bearer <token>
       ▼
┌─────────────┐
│    Nginx    │ (Rate limit: 20 orders/min)
└──────┬──────┘
       │ 2. Forward with auth header
       ▼
┌───────────────────┐
│ Auth Middleware   │ (Verify JWT)
└──────┬────────────┘
       │ 3. Token valid, extract userId
       ▼
┌─────────────────────┐
│  Trading Service    │
│  ──────────────────│
│  • Validate order   │
│  • Check balance    │
└──────┬──────────────┘
       │ 4. Query balance
       ▼
┌─────────────┐
│ PostgreSQL  │ (SELECT * FROM balances WHERE user_id = ?)
└──────┬──────┘
       │ 5. Balance: 5000 USDT
       ▼
┌─────────────────────┐
│  Balance Service    │
│  ──────────────────│
│  • Lock balance     │
└──────┬──────────────┘
       │ 6. UPDATE balances SET locked = locked + ?
       ▼
┌─────────────┐
│ PostgreSQL  │ (Transaction started)
└──────┬──────┘
       │ 7. Balance locked
       ▼
┌─────────────────────┐
│  Trading Service    │
│  ──────────────────│
│  • Create order     │
└──────┬──────────────┘
       │ 8. INSERT INTO orders (...)
       ▼
┌─────────────┐
│ PostgreSQL  │
└──────┬──────┘
       │ 9. Order created (id: abc-123)
       ▼
┌─────────────────────┐
│  Matching Service   │
│  ──────────────────│
│  • Get order book   │
│  • Find matches     │
│  • Execute trades   │
└──────┬──────────────┘
       │ 10. Query sell orders
       ▼
┌─────────────┐
│    Redis    │ (Order book cache)
└──────┬──────┘
       │ 11. Best sell orders
       ▼
┌─────────────────────┐
│  Matching Service   │
│  ──────────────────│
│  • Match orders     │
│  • Update balances  │
│  • Create trades    │
└──────┬──────────────┘
       │ 12. Multiple SQL queries (in transaction)
       │     - UPDATE balances (buyer: -USDT, +BTC)
       │     - UPDATE balances (seller: +USDT, -BTC)
       │     - UPDATE orders (set status = 'filled')
       │     - INSERT INTO trades (...)
       ▼
┌─────────────┐
│ PostgreSQL  │ (COMMIT transaction)
└──────┬──────┘
       │ 13. Trade executed
       ▼
┌─────────────────────┐
│  Logging Service    │
└──────┬──────────────┘
       │ 14. INSERT INTO logs (event: 'order_filled')
       ▼
┌─────────────┐
│ PostgreSQL  │
└──────┬──────┘
       │ 15. Log saved
       ▼
┌─────────────────────┐
│  WebSocket Server   │
│  ──────────────────│
│  • Broadcast update │
└──────┬──────────────┘
       │ 16. Emit events:
       │     - 'balance.updated' (to buyer & seller)
       │     - 'order.filled' (to buyer & seller)
       │     - 'market.trade' (to all subscribers)
       ▼
┌─────────────┐
│   Browser   │ (Receives WebSocket updates)
│  ──────────│
│  • Update balance display
│  • Update order status
│  • Show success notification
└─────────────┘
```

### 3. Withdrawal Request & Approval Flow

```
User Side:
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ 1. POST /api/wallet/withdraw {asset, amount, address}
       ▼
┌────────────────────┐
│  Wallet Service    │
│  ─────────────────│
│  • Validate amount │
│  • Lock balance    │
│  • Create request  │
└──────┬─────────────┘
       │ 2. INSERT INTO withdrawals (status: 'pending')
       ▼
┌─────────────┐
│ PostgreSQL  │
└──────┬──────┘
       │ 3. Withdrawal created
       ▼
┌────────────────────┐
│  Wallet Service    │
│  ─────────────────│
│  • Notify admin    │
└──────┬─────────────┘
       │ 4. Increment pending count in Redis
       ▼
┌─────────────┐
│    Redis    │ (SET admin:pending_withdrawals 1)
└─────────────┘

Admin Side:
┌─────────────┐
│ Admin Panel │
└──────┬──────┘
       │ 5. GET /api/admin/withdrawals/pending
       ▼
┌────────────────────┐
│  Admin Service     │
└──────┬─────────────┘
       │ 6. SELECT * FROM withdrawals WHERE status = 'pending'
       ▼
┌─────────────┐
│ PostgreSQL  │
└──────┬──────┘
       │ 7. Pending withdrawals with user context
       ▼
┌─────────────┐
│ Admin Panel │ (Admin reviews: user history, risk level)
└──────┬──────┘
       │ 8. POST /api/admin/withdrawals/:id/approve
       ▼
┌────────────────────┐
│  Wallet Service    │
│  ─────────────────│
│  • Deduct balance  │
│  • Update status   │
│  • Log approval    │
└──────┬─────────────┘
       │ 9. UPDATE withdrawals SET status = 'approved', approved_by = ?
       │    UPDATE balances SET locked = locked - ?, available = available
       ▼
┌─────────────┐
│ PostgreSQL  │ (Transaction)
└──────┬──────┘
       │ 10. Withdrawal approved
       ▼
┌────────────────────┐
│  Logging Service   │
└──────┬─────────────┘
       │ 11. INSERT INTO logs (event: 'withdrawal_approved')
       ▼
┌─────────────┐
│   Browser   │ (User receives notification)
│  ──────────│
│  "Withdrawal approved and processing"
└─────────────┘
```

### 4. Real-Time Price Updates

```
┌─────────────────────┐
│  Price Feed Service │ (External or internal price source)
└──────┬──────────────┘
       │ Every 5 seconds
       ▼
┌────────────────────┐
│  Trading Service   │
│  ─────────────────│
│  • Get latest price│
└──────┬─────────────┘
       │ Store in Redis
       ▼
┌─────────────┐
│    Redis    │ (SET market:BTC-USDT:price 45000)
└──────┬──────┘
       │ Pub/Sub message
       ▼
┌──────────────────────┐
│  WebSocket Server    │
│  ───────────────────│
│  • Subscribe to Redis│
│  • Broadcast to all  │
└──────┬───────────────┘
       │ Emit: 'market.price.BTC-USDT' {price: 45000, timestamp: ...}
       ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│  Browser 1  │   │  Browser 2  │   │  Browser N  │
│  (User A)   │   │  (User B)   │   │  (User N)   │
└─────────────┘   └─────────────┘   └─────────────┘
     │                  │                  │
     └──────────────────┴──────────────────┘
                        │
            All receive price update simultaneously
```

---

## Security Architecture

### 1. Authentication & Authorization

```
Request Flow:
┌─────────────┐
│   Client    │
└──────┬──────┘
       │ 1. Request with JWT in Authorization header
       │    Authorization: Bearer eyJhbGc...
       ▼
┌─────────────┐
│    Nginx    │
└──────┬──────┘
       │ 2. Forward to backend
       ▼
┌────────────────────┐
│ Auth Middleware    │
│  ─────────────────│
│  • Extract token   │
│  • Verify signature│
│  • Check blacklist │
└──────┬─────────────┘
       │ 3. Query Redis blacklist
       ▼
┌─────────────┐
│    Redis    │ (GET blacklist:<token>)
└──────┬──────┘
       │ 4. Not blacklisted
       ▼
┌────────────────────┐
│ Auth Middleware    │
│  ─────────────────│
│  • Decode payload  │
│  • Attach user to  │
│    request object  │
└──────┬─────────────┘
       │ 5. Request continues with req.user = {userId, email, role}
       ▼
┌────────────────────┐
│  Route Handler     │
│  ─────────────────│
│  • Access req.user │
│  • Process request │
└────────────────────┘
```

### 2. Rate Limiting

```
Limits by Endpoint:
├─ /api/auth/login: 5 requests per 15 minutes per IP
├─ /api/auth/register: 3 requests per hour per IP
├─ /api/orders: 20 requests per minute per user
├─ /api/wallet/withdraw: 5 requests per hour per user
└─ /api/*: 100 requests per minute per user (default)

Implementation:
┌─────────────┐
│    Nginx    │ (First layer: IP-based)
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Express   │ (Second layer: User-based)
│ Rate Limit  │
│ Middleware  │
└──────┬──────┘
       │ Check: Redis counter
       ▼
┌─────────────┐
│    Redis    │
│  ──────────│
│  INCR rate:user:123:orders:minute
│  EXPIRE rate:user:123:orders:minute 60
└─────────────┘
```

### 3. Data Encryption

```
Encryption Points:
├─ In Transit:
│  └─ TLS 1.3 (Nginx)
│
├─ At Rest:
│  ├─ Passwords: bcrypt (cost: 12)
│  ├─ Sensitive fields: AES-256 (if needed)
│  └─ Database: Transparent Data Encryption (optional)
│
└─ In Memory:
   └─ JWT tokens (short-lived, 7 days)
```

---

## Scalability Considerations

### Pilot Scale (Current)

```
Expected Load:
├─ Concurrent users: 100
├─ Daily active users: 500
├─ Orders per second: 10
└─ Database size: < 100GB

Single Server Setup:
┌──────────────────────────────────┐
│         Server (8 CPU, 16GB)     │
│  ┌────────────┐  ┌────────────┐ │
│  │  Backend   │  │ PostgreSQL │ │
│  │  + Nginx   │  │  + Redis   │ │
│  └────────────┘  └────────────┘ │
└──────────────────────────────────┘
```

### Future Scaling Path (Post-Pilot)

```
Phase 2 (1000+ concurrent users):
┌─────────────┐
│ Load Balancer│
└──────┬──────┘
       │
   ┌───┴────┐
   ▼        ▼
┌─────┐  ┌─────┐
│ App │  │ App │
│ Node│  │ Node│
└──┬──┘  └──┬──┘
   │        │
   └────┬───┘
        ▼
┌────────────────┐
│   PostgreSQL   │
│   (Primary +   │
│    Read Replica)│
└────────────────┘

Phase 3 (10,000+ concurrent users):
├─ Multiple app servers
├─ Database read replicas
├─ Redis cluster
├─ Separate WebSocket servers
└─ CDN for static assets
```

---

## Monitoring & Observability

### Health Checks

```
Endpoints:
├─ GET /health
│  └─ Returns: {status, uptime, database, redis, websocket}
│
└─ GET /metrics (future)
   └─ Prometheus metrics
```

### Logging Strategy

```
Log Levels:
├─ ERROR: System failures, exceptions
├─ WARN: Recoverable errors, degraded performance
└─ INFO: Critical business events

Log Destinations:
├─ Console: Development
├─ File: Production (/var/log/cex/)
└─ External Service: Future (ELK, Datadog, etc.)

Key Metrics:
├─ API response times (p50, p95, p99)
├─ Order execution latency
├─ WebSocket connection count
├─ Database query times
├─ Error rates by endpoint
└─ Active users (real-time)
```

---

## Disaster Recovery

### Backup Strategy

```
Daily Backups:
├─ Database: Full backup at 2 AM KST
│  └─ Retention: 30 days
├─ Redis: RDB snapshot every 6 hours
│  └─ Retention: 7 days
└─ Logs: Archived to S3 weekly
   └─ Retention: 90 days

Recovery Time Objectives (RTO):
├─ Database restore: < 1 hour
├─ Application restart: < 15 minutes
└─ Full system recovery: < 4 hours
```

### Rollback Procedures

```
Application Rollback:
1. Identify bad deployment (version X.Y.Z)
2. Stop current application
3. Deploy previous version (X.Y.Z-1)
4. Verify health checks
5. Monitor for 30 minutes

Database Rollback:
1. Stop application
2. Restore from backup
3. Replay transactions if needed
4. Restart application
5. Verify data integrity
```

---

## Integration Points

### External Services (Future)

```
Planned Integrations:
├─ Payment Gateway: For fiat on/off ramp
├─ KYC Provider: For identity verification
├─ Blockchain Nodes: For real crypto deposits/withdrawals
├─ Email Service: SendGrid or similar
└─ SMS Service: For 2FA (Twilio)

API Design:
All external integrations should:
├─ Use adapter pattern
├─ Have fallback mechanisms
├─ Be rate-limited
├─ Log all requests/responses
└─ Handle timeouts gracefully
```

---

## Development vs Production

### Development Environment

```
docker-compose.yml:
services:
  postgres:
    image: postgres:15
    ports: ["5432:5432"]
  
  redis:
    image: redis:7
    ports: ["6379:6379"]
  
  backend:
    build: ./backend
    ports: ["3000:3000"]
    environment:
      - NODE_ENV=development
  
  frontend:
    build: ./frontend
    ports: ["5173:5173"]
```

### Production Environment

```
Systemd Services:
├─ /etc/systemd/system/cex-backend.service
├─ /etc/systemd/system/cex-websocket.service
├─ /etc/nginx/sites-available/cex.conf
└─ PostgreSQL + Redis managed separately

Environment Variables:
├─ Stored in: /opt/cex/.env
├─ Loaded by: systemd service files
└─ Never committed to git
```

---

## Summary

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalability path from Pilot to Production
- ✅ Security by design
- ✅ Observable and debuggable
- ✅ Maintainable and testable

For detailed module specifications, see individual module documents in `frontend/` and `backend/` directories.

---

## Related Documents

- `README.md` - Module common rules
- `frontend/README.md` - Frontend architecture
- `backend/README.md` - Backend architecture
- `database/README.md` - Database design
- `infrastructure/` - Deployment guides
