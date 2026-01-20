# Admin Module (Frontend)

## 1. Overview

The Admin module provides **administrative controls and monitoring** for platform operators.

**Purpose:**
- Monitor platform health via dashboard
- Manage users (view, suspend, activate)
- Review and approve/reject withdrawal requests
- View system logs and audit trail

**Scope:**
- ✅ Dashboard with key metrics
- ✅ User management
- ✅ Withdrawal approval workflow
- ✅ Activity logs
- ❌ Advanced fraud detection
- ❌ Automated reporting

---

## 2. Structure

```
src/features/admin/
├── components/
│   ├── AdminLayout.tsx            # Admin-specific layout
│   ├── AdminDashboard.tsx         # Main dashboard
│   ├── MetricCard.tsx             # Single metric display
│   ├── ActivityFeed.tsx           # Recent activities
│   │
│   ├── UserManagement.tsx         # User list and search
│   ├── UserTable.tsx              # Paginated user table
│   ├── UserDetailModal.tsx        # User details
│   │
│   ├── WithdrawalReview.tsx       # Pending withdrawals
│   ├── WithdrawalCard.tsx         # Single withdrawal
│   ├── WithdrawalDetailModal.tsx  # Review modal
│   ├── RiskIndicator.tsx          # Risk level display
│   │
│   └── LogsView.tsx               # System logs
│
├── hooks/
│   ├── useAdminStats.ts           # Dashboard stats
│   ├── useUserList.ts             # User management
│   ├── usePendingWithdrawals.ts   # Withdrawal list
│   ├── useApproveWithdrawal.ts    # Approve action
│   ├── useRejectWithdrawal.ts     # Reject action
│   └── useLogs.ts                 # System logs
│
├── services/
│   └── adminService.ts            # Admin API calls
│
└── types/
    └── index.ts                   # TypeScript types
```

---

## 3. Data Models

```typescript
export interface DashboardStats {
  activeUsers24h: number;
  tradingVolume24h: number;
  pendingWithdrawals: number;
  systemStatus: 'operational' | 'degraded' | 'down';
}

export interface AdminUser {
  id: string;
  email: string;
  status: 'active' | 'suspended';
  registrationDate: string;
  totalVolume: number;
  lastLogin?: string;
}

export interface WithdrawalReview {
  withdrawal: Withdrawal;
  userContext: {
    accountAge: number;
    previousWithdrawals: number;
    totalVolume: number;
  };
  riskLevel: 'low' | 'medium' | 'high';
}
```

---

## 4. Key Components

### AdminDashboard

```typescript
export function AdminDashboard() {
  const { data: stats } = useAdminStats();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Users (24h)"
          value={stats?.activeUsers24h || 0}
          icon={<Users />}
        />
        <MetricCard
          title="Trading Volume (24h)"
          value={`$${stats?.tradingVolume24h.toLocaleString() || 0}`}
          icon={<TrendingUp />}
        />
        <MetricCard
          title="Pending Withdrawals"
          value={stats?.pendingWithdrawals || 0}
          icon={<AlertCircle />}
          alert={stats?.pendingWithdrawals > 0}
        />
        <MetricCard
          title="System Status"
          value={stats?.systemStatus || 'unknown'}
          icon={<Server />}
        />
      </div>
      
      <ActivityFeed />
    </div>
  );
}
```

### WithdrawalReview

```typescript
export function WithdrawalReview() {
  const { data: pendingWithdrawals } = usePendingWithdrawals();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalReview | null>(null);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Pending Withdrawals</h2>
      
      {pendingWithdrawals?.map((review) => (
        <WithdrawalCard
          key={review.withdrawal.id}
          review={review}
          onClick={() => setSelectedWithdrawal(review)}
        />
      ))}
      
      {selectedWithdrawal && (
        <WithdrawalDetailModal
          review={selectedWithdrawal}
          isOpen={true}
          onClose={() => setSelectedWithdrawal(null)}
        />
      )}
    </div>
  );
}
```

---

## 5. API Contracts

```typescript
GET    /api/admin/stats
GET    /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id/status
GET    /api/admin/withdrawals/pending
POST   /api/admin/withdrawals/:id/approve
POST   /api/admin/withdrawals/:id/reject
GET    /api/admin/logs
```

---

## 6. Security

- All admin routes require `role === 'admin'`
- Log all admin actions with admin ID
- Require confirmation for destructive actions
- Implement rate limiting on admin endpoints

---

## 7. Related Documents

- `../README.md` - Frontend patterns
- `../../ARCHITECTURE.md` - System architecture
