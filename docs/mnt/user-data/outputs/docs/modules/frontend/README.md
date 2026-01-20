# Frontend Modules

## Overview

This directory contains documentation for all **frontend feature modules** in the CEX Pilot platform.

---

## Module List

- **[auth.md](./auth.md)** - Authentication (login, registration, session)
- **[trade.md](./trade.md)** - Trading interface (orders, order book, charts)
- **[wallet.md](./wallet.md)** - Wallet management (balances, deposits, withdrawals)
- **[account.md](./account.md)** - User account settings (profile, security)
- **[admin.md](./admin.md)** - Admin console (dashboard, user management)
- **[landing.md](./landing.md)** - Public pages (landing, terms, privacy)
- **[shared.md](./shared.md)** - Shared components (Button, Modal, etc.)

---

## Common Frontend Patterns

### 1. Component Structure

```typescript
// features/{module}/components/ComponentName.tsx
import { useState } from 'react';

interface ComponentNameProps {
  // Props with explicit types
  onSubmit: (data: FormData) => void;
  initialValue?: string;
}

export function ComponentName({ onSubmit, initialValue = '' }: ComponentNameProps) {
  // 1. Hooks at top
  const [value, setValue] = useState(initialValue);
  
  // 2. Derived state
  const isValid = value.length > 0;
  
  // 3. Event handlers
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({ value });
  };
  
  // 4. Render (mobile-first)
  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      {/* Content */}
    </form>
  );
}
```

### 2. Custom Hooks

```typescript
// features/{module}/hooks/useFeature.ts
import { useQuery } from '@tanstack/react-query';
import { featureService } from '../services/featureService';

export function useFeature(id: string) {
  return useQuery({
    queryKey: ['feature', id],
    queryFn: () => featureService.getById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCreateFeature() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: featureService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature'] });
    },
  });
}
```

### 3. API Services

```typescript
// features/{module}/services/featureService.ts
import { apiClient } from '@/core/api/client';
import type { Feature, CreateFeatureRequest } from '../types';

export const featureService = {
  async getAll(): Promise<Feature[]> {
    const response = await apiClient.get<Feature[]>('/api/features');
    return response.data;
  },
  
  async getById(id: string): Promise<Feature> {
    const response = await apiClient.get<Feature>(`/api/features/${id}`);
    return response.data;
  },
  
  async create(data: CreateFeatureRequest): Promise<Feature> {
    const response = await apiClient.post<Feature>('/api/features', data);
    return response.data;
  },
};
```

### 4. TypeScript Types

```typescript
// features/{module}/types/index.ts

// Domain types
export interface Feature {
  id: string;
  name: string;
  status: FeatureStatus;
  createdAt: string;
}

export type FeatureStatus = 'active' | 'inactive';

// Request/Response types
export interface CreateFeatureRequest {
  name: string;
}

export interface UpdateFeatureRequest {
  name?: string;
  status?: FeatureStatus;
}

// UI-specific types
export interface FeatureListFilters {
  status?: FeatureStatus;
  search?: string;
}
```

---

## State Management

### React Context Pattern

```typescript
// features/{module}/contexts/FeatureContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface FeatureContextValue {
  features: Feature[];
  addFeature: (feature: Feature) => void;
  removeFeature: (id: string) => void;
}

const FeatureContext = createContext<FeatureContextValue | null>(null);

export function FeatureProvider({ children }: { children: ReactNode }) {
  const [features, setFeatures] = useState<Feature[]>([]);
  
  const addFeature = (feature: Feature) => {
    setFeatures(prev => [...prev, feature]);
  };
  
  const removeFeature = (id: string) => {
    setFeatures(prev => prev.filter(f => f.id !== id));
  };
  
  return (
    <FeatureContext.Provider value={{ features, addFeature, removeFeature }}>
      {children}
    </FeatureContext.Provider>
  );
}

export function useFeatureContext() {
  const context = useContext(FeatureContext);
  if (!context) {
    throw new Error('useFeatureContext must be used within FeatureProvider');
  }
  return context;
}
```

### React Query Pattern

```typescript
// Prefer React Query for server state
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Read operations
const { data, isLoading, error } = useQuery({
  queryKey: ['features'],
  queryFn: fetchFeatures,
});

// Write operations
const mutation = useMutation({
  mutationFn: createFeature,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['features'] });
  },
});
```

---

## Styling Guidelines

### Tailwind Classes

```typescript
// ✅ Mobile-first
<div className="
  w-full p-4               /* Mobile */
  md:w-1/2 md:p-6          /* Tablet */
  lg:w-1/3 lg:p-8          /* Desktop */
">
  Content
</div>

// ✅ Responsive grid
<div className="
  grid grid-cols-1         /* Mobile: 1 column */
  md:grid-cols-2           /* Tablet: 2 columns */
  lg:grid-cols-3           /* Desktop: 3 columns */
  gap-4
">
  {items.map(item => <ItemCard key={item.id} {...item} />)}
</div>

// ❌ Avoid inline styles
<div style={{ width: '800px' }}>Bad</div>

// ❌ Avoid fixed widths
<div className="w-[800px]">Bad</div>
```

### Component Variants

