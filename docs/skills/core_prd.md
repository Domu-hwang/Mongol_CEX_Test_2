# Core PRD – CEX Pilot (Mongolia)

## 1. Document Purpose

This document defines the **functional requirements and user experience** for the Pilot Centralized Crypto Exchange (CEX) platform, based strictly on the constraints defined in `cex-pilot-context.md`.

**What this document provides:**
- Concrete user scenarios and flows
- Feature specifications with acceptance criteria
- UI/UX requirements for mobile-first design
- Edge case handling
- Measurable success criteria

**What this document does NOT include:**
- Technical implementation details (see `modules.md`)
- Architecture decisions (see `cex-pilot-skill.md`)
- Features beyond Pilot scope

---

## 2. User Personas

### 2.1 Primary Persona: Casual Crypto Trader (Батаа)

**Profile:**
- Age: 28, Software developer in Ulaanbaatar
- Experience: Moderate crypto knowledge, used international exchanges before
- Goals: Trade BTC/USDT during lunch break on mobile
- Pain points: International exchanges are slow, complex verification
- Device: Primarily mobile (iPhone), occasionally desktop

**Key Needs:**
- Fast, simple order placement
- Clear balance visibility
- Quick deposit/withdrawal

### 2.2 Secondary Persona: Platform Administrator (Болор)

**Profile:**
- Age: 35, Operations manager
- Experience: Financial systems, basic crypto knowledge
- Goals: Monitor platform health, prevent fraud, support users
- Pain points: Need to review withdrawals quickly, spot suspicious activity
- Device: Desktop during work hours

**Key Needs:**
- Real-time platform monitoring
- User management tools
- Audit trail for compliance

---

## 3. Core User Journeys

### 3.1 Journey: First-Time User to First Trade

**Scenario:** Батаа wants to buy 0.1 BTC using USDT

```
Step 1: Landing Page
├─ User sees hero section: "Trade Crypto in Mongolia"
├─ Clear CTA: "Start Trading"
└─ Click → Registration

Step 2: Registration (Mobile)
├─ Email input
├─ Password creation (min 8 chars, 1 number, 1 special)
├─ Email verification code sent
├─ Enter verification code
└─ Account created → Auto login

Step 3: Dashboard (First-time experience)
├─ Welcome modal: "Get started with crypto trading"
├─ Zero balance state displayed
├─ Prominent "Deposit" button
└─ Tutorial hints (optional, dismissible)

Step 4: Deposit Flow
├─ Select asset: USDT
├─ Display deposit address (QR code + copyable text)
├─ Warning: "Wait for 3 confirmations"
├─ User sends USDT from external wallet
└─ System detects deposit → Balance updates

Step 5: Trade Execution
├─ Navigate to Trade page
├─ Select BTC/USDT pair
├─ Current price displayed: $45,000
├─ Choose "Buy" tab
├─ Enter amount: 0.1 BTC
├─ System calculates: 4,500 USDT required
├─ Shows available balance: 5,000 USDT ✓
├─ Select order type: Market
├─ Click "Buy BTC"
├─ Confirmation modal: Review order details
├─ Confirm → Order executed
└─ Success message + Balance updated

Step 6: Portfolio View
├─ New balance: 0.1 BTC, 500 USDT
├─ Transaction history shows completed order
└─ User can view order details
```

**Expected Duration:** 5-10 minutes (excluding deposit confirmation time)

### 3.2 Journey: Admin Reviews Withdrawal Request

```
Step 1: User initiates withdrawal
├─ User selects Withdraw
├─ Enters amount: 0.05 BTC
├─ Enters destination address
├─ 2FA verification (if enabled)
└─ Request submitted → Status: Pending

Step 2: Admin notification
├─ Admin dashboard shows new withdrawal request
├─ Red badge indicator: "1 pending"
└─ Admin clicks to review

Step 3: Admin review
├─ User details displayed
├─ Withdrawal history
├─ Risk indicators (if any)
├─ Account age, trading volume
├─ Admin actions: Approve / Reject
└─ Admin clicks "Approve"

Step 4: Processing
├─ System executes blockchain transaction
├─ Status updates: Processing → Completed
└─ User receives notification

Step 5: Completion
├─ User sees updated balance
├─ Transaction appears in history
└─ Admin sees completed status
```

