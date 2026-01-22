# Account Module (Frontend)

## 1. Overview

The Account module handles **user profile management, security settings, and quick asset exchanges**.

**Purpose:**
- Display and edit user profile information
- Change password
- Manage security settings
- Perform quick cryptocurrency swaps
- Configure notifications (future)
- View account activity log (future)

**Scope:**
- ✅ Profile display and editing
- ✅ Password change
- ✅ Basic security settings
- ✅ Quick Swap functionality
- ❌ 2FA setup (structure only, not enforced)
- ❌ KYC submission (future)

---

## 2. Structure

```
src/features/account/
├── components/
│   ├── AccountView.tsx           # Main account page
│   ├── ProfileSection.tsx        # User profile info
│   ├── SecuritySection.tsx       # Security settings
│   ├── PasswordChangeForm.tsx    # Change password
│   ├── QuickSwapForm.tsx         # Quick swap interface
│   ├── TwoFactorSetup.tsx        # 2FA setup (future)
│   └── NotificationSettings.tsx  # Notification preferences
│
├── hooks/
│   ├── useProfile.ts             # User profile data
│   ├── useUpdateProfile.ts       # Update profile mutation
│   ├── useChangePassword.ts      # Change password mutation
│   └── useQuickSwap.ts           # Quick swap functionality
│
├── services/
│   └── accountService.ts         # Account API calls
│
└── types/
    └── index.ts                  # TypeScript types
```

---

## 3. Data Models

```typescript
export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  status: 'pending' | 'active' | 'suspended';
  createdAt: string;
  lastLogin?: string;
}

export interface UpdateProfileRequest {
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}
```

---

## 4. Key Components

### AccountView

```typescript
export function AccountView() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="quick-swap">Quick Swap</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <ProfileSection user={user} />
        </TabsContent>
        
        <TabsContent value="security">
          <SecuritySection />
        </TabsContent>

        <TabsContent value="quick-swap">
          {/* <QuickSwapForm /> */}
          <p>Quick Swap functionality will be implemented here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### PasswordChangeForm

```typescript
export function PasswordChangeForm() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const changePassword = useChangePassword();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await changePassword.mutateAsync({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
      
      toast.success('Password changed successfully');
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="password"
        label="Current Password"
        value={formData.currentPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
      />
      
      <Input
        type="password"
        label="New Password"
        value={formData.newPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
      />
      
      <Input
        type="password"
        label="Confirm New Password"
        value={formData.confirmPassword}
        onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
      />
      
      <Button type="submit" disabled={changePassword.isLoading}>
        {changePassword.isLoading ? 'Changing...' : 'Change Password'}
      </Button>
    </form>
  );
}
```

---

## 5. API Contracts

```typescript
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/change-password
POST   /api/quick-swap/execute
```

---

## 6. Related Documents

- `../README.md` - Frontend patterns
- `auth.md` - Authentication module
