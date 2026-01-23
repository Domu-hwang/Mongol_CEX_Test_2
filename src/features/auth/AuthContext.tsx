import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth as useAuthHook } from './hooks/useAuth';
import { KycSubmissionData } from '../kyc/types';

interface AuthContextType {
    isAuthenticated: boolean;
    isKycCompleted: boolean;
    user: any;
    login: (username: string, password: string) => Promise<any>;
    register: (username: string, password: string) => Promise<any>;
    logout: () => Promise<void>;
    sendOtp: (identifier: string) => Promise<boolean>;
    verifyOtp: (identifier: string, otp: string) => Promise<boolean>;
    completeKyc: (profileData: KycSubmissionData) => Promise<boolean>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const auth = useAuthHook();

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