**Expected Duration:** 5-30 minutes (manual review time)

---

## 4. Feature Specifications

### 4.1 User Registration & Authentication

#### FR-AUTH-001: Email Registration

**User Story:**
As a new user, I want to register with my email so that I can start trading.

**Acceptance Criteria:**
- Given I'm on the registration page
- When I enter valid email and password
- Then I receive a verification code via email
- And I can complete registration by entering the code
- And my account is created with "active" status

**UI Requirements (Mobile-first):**
```
Registration Screen:
├─ Logo at top
├─ Email input field (full-width)
├─ Password input field (with show/hide toggle)
├─ Password strength indicator (weak/medium/strong)
├─ "Create Account" button (disabled until valid)
├─ Link to login page
└─ Terms & conditions checkbox

Validation:
├─ Email: RFC 5322 compliant
├─ Password: Min 8 chars, 1 uppercase, 1 number, 1 special char
└─ Real-time validation feedback
```

**Error Handling:**
- Email already exists → "This email is already registered"
- Invalid email format → "Please enter a valid email"
- Weak password → "Password must be at least 8 characters with 1 number"
- Email service unavailable → "Cannot send verification code. Please try again."

**Data Requirements:**
```typescript
interface UserRegistration {
  email: string;
  password: string; // hashed before storage
  verificationCode: string; // 6-digit, expires in 10 minutes
  createdAt: timestamp;
  status: 'pending' | 'active';
}
```

---

#### FR-AUTH-002: Login & Session Management

**User Story:**
As a registered user, I want to log in securely so that I can access my account.

**Acceptance Criteria:**
- Given I have a registered account
- When I enter correct email and password
- Then I'm logged in and redirected to dashboard
- And my session remains active for 7 days (with "Remember me")
- And I can log out to invalidate my session

**UI Requirements:**
```
Login Screen:
├─ Email input
├─ Password input
├─ "Remember me" checkbox
├─ "Login" button
├─ "Forgot password?" link
└─ "Don't have an account? Register" link

Post-login:
├─ Redirect to last visited page or dashboard
└─ Display user menu with logout option
```

**Security Requirements:**
- Session token: JWT with 7-day expiration
- Failed login attempts: Lock account after 5 failures (15-minute cooldown)
- Password hashing: bcrypt with salt
- HTTPS only for all auth endpoints

**Edge Cases:**
- Account locked → "Too many failed attempts. Try again in 15 minutes."
- Expired session → Auto-logout with message: "Session expired. Please log in again."
- Concurrent sessions → Allow up to 3 devices simultaneously

---

### 4.2 Trading Functionality

#### FR-TRADE-001: Market View & Price Display

**User Story:**
As a trader, I want to see current market prices so that I can make informed trading decisions.

**Acceptance Criteria:**
- Given I'm on the trading page
- When the page loads
- Then I see all available trading pairs
- And each pair shows current price, 24h change, and volume
- And prices update every 5 seconds (via WebSocket or polling)

**UI Requirements (Mobile):**
```
Market List View:
├─ Search bar (filter pairs)
├─ List of trading pairs:
│   ├─ BTC/USDT
│   │   ├─ Price: $45,000.00
│   │   ├─ 24h Change: +2.5% (green) or -1.2% (red)
│   │   └─ Volume: 1,234.56 BTC
│   └─ [Other pairs...]
└─ Pull-to-refresh gesture

Selected Pair Detail:
├─ Large price display
├─ Mini chart (24h trend line)
├─ High/Low/Volume indicators
└─ Quick trade buttons: "Buy" / "Sell"
```

**Technical Requirements:**
- WebSocket connection for real-time updates
- Fallback to polling (5s interval) if WebSocket fails
- Price precision: 2 decimals for fiat, 8 for crypto
- Handle connection loss gracefully (show "Reconnecting..." indicator)

---

#### FR-TRADE-002: Order Placement (Market Order)

