# Auth Module (Frontend)

## 1. Overview

The Auth module handles **user authentication and session management** for the CEX Pilot platform.

**Purpose:**
- User registration with email verification
- Login and logout
- Session persistence
- Protected route access

**Scope:**
- ✅ Email/password authentication
- ✅ JWT token management
- ✅ Session persistence (7 days)
- ❌ Social login (out of scope for Pilot)
- ❌ 2FA (structure only, not enforced)

---

## 2. Responsibilities

### What This Module Does
- Render login and registration forms
- Validate user credentials
- Manage authentication state globally
- Store and refresh JWT tokens
- Provide authentication context to other modules
- Handle email verification flow

### What This Module Does NOT Do
- User profile management (see `account` module)
- Password reset (future enhancement)
- Role-based access control logic (see `core/routing`)

---

## 3. Structure

```
src/features/auth/
├── components/
│   ├── LoginForm.tsx              # Login form UI
│   ├── RegisterForm.tsx           # Registration form UI
│   ├── VerificationCodeInput.tsx  # 6-digit code input
│   ├── AuthLayout.tsx             # Shared layout for auth pages
│   └── __tests__/
│       ├── LoginForm.test.tsx
│       └── RegisterForm.test.tsx
│
├── hooks/
│   ├── useAuth.ts                 # Main auth hook (context)
│   ├── useLogin.ts                # Login mutation
│   ├── useRegister.ts             # Registration mutation
│   └── useVerifyEmail.ts          # Email verification mutation
│
├── services/
│   └── authService.ts             # API calls
│
├── types/
│   └── index.ts                   # TypeScript types
│
├── contexts/
│   └── AuthContext.tsx            # Auth state provider
│
└── index.ts                       # Public exports
```

---

## 4. API / Interface

### Public Exports

```typescript
// index.ts
export { LoginForm, RegisterForm, AuthLayout } from './components';
export { useAuth, useLogin, useRegister } from './hooks';
export { AuthProvider } from './contexts/AuthContext';
export type { User, LoginRequest, RegisterRequest } from './types';
```

### Components

#### LoginForm

```typescript
interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps)
```

**Usage:**
```typescript
<LoginForm
  onSuccess={() => console.log('Login successful')}
  redirectTo="/trade"
/>
```

#### RegisterForm

```typescript
interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps)
```

### Hooks

#### useAuth

```typescript
interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

export function useAuth(): UseAuthReturn
```

**Usage:**
```typescript
function ProtectedPage() {
  const { user, isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

#### useLogin

```typescript
interface UseLoginReturn {
  mutate: (data: LoginRequest) => void;
  mutateAsync: (data: LoginRequest) => Promise<LoginResponse>;
  isLoading: boolean;
  error: Error | null;
}

export function useLogin(): UseLoginReturn
```

---

## 5. Dependencies

### External Dependencies
- `react` - Core React library
- `@tanstack/react-query` - Data fetching and caching
- `react-router-dom` - Navigation after auth
- `zod` - Form validation

### Internal Dependencies
- `@/core/api/client` - HTTP client for API calls
- `@/shared/components/Input` - Form input component
- `@/shared/components/Button` - Button component
- `@/shared/components/Toast` - Notification system

---

## 6. Data Models

### TypeScript Types

```typescript
// types/index.ts

