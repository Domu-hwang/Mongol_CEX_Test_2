import { useState, useEffect } from 'react';
import { accountService } from '../services/accountService';
import { UserProfile } from '../types';

export const useProfile = () => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profile = await accountService.fetchUserProfile();
                setUser(profile);
            } catch (err) {
                setError('Failed to fetch user profile');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    return { user, isLoading, error };
};

export const useUpdateProfile = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutateAsync = async (data: { email?: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            const updatedProfile = await accountService.updateProfile(data);
            setIsLoading(false);
            return updatedProfile;
        } catch (err) {
            setError('Failed to update profile');
            setIsLoading(false);
            throw err;
        }
    };

    return { mutateAsync, isLoading, error };
};

export const useChangePassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const mutateAsync = async (data: { currentPassword: string; newPassword: string }) => {
        setIsLoading(true);
        setError(null);
        try {
            await accountService.changePassword(data);
            setIsLoading(false);
        } catch (err) {
            setError('Failed to change password');
            setIsLoading(false);
            throw err;
        }
    };

    return { mutateAsync, isLoading, error };
};