**User Story:**
As a trader, I want to place a market order so that I can buy/sell crypto immediately at current price.

**Acceptance Criteria:**
- Given I have sufficient balance
- When I enter order amount and click "Buy"/"Sell"
- Then order executes immediately at best available price
- And my balance updates instantly
- And order appears in my history

**UI Requirements:**
```
Order Form (Buy Tab):
├─ Asset selector: BTC/USDT (locked to selected pair)
├─ Order type toggle: [Market] | Limit
├─ Amount input:
│   ├─ Label: "Amount (BTC)"
│   ├─ Input field
│   └─ Quick buttons: 25% | 50% | 75% | Max
├─ Available balance: 5,000 USDT
├─ Estimated cost: 4,500 USDT (calculated)
├─ Fee: 0.1% = 4.5 USDT
├─ Total: 4,504.5 USDT
└─ "Buy BTC" button (green, full-width)

Confirmation Modal:
├─ Order summary
│   ├─ Type: Market Buy
│   ├─ Amount: 0.1 BTC
│   ├─ Estimated price: ~$45,000
│   └─ Total cost: 4,504.5 USDT
├─ Warning: "Market orders execute immediately"
├─ "Confirm" button
└─ "Cancel" button
```

**Validation Rules:**
- Amount > 0
- Amount ≤ available balance (after fees)
- Minimum order value: $10 equivalent
- Maximum order: 10% of 24h volume (to prevent manipulation)

**Error Handling:**
```typescript
Errors:
├─ Insufficient balance → "Insufficient balance. Available: 5,000 USDT"
├─ Below minimum → "Minimum order value is $10"
├─ Above maximum → "Order exceeds 10% of daily volume"
├─ Market offline → "Trading temporarily unavailable"
└─ Network error → "Connection error. Please try again."
```

**Data Structure:**
```typescript
interface MarketOrder {
  id: string; // UUID
  userId: string;
  symbol: string; // "BTC/USDT"
  side: 'buy' | 'sell';
  type: 'market';
  amount: number; // BTC quantity
  executedPrice: number; // Average filled price
  fee: number;
  status: 'filled';
  createdAt: timestamp;
  executedAt: timestamp;
}
```

---

#### FR-TRADE-003: Order Placement (Limit Order)

**User Story:**
As a trader, I want to place a limit order so that I can buy/sell at my desired price.

**Acceptance Criteria:**
- Given I have sufficient balance
- When I set price and amount, then click "Buy"/"Sell"
- Then order is placed in order book
- And my balance is locked for the order
- And order remains open until filled or cancelled

**UI Requirements:**
```
Order Form (Limit):
├─ Order type: Market | [Limit]
├─ Price input:
│   ├─ Label: "Price (USDT)"
│   ├─ Input field
│   └─ Current market price shown below
├─ Amount input (same as market)
├─ Total calculation
└─ "Buy BTC" button

Order Book (showing where order will be placed):
├─ Sell orders (red, ascending)
├─ Current price (highlighted)
├─ Buy orders (green, descending)
└─ User's pending order (highlighted when placed)
```

**Validation Rules:**
- Price > 0
- Price within ±20% of current market price (safety limit)
- Locked balance = (amount × price) + fee

**Order Lifecycle:**
```
States:
├─ Open: Order in book, waiting to be filled
├─ Partially Filled: Some filled, rest still open
├─ Filled: Completely executed
└─ Cancelled: User cancelled or expired

User Actions:
├─ View open orders
├─ Cancel open order (before any fill)
└─ Cannot cancel after partial fill (Pilot limitation)
```

---

#### FR-TRADE-004: Order History & Status

**User Story:**
As a trader, I want to see my order history so that I can track my trading activity.

**Acceptance Criteria:**
- Given I have placed orders
- When I view order history
- Then I see all orders (open, filled, cancelled)
- And I can filter by status and date range
- And I can view detailed information for each order

