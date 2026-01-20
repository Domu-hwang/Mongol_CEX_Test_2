# CEX Pilot - Build Skill

## Document Purpose

This skill provides **concrete implementation guidelines** for building the CEX Pilot platform. Use this document when generating code, components, or architecture decisions.

**Prerequisites**: Read `cex-pilot-context.md` first to understand project boundaries.

---

## 1. Architecture Patterns

### 1.1 Module Structure

Every major feature should follow this structure:

```
src/
├── features/
│   ├── trade/
│   │   ├── components/      # UI components
│   │   ├── hooks/           # React hooks
│   │   ├── services/        # API calls
│   │   ├── types/           # TypeScript types
│   │   └── index.ts         # Public exports
│   ├── wallet/
│   ├── account/
│   └── admin/
├── shared/
│   ├── components/          # Reusable UI
│   ├── hooks/               # Common hooks
│   ├── utils/               # Utilities
│   └── types/               # Global types
└── core/
    ├── api/                 # API client setup
    ├── auth/                # Authentication
    └── routing/             # Router config
```

### 1.2 Component Design Pattern

```tsx
// ✅ Good: Mobile-first, clear responsibility
interface OrderFormProps {
  onSubmit: (order: OrderRequest) => void;
  balance: number;
  currentPrice: number;
}

export function OrderForm({ onSubmit, balance, currentPrice }: OrderFormProps) {
  // 1. Hooks at top
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState(currentPrice);
  
  // 2. Derived state
  const total = Number(amount) * price;
  const isValid = total <= balance && amount > 0;
  
  // 3. Handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ amount: Number(amount), price });
  };
  
  // 4. Mobile-first UI with Tailwind
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Form fields */}
    </form>
  );
}
```

```tsx
// ❌ Bad: Desktop-first, mixed concerns
export function OrderFormBad() {
  // Mixing API calls, state, and UI in one component
  const [data, setData] = useState();
  
  useEffect(() => {
    fetch('/api/balance').then(r => r.json()).then(setData);
  }, []);
  
  return (
    <div style={{ width: '800px' }}> {/* Not mobile-first */}
      {/* Complex nested logic */}
    </div>
  );
}
```

---

## 2. State Management

### 2.1 Local State Pattern

Use React hooks for component-level state:

```tsx
// ✅ Simple, predictable
function TradePanel() {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [price, setPrice] = useState<number>(0);
  
  return (/* UI */);
}
```

### 2.2 Shared State Pattern

For cross-component state, use Context:

```tsx
// contexts/OrderContext.tsx
interface OrderContextValue {
  orders: Order[];
  addOrder: (order: Order) => void;
  cancelOrder: (id: string) => void;
}

export const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  
  const addOrder = useCallback((order: Order) => {
    setOrders(prev => [...prev, order]);
  }, []);
  
  const cancelOrder = useCallback((id: string) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  }, []);
  
  return (
    <OrderContext.Provider value={{ orders, addOrder, cancelOrder }}>
      {children}
    </OrderContext.Provider>
  );
}

// Custom hook for type-safe access
export function useOrders() {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
}
```

---

## 3. API Integration

### 3.1 Service Layer Pattern

```tsx
// services/orderService.ts
import { apiClient } from '@/core/api/client';

export interface CreateOrderRequest {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'limit' | 'market';
  price?: number;
  quantity: number;
}

export interface Order {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  status: 'pending' | 'filled' | 'cancelled';
  price: number;
  quantity: number;
  createdAt: string;
}

export const orderService = {
  async createOrder(request: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>('/orders', request);
    return response.data;
  },
  
  async getOrders(userId: string): Promise<Order[]> {
    const response = await apiClient.get<Order[]>(`/users/${userId}/orders`);
    return response.data;
  },
  
  async cancelOrder(orderId: string): Promise<void> {
    await apiClient.delete(`/orders/${orderId}`);
  },
};
```

### 3.2 Hook Pattern for API Calls

```tsx
// hooks/useOrders.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useOrders(userId: string) {
  return useQuery({
    queryKey: ['orders', userId],
    queryFn: () => orderService.getOrders(userId),
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orderService.createOrder,
    onSuccess: () => {
      // Invalidate orders query to refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
```

---

## 4. Responsive Design

### 4.1 Mobile-First Breakpoints

```tsx
// ✅ Always start with mobile, enhance for larger screens
<div className="
  w-full p-4              /* Mobile: full width, padding */
  md:w-1/2 md:p-6         /* Tablet: half width, more padding */
  lg:w-1/3 lg:p-8         /* Desktop: one-third, even more padding */
">
  {/* Content */}
</div>
```

### 4.2 Conditional Rendering for Complex Layouts

```tsx
function TradingView() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  if (isMobile) {
    return (
      <div className="flex flex-col">
        <OrderBook />
        <Chart />
        <OrderForm />
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-3 gap-4">
      <OrderBook />
      <Chart />
      <OrderForm />
    </div>
  );
}
```

---

## 5. Type Safety

### 5.1 Strict Type Definitions

```tsx
// types/trade.ts
export type OrderSide = 'buy' | 'sell';
export type OrderType = 'limit' | 'market';
export type OrderStatus = 'pending' | 'filled' | 'partially_filled' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  price: number;
  quantity: number;
  filledQuantity: number;
  createdAt: string;
  updatedAt: string;
}

// Use branded types for IDs to prevent mixing
export type OrderId = string & { readonly __brand: 'OrderId' };
export type UserId = string & { readonly __brand: 'UserId' };
```

### 5.2 API Response Types

