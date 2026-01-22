import { useState, useCallback } from 'react';
import authService from '../services/authService';

export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const loggedInUser = await authService.login(username, password);
            setUser(loggedInUser);
            return loggedInUser;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const registeredUser = await authService.register(username, password);
            setUser(registeredUser); // Log in the user automatically after registration
            return registeredUser;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const completeKyc = useCallback(async (profileData: any) => { // Use 'any' for profileData for now
        setIsLoading(true);
        try {
            await authService.completeKyc(profileData);
            console.log('KYC completed successfully.');
            // Optionally update user state to reflect KYC status
            return true;
        } catch (error) {
            console.error('KYC completion failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        user,
        isLoading,
        login,
        register,
        completeKyc,
        logout,
        isAuthenticated: !!user,
    };
};