**UI Requirements:**
```
Order History Screen:
├─ Filter tabs: [All] | Open | Filled | Cancelled
├─ Date range selector (Last 7 days, 30 days, Custom)
├─ Order list:
│   ├─ Order card (per order):
│   │   ├─ Pair: BTC/USDT
│   │   ├─ Type: Market Buy
│   │   ├─ Amount: 0.1 BTC
│   │   ├─ Price: $45,000
│   │   ├─ Status badge: Filled (green)
│   │   ├─ Time: 2025-01-20 14:30
│   │   └─ Tap to view details
│   └─ [More orders...]
└─ Load more (pagination)

Order Detail Modal:
├─ Full order information
├─ Transaction ID
├─ Fee breakdown
├─ Execution timeline
└─ Cancel button (if open)
```

**Data to Display:**
```typescript
interface OrderDisplay {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  amount: number;
  price: number;
  filledAmount: number;
  averagePrice: number;
  fee: number;
  status: 'open' | 'partially_filled' | 'filled' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}
```

---

### 4.3 Wallet & Asset Management

#### FR-WALLET-001: Balance Overview

**User Story:**
As a user, I want to see my asset balances so that I know what I can trade.

**Acceptance Criteria:**
- Given I'm logged in
- When I view my wallet
- Then I see all my assets with balances
- And I can distinguish between available and locked amounts
- And I see total portfolio value in USD

**UI Requirements:**
```
Wallet Screen:
├─ Total Portfolio Value
│   ├─ Large display: $12,345.67
│   └─ 24h change: +$234.56 (+1.9%)
├─ Asset List:
│   ├─ BTC card:
│   │   ├─ Icon + name
│   │   ├─ Available: 0.5 BTC
│   │   ├─ Locked: 0.1 BTC (in orders)
│   │   ├─ Value: $22,500
│   │   └─ Actions: Deposit | Withdraw | Trade
│   ├─ USDT card: [...]
│   └─ [Other assets...]
└─ Hide zero balances toggle
```

**Display Rules:**
- Sort by value (highest first)
- Show assets with balance > 0 by default
- Update in real-time when trades execute
- Locked balance tooltip: "Amount locked in open orders"

---

#### FR-WALLET-002: Deposit (Simulated for Pilot)

**User Story:**
As a user, I want to deposit crypto so that I can start trading.

**Acceptance Criteria:**
- Given I select an asset to deposit
- When I view deposit instructions
- Then I see a deposit address and instructions
- And when admin simulates deposit (or blockchain confirms)
- Then my balance updates automatically

**UI Requirements:**
```
Deposit Screen:
├─ Asset selector dropdown (BTC, USDT, etc.)
├─ Selected asset: BTC
├─ Deposit address:
│   ├─ QR code (large, centered)
│   ├─ Address string (copyable)
│   └─ "Copy Address" button
├─ Instructions:
│   ├─ "Send only BTC to this address"
│   ├─ "Minimum deposit: 0.001 BTC"
│   ├─ "Confirmations required: 3"
│   └─ "Estimated time: ~30 minutes"
├─ Recent deposits list
└─ Warning: "Do not send other coins"

Deposit History:
├─ Pending deposits (with confirmation count)
├─ Completed deposits
└─ Time, amount, transaction ID
```

**Pilot Implementation:**
- For pilot: Admin can manually credit deposits via admin panel
- Show deposit address (can be static test address)
- User experience mimics real deposit flow
- No actual blockchain integration required for pilot

**Data Structure:**
```typescript
interface Deposit {
  id: string;
  userId: string;
  asset: string;
  amount: number;
  address: string;
  txHash?: string; // Optional for pilot
  confirmations: number;
  requiredConfirmations: number;
  status: 'pending' | 'confirming' | 'completed' | 'failed';
  createdAt: timestamp;
  completedAt?: timestamp;
}
```

---

#### FR-WALLET-003: Withdrawal Request

**User Story:**
As a user, I want to withdraw crypto to my external wallet so that I can use my funds elsewhere.

**Acceptance Criteria:**
- Given I have available balance
- When I submit withdrawal request with destination address
- Then request is created and pending admin approval
- And admin can approve/reject the request
- And upon approval, my balance updates and funds are sent