```tsx
// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
  };
  timestamp: string;
}
```

---

## 6. Error Handling

### 6.1 Error Boundary Pattern

```tsx
// components/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    // Log to monitoring service
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center">
          <h2 className="text-xl font-bold text-red-600">Something went wrong</h2>
          <button 
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Try again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 6.2 API Error Handling

```tsx
// utils/errorHandler.ts
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function handleApiError(error: unknown): never {
  if (error instanceof ApiError) {
    // Show user-friendly message based on error code
    throw error;
  }
  
  if (error instanceof Error) {
    throw new ApiError('UNKNOWN_ERROR', error.message);
  }
  
  throw new ApiError('UNKNOWN_ERROR', 'An unexpected error occurred');
}
```

---

## 7. Security Patterns

### 7.1 Authentication Hook

```tsx
// hooks/useAuth.ts
import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) throw new Error('Login failed');
    
    const userData = await response.json();
    setUser(userData);
  };
  
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  };
  
  return { user, loading, login, logout, isAuthenticated: !!user };
}
```

### 7.2 Protected Route Pattern

```tsx
// components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
}
```

---

## 8. Testing Guidelines

### 8.1 Component Testing

```tsx
// OrderForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { OrderForm } from './OrderForm';

describe('OrderForm', () => {
  it('should disable submit when balance is insufficient', () => {
    const mockSubmit = jest.fn();
    
    render(
      <OrderForm 
        onSubmit={mockSubmit}
        balance={100}
        currentPrice={50}
      />
    );
    
    // Enter amount that exceeds balance
    const amountInput = screen.getByLabelText(/amount/i);
    fireEvent.change(amountInput, { target: { value: '3' } });
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    expect(submitButton).toBeDisabled();
    
    fireEvent.click(submitButton);
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});
```

---

## 9. Logging & Monitoring

### 9.1 Event Logging Pattern

```tsx
// utils/logger.ts
export enum LogLevel {
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export enum LogEvent {
  USER_LOGIN = 'user_login',
  ORDER_CREATED = 'order_created',
  ORDER_CANCELLED = 'order_cancelled',
  WITHDRAWAL_REQUESTED = 'withdrawal_requested',
  ADMIN_ACTION = 'admin_action',
}

interface LogData {
  event: LogEvent;
  userId?: string;
  metadata?: Record<string, any>;
}

export function log(level: LogLevel, data: LogData) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    ...data,
  };
  
  // In production, send to logging service
  console.log(JSON.stringify(logEntry));
  
  // For critical events, also send to monitoring
  if (level === LogLevel.ERROR) {
    // sendToMonitoring(logEntry);
  }
}

// Usage
log(LogLevel.INFO, {
  event: LogEvent.ORDER_CREATED,
  userId: user.id,
  metadata: { orderId: order.id, symbol: order.symbol },
});
```

---

## 10. Performance Optimization

### 10.1 Memoization

```tsx
// ✅ Expensive calculations
function OrderBook({ orders }: { orders: Order[] }) {
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.price - a.price);
  }, [orders]);
  
  return (
    <div>
      {sortedOrders.map(order => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}

// ✅ Prevent unnecessary re-renders
const OrderRow = memo(({ order }: { order: Order }) => {
  return <div>{/* Order details */}</div>;
});
```

### 10.2 Lazy Loading

```tsx
// routes.tsx
import { lazy, Suspense } from 'react';

const TradeView = lazy(() => import('@/features/trade/TradeView'));
const WalletView = lazy(() => import('@/features/wallet/WalletView'));

export function AppRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/trade" element={<TradeView />} />
        <Route path="/wallet" element={<WalletView />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 11. Code Quality Checklist

Before submitting any code, verify:

- [ ] **Mobile-first**: Does it work on 375px width?
- [ ] **Type-safe**: No `any` types, all props typed
- [ ] **Error handling**: Try-catch for async, error boundaries for components
- [ ] **Accessibility**: Semantic HTML, ARIA labels where needed
- [ ] **Performance**: Memoization for expensive operations
- [ ] **Logging**: Critical actions logged with proper events
- [ ] **Testing**: Unit tests for business logic
- [ ] **Separation**: UI, logic, and API calls properly separated
- [ ] **Pilot scope**: No features beyond defined scope

---

## 12. Common Anti-Patterns to Avoid

### ❌ Don't

```tsx
// Mixing concerns
function BadComponent() {
  const [data, setData] = useState();
  
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  
  return <div>{/* Complex UI with business logic */}</div>;
}

// Desktop-first
<div style={{ width: '1200px' }}>Content</div>

// Inline styles
<button style={{ backgroundColor: 'blue', color: 'white' }}>Click</button>

// Any types
function process(data: any) { }
```

### ✅ Do

```tsx
// Separated concerns
function GoodComponent() {
  const { data, loading, error } = useData();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return <DataDisplay data={data} />;
}

// Mobile-first
<div className="w-full md:w-1/2 lg:w-1/3">Content</div>

// Tailwind classes
<button className="bg-blue-600 text-white px-4 py-2 rounded">Click</button>

// Strict types
function process(data: UserData) { }
```

---

## 13. Next Steps

After reading this skill:

1. Review `cex-pilot-context.md` for project constraints
2. When building features:
   - Start with types (`types/`)
   - Create service layer (`services/`)
   - Build hooks (`hooks/`)
   - Implement components (`components/`)
3. Follow the patterns and examples provided above
4. Use the code quality checklist before completion

---

**This skill is a living document. Update it as new patterns emerge.**
