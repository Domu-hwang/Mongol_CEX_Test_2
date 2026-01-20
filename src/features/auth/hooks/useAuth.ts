import { useState, useCallback } from 'react';

// This is a skeleton hook for future implementation
// following the guideline: features/{module}/hooks/
export const useAuth = () => {
    const [user, setUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback(async (credentials: any) => {
        setIsLoading(true);
        try {
            // API call will be here (from ../services/authService)
            console.log('Logging in with', credentials);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
    }, []);

    return {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
    };
};
