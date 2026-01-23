import { useState, useCallback, useEffect } from 'react'; // Added useEffect
import authService from '../services/authService';
import { KycSubmissionData } from '../../kyc/types'; // Import the new type

export const useAuth = () => {
    const [user, setUser] = useState<any>(() => {
        // Initialize user from local storage if available
        try {
            const storedUser = localStorage.getItem('user');
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            return null;
        }
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    const login = useCallback(async (username: string, password: string) => {
        setIsLoading(true);
        try {
            const loggedInUser = await authService.login(username, password);
            setUser(loggedInUser);
            // In a real app, you might set a token here too: localStorage.setItem('token', loggedInUser.token);
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
            // Set isKycCompleted to false for newly registered users
            setUser({ ...registeredUser, isKycCompleted: false });
            // In a real app, you might set a token here too: localStorage.setItem('token', registeredUser.token);
            return registeredUser;
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const sendOtp = useCallback(async (identifier: string) => {
        setIsLoading(true);
        try {
            await authService.sendOtp(identifier);
            return true;
        } catch (error) {
            console.error('Send OTP failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const verifyOtp = useCallback(async (identifier: string, otp: string) => {
        setIsLoading(true);
        try {
            await authService.verifyOtp(identifier, otp);
            return true;
        } catch (error) {
            console.error('Verify OTP failed:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const completeKyc = useCallback(async (profileData: KycSubmissionData) => { // Use KycSubmissionData type
        setIsLoading(true);
        try {
            await authService.completeKyc(profileData);
            console.log('KYC completed successfully.');
            // Update user state to reflect KYC completion
            setUser((prevUser: any) => prevUser ? { ...prevUser, isKycCompleted: true } : null);
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
            localStorage.removeItem('user'); // Clear user from local storage on logout
            // Also clear token if applicable: localStorage.removeItem('token');
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
        sendOtp,
        verifyOtp,
        completeKyc,
        logout,
        isAuthenticated: !!user,
        isKycCompleted: user?.isKycCompleted ?? false,
    } as const; // Add as const assertion
};
