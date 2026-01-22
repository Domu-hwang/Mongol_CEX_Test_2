import { useState, useEffect } from 'react';

export const useWallet = () => {
    // Mock user balance. In a real application, this would come from an API.
    const [balance, setBalance] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulate fetching balance
        const fetchBalance = setTimeout(() => {
            // For demonstration, let's say the user initially has 0 balance
            setBalance(0);
            setIsLoading(false);
        }, 500); // Simulate network request

        return () => clearTimeout(fetchBalance);
    }, []);

    // Function to simulate updating balance (e.g., after a deposit)
    const updateBalance = (newBalance: number) => {
        setBalance(newBalance);
    };

    return {
        balance,
        isLoading,
        updateBalance,
        hasZeroBalance: balance === 0 && !isLoading, // True if balance is 0 and not loading
    };
};