**UI Requirements:**
```
Withdrawal Screen:
├─ Asset selector: BTC
├─ Available balance: 0.5 BTC
├─ Amount input:
│   ├─ Amount field
│   ├─ Quick buttons: 25% | 50% | 100%
│   └─ Minimum: 0.01 BTC
├─ Destination address:
│   ├─ Address input (with paste button)
│   └─ Address validation (checksum)
├─ Network fee: 0.0002 BTC
├─ You will receive: 0.4998 BTC
├─ Warning: "Withdrawals require admin approval"
├─ "Request Withdrawal" button
└─ 2FA code input (if enabled)

Confirmation Modal:
├─ Review all details
├─ Warning: "Transaction cannot be reversed"
├─ Checkbox: "I've verified the address"
└─ "Confirm Withdrawal" button

After Submission:
├─ Success message: "Withdrawal request submitted"
├─ Status: Pending approval
└─ Redirect to withdrawal history
```

**Validation Rules:**
- Amount > minimum (0.01 BTC)
- Amount ≤ available balance
- Valid destination address format
- Address not in blacklist (if implemented)
- 2FA required for amounts > 1 BTC

**Withdrawal States:**
```
Status Flow:
├─ Pending: Waiting for admin review
├─ Approved: Admin approved, processing blockchain tx
├─ Processing: Transaction submitted to blockchain
├─ Completed: Transaction confirmed
└─ Rejected: Admin rejected (with reason)
```

**Error Handling:**
- Insufficient balance → "Insufficient balance for withdrawal"
- Invalid address → "Invalid BTC address format"
- Below minimum → "Minimum withdrawal is 0.01 BTC"
- Failed 2FA → "Invalid verification code"

---

### 4.4 Admin Console

#### FR-ADMIN-001: Dashboard Overview

**User Story:**
As an admin, I want to see platform health at a glance so that I can monitor operations.

**Acceptance Criteria:**
- Given I'm logged in as admin
- When I access admin dashboard
- Then I see key metrics and alerts
- And I can drill down into details
- And metrics update in real-time or near-real-time

**UI Requirements:**
```
Admin Dashboard:
├─ Metrics Cards (Top row):
│   ├─ Active Users (24h): 245
│   ├─ Total Trading Volume (24h): $1.2M
│   ├─ Pending Withdrawals: 3 (red badge)
│   └─ System Status: Operational (green)
├─ Charts (Second row):
│   ├─ Trading volume chart (7 days)
│   └─ New users chart (7 days)
├─ Recent Activity Feed:
│   ├─ User registrations
│   ├─ Large orders
│   ├─ Withdrawals
│   └─ System events
└─ Quick Actions:
    ├─ Review Withdrawals
    ├─ User Management
    └─ View Logs
```

**Metrics Definitions:**
- Active Users: Unique users with activity in last 24h
- Trading Volume: Total value of filled orders
- Pending Withdrawals: Count of withdrawal requests awaiting approval
- System Status: Based on health checks (API, DB, WebSocket)

---

#### FR-ADMIN-002: User Management

**User Story:**
As an admin, I want to manage user accounts so that I can handle issues and enforce policies.

**Acceptance Criteria:**
- Given I'm an admin
- When I view user list
- Then I see all registered users with key information
- And I can search and filter users
- And I can view user details and activity
- And I can activate/deactivate accounts

**UI Requirements:**
```
User Management Screen:
├─ Search bar (email, user ID)
├─ Filters:
│   ├─ Status: All | Active | Suspended
│   ├─ Registration date range
│   └─ Sort by: Newest | Volume | Balance
├─ User Table:
│   ├─ Columns:
│   │   ├─ User ID (clickable)
│   │   ├─ Email
│   │   ├─ Status badge
│   │   ├─ Registration date
│   │   ├─ Total volume
│   │   └─ Actions menu
│   └─ Pagination
└─ Bulk actions (future: not for pilot)

User Detail Page:
├─ User Info:
│   ├─ Email, ID, registration date
│   ├─ Status with toggle
│   └─ Account age, last login
├─ Tabs:
│   ├─ Overview (balances, total volume)
│   ├─ Orders (history)
│   ├─ Deposits (history)
│   ├─ Withdrawals (history)
│   └─ Activity Log
├─ Risk Indicators:
│   ├─ Withdrawal frequency
│   ├─ Large orders
│   └─ Account age
└─ Admin Actions:
    ├─ Suspend Account
    ├─ Activate Account
    ├─ Add Note
    └─ View Full History
```

