# Trading Module (Backend)

## 1. Overview

The Trading module is the core engine of the CEX platform. It handles order validation, matching, and execution.

**Responsibilities:**
- Order validation (balance check, price limits)
- Order placement (Market and Limit)
- Order matching engine
- Trade execution and balance updates
- Real-time updates via WebSocket (in coordination with WebSocket Service)
- Order history and state management

---

## 2. Structure

Following the pattern in [backend/README.md](file:///Users/mac/Desktop/Mongol%20CEX%20Test_2/docs/modules/backend/README.md):

```
src/modules/trading/
├── controllers/
│   └── trading.controller.ts    # Request handlers
├── services/
│   ├── trading.service.ts       # Main business logic
│   └── matching.service.ts      # Order matching logic
├── models/
│   └── trading.model.ts         # Database operations
├── schemas/
│   └── index.ts                # Zod validation schemas
├── types/
│   └── index.ts                # TypeScript interfaces
└── routes/
    └── trading.routes.ts        # Route definitions
```

---

## 3. Data Models

### Order Entity
```typescript
export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  price: number | null;
  amount: number;
  filledAmount: number;
  averagePrice: number;
  fee: number;
  status: 'open' | 'partially_filled' | 'filled' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
```

### Trade Entity
```typescript
export interface Trade {
  id: string;
  symbol: string;
  buyerOrderId: string;
  sellerOrderId: string;
  buyerUserId: string;
  sellerUserId: string;
  price: number;
  amount: number;
  side: 'buy' | 'sell'; // Side of the taker
  timestamp: Date;
}
```

---

## 4. API Endpoints

### POST /api/orders
Place a new order.
- **Body**: `CreateOrderDto`
- **Auth**: Required
- **Logic**: 
  1. Validate input via Zod.
  2. Start DB transaction.
  3. Check and lock user balance.
  4. Create order record in `open` status.
  5. Commit transaction.
  6. Trigger matching engine (async).

### GET /api/orders
Get user's order history.
- **Query**: `status`, `symbol`, `limit`, `offset`
- **Auth**: Required

### DELETE /api/orders/:id
Cancel an open order.
- **Auth**: Required
- **Logic**:
  1. Verify order belongs to user and is `open`.
  2. Start DB transaction.
  3. Update status to `cancelled`.
  4. Unlock remaining balance.
  5. Commit transaction.

---

## 5. Matching Engine Logic

The Matching Engine follows a **Price-Time Priority** principle (FIFO).

### Process for Market Buy:
1. Fetch `open` sell orders for the symbol, sorted by price (ascending), then time (ascending).
2. Match against available liquidity until order is filled or liquidity exhausted.
3. For each match:
   - Create Trade record.
   - Update Buyer balance (USDT -> BTC).
   - Update Seller balance (BTC -> USDT).
   - Update Order statuses.
4. If liquidity remains but order is filled, stop.
5. If order remains unfilled but liquidity exhausted, set remaining to `cancelled` (standard market order behavior).

---

## 6. Database Schema (Draft)

```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    symbol VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL, -- 'buy', 'sell'
    type VARCHAR(10) NOT NULL, -- 'market', 'limit'
    price DECIMAL(32, 16),
    amount DECIMAL(32, 16) NOT NULL,
    filled_amount DECIMAL(32, 16) DEFAULT 0,
    average_price DECIMAL(32, 16) DEFAULT 0,
    fee DECIMAL(32, 16) DEFAULT 0,
    status VARCHAR(20) NOT NULL, -- 'open', 'filled', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) NOT NULL,
    buyer_order_id UUID NOT NULL REFERENCES orders(id),
    seller_order_id UUID NOT NULL REFERENCES orders(id),
    buyer_user_id UUID NOT NULL REFERENCES users(id),
    seller_user_id UUID NOT NULL REFERENCES users(id),
    price DECIMAL(32, 16) NOT NULL,
    amount DECIMAL(32, 16) NOT NULL,
    side VARCHAR(10) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
