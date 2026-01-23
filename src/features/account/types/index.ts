export interface UserProfile {
    id: string;
    email: string;
    role: 'user' | 'admin';
    status: 'pending' | 'active' | 'suspended';
    createdAt: string;
    lastLogin?: string;
    name: string; // Added for mock user
    uid: string; // Added for mock user
    vipLevel: string; // Added for mock user
}

export interface UpdateProfileRequest {
    email?: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}