**Admin Actions:**
- Suspend account: Prevents login and trading
- Activate account: Restores access
- Add internal note: For admin reference only

---

#### FR-ADMIN-003: Withdrawal Review & Approval

**User Story:**
As an admin, I want to review withdrawal requests so that I can prevent fraud and ensure compliance.

**Acceptance Criteria:**
- Given there are pending withdrawals
- When I review a withdrawal request
- Then I see user details, withdrawal history, and risk indicators
- And I can approve or reject the request with a reason
- And user is notified of the decision

**UI Requirements:**
```
Withdrawal Review Screen:
├─ Pending Requests List:
│   ├─ Request cards:
│   │   ├─ User email
│   │   ├─ Amount: 0.5 BTC
│   │   ├─ Destination address (truncated)
│   │   ├─ Requested: 2 hours ago
│   │   ├─ Risk level badge (Low/Medium/High)
│   │   └─ "Review" button
│   └─ Sort: Oldest first | Highest amount
└─ Filters: All | High Risk Only

Review Detail Modal:
├─ Request Information:
│   ├─ Amount: 0.5 BTC
│   ├─ Destination: bc1q... (full address)
│   ├─ Network fee: 0.0002 BTC
│   └─ Requested at: timestamp
├─ User Context:
│   ├─ Account age: 45 days
│   ├─ Previous withdrawals: 2 (all successful)
│   ├─ Total trading volume: $50,000
│   ├─ Current balances: 0.8 BTC, 5,000 USDT
│   └─ Last login: 1 hour ago
├─ Risk Assessment:
│   ├─ Risk level: Low (auto-calculated)
│   ├─ Factors:
│   │   ├─ ✓ Account age > 30 days
│   │   ├─ ✓ Previous successful withdrawals
│   │   ├─ ✓ Address not blacklisted
│   │   └─ ⚠ Large amount (>50% of balance)
│   └─ Notes from previous admin reviews
├─ Admin Decision:
│   ├─ "Approve" button (green)
│   ├─ "Reject" button (red)
│   └─ Reason input (required for rejection)
└─ Warning: "This action cannot be undone"
```

**Risk Level Calculation:**
```typescript
Risk Factors:
├─ High Risk:
│   ├─ Account age < 7 days
│   ├─ First withdrawal
│   ├─ Amount > 80% of balance
│   └─ Address in suspicious list
├─ Medium Risk:
│   ├─ Account age < 30 days
│   ├─ Amount > 50% of balance
│   └─ Unusual withdrawal pattern
└─ Low Risk:
    └─ All other cases
```

**Approval Flow:**
```
Admin Approves:
├─ Withdrawal status → Approved
├─ Balance deducted immediately
├─ (Pilot) Admin manually processes blockchain tx
├─ Status → Processing → Completed
└─ User notification sent

Admin Rejects:
├─ Withdrawal status → Rejected
├─ Locked balance released
├─ Rejection reason recorded
└─ User notification with reason
```

---

#### FR-ADMIN-004: Activity Logs & Audit Trail

**User Story:**
As an admin, I want to view system logs so that I can audit activities and investigate issues.

**Acceptance Criteria:**
- Given I'm an admin
- When I access logs
- Then I see all critical events with timestamps
- And I can filter by event type, user, and date range
- And I can export logs for compliance

**UI Requirements:**
```
Logs Screen:
├─ Filters:
│   ├─ Event type: All | Login | Order | Withdrawal | Admin Action
│   ├─ User: Search by email or ID
│   ├─ Date range picker
│   └─ Apply filters button
├─ Log Table:
│   ├─ Columns:
│   │   ├─ Timestamp (sortable)
│   │   ├─ Event type (with icon)
│   │   ├─ User (email)
│   │   ├─ Description
│   │   ├─ IP Address
│   │   └─ Details (expandable)
│   └─ Real-time updates (new entries highlighted)
└─ Export button (CSV format)
```