```typescript
// Use className composition for variants
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const baseClasses = 'rounded font-medium transition-colors';

const variantClasses = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-600 text-white hover:bg-red-700',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({ 
  variant = 'primary', 
  size = 'md',
  children,
  ...props 
}: ButtonProps) {
  const className = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
  `;
  
  return <button className={className} {...props}>{children}</button>;
}
```

---

## Error Handling

### Component Error Boundaries

```typescript
// shared/components/ErrorBoundary.tsx
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
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || <DefaultErrorFallback />;
    }
    
    return this.props.children;
  }
}

// Usage
<ErrorBoundary fallback={<CustomError />}>
  <FeatureComponent />
</ErrorBoundary>
```

### API Error Handling

```typescript
// Always handle errors in hooks
export function useFeature(id: string) {
  const { data, error, isLoading } = useQuery({
    queryKey: ['feature', id],
    queryFn: () => featureService.getById(id),
  });
  
  // Component can check error state
  if (error) {
    return { data: null, error, isLoading: false };
  }
  
  return { data, error: null, isLoading };
}

// In component
const { data, error, isLoading } = useFeature(id);

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
if (!data) return <EmptyState />;

return <FeatureDisplay data={data} />;
```

---

## Loading States

### Skeleton Loaders

```typescript
// Prefer skeletons over spinners for better UX
export function FeatureCardSkeleton() {
  return (
    <div className="animate-pulse space-y-4 p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  );
}

// Usage
{isLoading ? (
  <FeatureCardSkeleton />
) : (
  <FeatureCard data={data} />
)}
```

### Progressive Loading

```typescript
// Load critical data first, then secondary data
export function DashboardView() {
  const { data: user } = useUser(); // Critical
  const { data: stats } = useStats(); // Secondary
  
  if (!user) return <LoadingSpinner />; // Block on critical data
  
  return (
    <div>
      <UserHeader user={user} />
      {stats ? (
        <StatsPanel stats={stats} />
      ) : (
        <StatsPanelSkeleton /> // Show skeleton for secondary
      )}
    </div>
  );
}
```

---

## Form Handling

### Controlled Forms with Validation

```typescript
import { useState } from 'react';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Validate
    const result = formSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] || '',
        password: fieldErrors.password?.[0] || '',
      });
      return;
    }
    
    // Submit
    mutation.mutate(result.data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
      />
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        error={errors.password}
      />
      <Button type="submit">Login</Button>
    </form>
  );
}
```

---

## Testing

### Component Tests

```typescript
// features/{module}/components/__tests__/ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from '../ComponentName';

describe('ComponentName', () => {
  it('should render with initial value', () => {
    render(<ComponentName initialValue="test" />);
    expect(screen.getByDisplayValue('test')).toBeInTheDocument();
  });
  
  it('should call onSubmit when form is valid', () => {
    const mockSubmit = jest.fn();
    render(<ComponentName onSubmit={mockSubmit} />);
    
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockSubmit).toHaveBeenCalledWith({ value: 'test' });
  });
});
```

### Hook Tests

```typescript
// features/{module}/hooks/__tests__/useFeature.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useFeature } from '../useFeature';

describe('useFeature', () => {
  it('should fetch feature data', async () => {
    const { result } = renderHook(() => useFeature('123'));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.data).toBeDefined();
  });
});
```

---

## Performance Optimization

### Memoization

```typescript
import { useMemo, memo } from 'react';

// Memoize expensive calculations
function FeatureList({ features }: { features: Feature[] }) {
  const sortedFeatures = useMemo(() => {
    return [...features].sort((a, b) => a.name.localeCompare(b.name));
  }, [features]);
  
  return (
    <div>
      {sortedFeatures.map(feature => (
        <FeatureCard key={feature.id} feature={feature} />
      ))}
    </div>
  );
}

// Memoize components
export const FeatureCard = memo(({ feature }: { feature: Feature }) => {
  return <div>{feature.name}</div>;
});
```

### Code Splitting

```typescript
// routes.tsx
import { lazy, Suspense } from 'react';

const TradeView = lazy(() => import('@/features/trade/TradeView'));
const WalletView = lazy(() => import('@/features/wallet/WalletView'));

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/trade" element={<TradeView />} />
        <Route path="/wallet" element={<WalletView />} />
      </Routes>
    </Suspense>
  );
}
```

---

## Accessibility

### ARIA Labels and Roles

```typescript
// Always provide meaningful labels
<button aria-label="Close dialog" onClick={onClose}>
  <XIcon />
</button>

// Use semantic HTML
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><Link to="/trade">Trade</Link></li>
    <li><Link to="/wallet">Wallet</Link></li>
  </ul>
</nav>

// Form accessibility
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-invalid={!!error}
  aria-describedby={error ? "email-error" : undefined}
/>
{error && <span id="email-error" role="alert">{error}</span>}
```

---

## Module Checklist

Before considering a module complete:

- [ ] All components documented with JSDoc comments
- [ ] TypeScript types defined (no `any`)
- [ ] Mobile-first responsive design
- [ ] Error states handled
- [ ] Loading states implemented
- [ ] Empty states provided
- [ ] Form validation in place
- [ ] Accessibility labels added
- [ ] Tests written (minimum 80% coverage)
- [ ] Public API exported via `index.ts`

---

## Related Documents

- `../README.md` - Module common rules
- `../ARCHITECTURE.md` - System architecture
- Individual module docs: `auth.md`, `trade.md`, etc.