export interface User {
  id: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  message: string;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### API Contracts

**Login:**
```typescript
POST /api/auth/login
Request: { email: string, password: string }
Response: { accessToken: string, user: User }
```

**Register:**
```typescript
POST /api/auth/register
Request: { email: string, password: string }
Response: { user: User, message: "Verification code sent" }
```

**Verify Email:**
```typescript
POST /api/auth/verify-email
Request: { email: string, code: string }
Response: { accessToken: string, user: User }
```

**Get Current User:**
```typescript
GET /api/auth/me
Headers: { Authorization: "Bearer <token>" }
Response: { user: User }
```

**Logout:**
```typescript
POST /api/auth/logout
Headers: { Authorization: "Bearer <token>" }
Response: { message: "Logged out successfully" }
```

---

## 7. Implementation Examples

### AuthContext Implementation

```typescript
// contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/authService';
import type { User, LoginRequest, RegisterRequest } from '../types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Session check failed:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async ({ email, password }: LoginRequest) => {
    const response = await authService.login(email, password);
    localStorage.setItem('accessToken', response.accessToken);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    await authService.register(data);
    // Note: User must verify email before they're logged in
  };

  const logout = async () => {
    await authService.logout();
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### LoginForm Implementation

```typescript
// components/LoginForm.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { toast } from 'react-hot-toast';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export function LoginForm({ onSuccess, redirectTo = '/dashboard' }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        email: fieldErrors.email?.[0] || '',
        password: fieldErrors.password?.[0] || '',
      });
      return;
    }

    // Submit
    setIsSubmitting(true);
    setErrors({});
    
    try {
      await login(result.data);
      toast.success('Login successful!');
      onSuccess?.();
      navigate(redirectTo);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || 'Login failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
        error={errors.email}
        autoComplete="email"
      />
      
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
        error={errors.password}
        autoComplete="current-password"
      />

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}
```

### Auth Service Implementation

```typescript
// services/authService.ts
import { apiClient } from '@/core/api/client';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  User,
} from '../types';

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/api/auth/register', data);
    return response.data;
  },

  async verifyEmail(data: VerifyEmailRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/api/auth/verify-email', data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<{ user: User }>('/api/auth/me');
    return response.data.user;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },
};
```

---

## 8. Testing

### Component Tests

```typescript
// components/__tests__/LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginForm } from '../LoginForm';
import { AuthProvider } from '../../contexts/AuthContext';

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

describe('LoginForm', () => {
  it('should render email and password inputs', () => {
    render(<LoginForm />, { wrapper: Wrapper });
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should show validation errors for invalid inputs', async () => {
    render(<LoginForm />, { wrapper: Wrapper });
    
    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should call onSuccess after successful login', async () => {
    const mockOnSuccess = jest.fn();
    render(<LoginForm onSuccess={mockOnSuccess} />, { wrapper: Wrapper });
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
```

### Hook Tests

```typescript
// hooks/__tests__/useAuth.test.ts
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { AuthProvider } from '../../contexts/AuthContext';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('should initialize with no user', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    await waitFor(() => {
      expect(result.current.user).not.toBeNull();
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // First login
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password123',
      });
    });
    
    // Then logout
    await act(async () => {
      await result.current.logout();
    });
    
    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

---

## 9. Security Considerations

### Token Storage

```typescript
// Store JWT in localStorage
// Note: In production, consider httpOnly cookies for better security
localStorage.setItem('accessToken', token);

// Add token to all API requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Password Validation

```typescript
// Enforce strong passwords
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
```

### Session Expiry Handling

```typescript
// Intercept 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear session
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 10. Future Enhancements

**Post-Pilot Features:**
- [ ] Password reset flow
- [ ] 2FA enforcement
- [ ] Social login (Google, Apple)
- [ ] Remember device functionality
- [ ] Email change with verification
- [ ] Account recovery options
- [ ] Security activity log

---

## 11. Related Documents

- `../README.md` - Frontend common patterns
- `../account.md` - User account management
- `../../backend/auth.md` - Auth backend service
- `../../ARCHITECTURE.md` - System architecture

---

## 12. Troubleshooting

### Common Issues

**Issue: "Token expired" error immediately after login**
- Check that JWT expiry is set correctly (7 days)
- Verify server and client clocks are synchronized

**Issue: Session not persisting across page refreshes**
- Ensure `localStorage.setItem()` is called after login
- Check that `AuthProvider` runs session check on mount

**Issue: Login form shows stale error after successful login**
- Clear error state in `handleSubmit` before calling `login()`
- Use React Query's `onSuccess` callback to clear errors

---

**This module is the foundation of user identity management in CEX Pilot.**