**Event Types to Log:**
```typescript
Critical Events:
├─ Authentication:
│   ├─ User login (success/failure)
│   ├─ User logout
│   └─ Failed login attempts
├─ Trading:
│   ├─ Order placed
│   ├─ Order filled
│   ├─ Order cancelled
│   └─ Large order (>$10,000)
├─ Wallet:
│   ├─ Deposit initiated
│   ├─ Deposit completed
│   ├─ Withdrawal requested
│   ├─ Withdrawal approved/rejected
│   └─ Withdrawal completed
└─ Admin Actions:
    ├─ User account suspended/activated
    ├─ Withdrawal approved/rejected
    ├─ Settings changed
    └─ Admin login
```

**Log Entry Structure:**
```typescript
interface LogEntry {
  id: string;
  timestamp: string;
  eventType: string;
  userId?: string;
  userEmail?: string;
  description: string;
  metadata: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'error';
}
```

---

## 5. Non-Functional Requirements

### 5.1 Performance Targets (Pilot Scale)

**Response Times:**
- Page load (initial): < 3 seconds
- API responses: < 500ms (p95)
- Order execution: < 2 seconds
- Real-time price updates: < 5 seconds latency

**Capacity:**
- Concurrent users: 100
- Daily active users: 500
- Orders per second: 10
- Database: < 100GB

### 5.2 Mobile Performance

**Mobile-Specific:**
- First contentful paint: < 2 seconds on 3G
- Touch target size: Minimum 44×44px
- Smooth scrolling: 60fps
- Offline graceful degradation: Show cached data

### 5.3 Security Requirements

**Authentication:**
- Password hashing: bcrypt (cost factor 12)
- Session tokens: JWT with 7-day expiration
- HTTPS only (TLS 1.3)

**Data Protection:**
- Sensitive data encrypted at rest
- API keys never exposed to client
- Input validation on all endpoints
- SQL injection prevention (parameterized queries)

**Rate Limiting:**
- API calls: 100 requests per minute per user
- Failed logins: 5 attempts per 15 minutes
- Order placement: 20 orders per minute

### 5.4 Reliability

**Uptime:**
- Target: 99% uptime (Pilot scale)
- Planned maintenance window: Sundays 2-4 AM KST

**Error Handling:**
- All errors logged with context
- User-facing errors: Clear, actionable messages
- Critical errors: Admin notification

**Data Integrity:**
- Database transactions for balance updates
- Order atomicity (all-or-nothing execution)
- Audit trail for all balance changes

---

## 6. Success Metrics (Pilot)

### 6.1 Quantitative Metrics

**User Adoption:**
- Target: 100 registered users in first month
- Target: 30% activation rate (complete first trade)
- Target: 20% weekly active users (WAU)

**Trading Activity:**
- Target: 50 trades per day
- Target: $10,000 daily trading volume
- Target: 10 orders per active user per week

**Operational Metrics:**
- Order execution success rate: > 95%
- Average withdrawal approval time: < 24 hours
- System uptime: > 99%
- Critical bugs: 0

### 6.2 Qualitative Goals

**User Experience:**
- Users can complete first trade within 10 minutes
- Mobile experience feels native, not web-based
- Zero critical user complaints about fund safety

**Operational Readiness:**
- Admin can handle all operations within dashboard
- Clear audit trail for regulatory review
- No manual intervention needed for normal operations

### 6.3 Success Criteria for Pilot Graduation

The Pilot is considered successful if:

1. **Technical Stability:**
   - 99% uptime over 3-month period
   - No critical security incidents
   - No data loss or corruption

2. **User Validation:**
   - 100+ registered users
   - 50+ weekly active traders
   - $50,000+ total trading volume

3. **Operational Proof:**
   - Admin can manage all operations solo
   - Withdrawal approval process works smoothly
   - Complete audit logs for all activities

