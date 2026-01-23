import { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from '../types';

// Mock API functions for account services
const fetchUserProfile = async (): Promise<UserProfile> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: 'user-123',
                email: 'user@example.com',
                role: 'user',
                status: 'active',
                createdAt: '2023-01-01T10:00:00Z',
                lastLogin: '2024-01-23T11:00:00Z',
                name: 'User-6cb43',
                uid: '1195386612',
                vipLevel: 'Regular User',
                following: 0,
                followers: 0,
            });
        }, 500);
    });
};

const updateProfile = async (data: UpdateProfileRequest): Promise<UserProfile> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Updating profile with:', data);
            resolve({
                id: 'user-123',
                email: data.email || 'user@example.com',
                role: 'user',
                status: 'active',
                createdAt: '2023-01-01T10:00:00Z',
                lastLogin: '2024-01-23T11:00:00Z',
                name: 'User-6cb43', // Assuming a default name for mock updates
                uid: '1195386612',
                vipLevel: 'Regular User',
                following: 0,
                followers: 0,
            });
        }, 500);
    });
};

const changePassword = async (data: ChangePasswordRequest): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Changing password with:', data);
            if (data.currentPassword === 'oldpassword') { // Mock check
                resolve();
            } else {
                reject(new Error('Incorrect current password'));
            }
        }, 500);
    });
};

export const accountService = {
    fetchUserProfile,
    updateProfile,
    changePassword,
};