4. **Regulatory Readiness:**
   - All required data structures in place
   - Event logging comprehensive
   - Ready for KYC/AML integration

---

## 7. Edge Cases & Error Scenarios

### 7.1 Trading Edge Cases

**Insufficient Balance:**
- Scenario: User tries to buy with insufficient USDT
- Behavior: Show error before order placement
- Message: "Insufficient balance. Available: 100 USDT, Required: 500 USDT"

**Market Price Slippage:**
- Scenario: Market order executes at worse price than shown
- Behavior: Show warning before confirmation
- Message: "Market orders may execute at different prices. Continue?"

**Order Book Empty:**
- Scenario: No matching orders for limit order
- Behavior: Order placed but shows warning
- Message: "Your order is placed but may take time to fill"

**Concurrent Orders:**
- Scenario: User places multiple orders simultaneously
- Behavior: Lock balance sequentially, prevent over-allocation
- Error if insufficient: "Another order is using your balance"

### 7.2 Wallet Edge Cases

**Duplicate Deposits:**
- Scenario: Same transaction detected twice
- Behavior: Credit only once, log duplicate attempt
- Admin notification for investigation

**Failed Withdrawal:**
- Scenario: Blockchain transaction fails after approval
- Behavior: Revert balance, mark withdrawal as failed
- Admin manually reviews and retries

**Address Validation:**
- Scenario: User enters invalid destination address
- Behavior: Block submission with clear error
- Message: "Invalid BTC address format. Please check and try again."

### 7.3 Authentication Edge Cases

**Session Expiry During Trade:**
- Scenario: Session expires while user filling order form
- Behavior: Show modal: "Session expired. Your data is saved."
- Action: Redirect to login, restore form data after login

**Concurrent Logins:**
- Scenario: User logs in from multiple devices
- Behavior: Allow up to 3 sessions
- Oldest session invalidated if limit exceeded

**Password Reset During Active Session:**
- Scenario: User resets password in another tab
- Behavior: Invalidate all other sessions
- Message: "Password changed. Please log in again."

---

## 8. Out of Scope (Explicit Exclusions)

The following are **NOT** included in this PRD:

**Advanced Trading:**
- Margin trading
- Futures or derivatives
- Stop-loss / take-profit orders
- Trailing stops
- OCO (One-Cancels-Other) orders

**Social Features:**
- Copy trading
- Social feed
- User-to-user messaging
- Leaderboards

**Advanced Wallet:**
- Multi-signature wallets
- Hardware wallet integration
- Automatic conversion between assets
- Interest-bearing accounts

**Automation:**
- Trading bots or API
- Automated market making
- Algorithmic trading

**Localization:**
- Multiple language support (English only for pilot)
- Multiple currency displays (USD only)
- Regional customization

**Advanced Admin:**
- Automated fraud detection
- Machine learning risk models
- Bulk user operations
- Custom report builder

---

## 9. Future Considerations (Post-Pilot)

Features to consider after successful pilot:

**Phase 2 (3-6 months):**
- Mobile native app (iOS/Android)
- Advanced order types (stop-loss, OCO)
- Full KYC/AML automation
- Multiple language support (Mongolian, Russian)

**Phase 3 (6-12 months):**
- Margin trading
- Futures contracts
- Trading API for bots
- Referral program

**Phase 4 (12+ months):**
- Institutional trading desk
- OTC trading
- Staking and DeFi integration
- Regional expansion

---

## 10. Appendix

### 10.1 Glossary

**Terms:**
- **Market Order:** Order that executes immediately at current market price
- **Limit Order:** Order that waits at specified price
- **Order Book:** List of all open buy and sell orders
- **Slippage:** Difference between expected and executed price
- **Locked Balance:** Funds reserved for open orders
- **2FA:** Two-Factor Authentication

### 10.2 Related Documents

- `cex-pilot-context.md` - Project constraints and boundaries
- `cex-pilot-skill.md` - Implementation guidelines and patterns
- `modules.md` - System architecture and module decomposition

---

**This PRD defines the complete functional requirements for CEX Pilot MVP.**
