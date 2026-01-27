import { useState, useEffect, useCallback, useMemo } from 'react';

export interface WalletBalance {
    currency: string;
    available: number;
    locked: number;
    total: number;
}

export interface WalletState {
    balances: WalletBalance[];
    isLoading: boolean;
    error: string | null;
}

// Mock wallet balances for demonstration
const MOCK_BALANCES: WalletBalance[] = [
    { currency: 'BTC', available: 0.5, locked: 0.05, total: 0.55 },
    { currency: 'ETH', available: 2.0, locked: 0.5, total: 2.5 },
    { currency: 'USDT', available: 5000, locked: 1000, total: 6000 },
    { currency: 'XRP', available: 1000, locked: 0, total: 1000 },
    { currency: 'LTC', available: 10, locked: 2, total: 12 },
];

export const useWallet = () => {
    const [balances, setBalances] = useState<WalletBalance[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Simulate fetching wallet balances from API
        const fetchBalances = setTimeout(() => {
            try {
                setBalances(MOCK_BALANCES);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to fetch wallet balances');
                setIsLoading(false);
            }
        }, 500);

        return () => clearTimeout(fetchBalances);
    }, []);

    const getBalance = useCallback(
        (currency: string): WalletBalance | undefined => {
            return balances.find((b) => b.currency === currency);
        },
        [balances]
    );

    const getAvailableBalance = useCallback(
        (currency: string): number => {
            const balance = getBalance(currency);
            return balance?.available ?? 0;
        },
        [getBalance]
    );

    const getLockedBalance = useCallback(
        (currency: string): number => {
            const balance = getBalance(currency);
            return balance?.locked ?? 0;
        },
        [getBalance]
    );

    const getTotalBalance = useCallback(
        (currency: string): number => {
            const balance = getBalance(currency);
            return balance?.total ?? 0;
        },
        [getBalance]
    );

    const updateBalance = useCallback((currency: string, newBalance: Partial<WalletBalance>) => {
        setBalances((prev) =>
            prev.map((b) =>
                b.currency === currency
                    ? {
                          ...b,
                          ...newBalance,
                          total: (newBalance.available ?? b.available) + (newBalance.locked ?? b.locked),
                      }
                    : b
            )
        );
    }, []);

    const totalPortfolioValue = useMemo(() => {
        // This would normally calculate total USD value using current prices
        // For now, returns sum of all totals (not accurate for different currencies)
        return balances.reduce((sum, b) => sum + b.total, 0);
    }, [balances]);

    const hasZeroBalance = useMemo(() => {
        return !isLoading && balances.every((b) => b.total === 0);
    }, [balances, isLoading]);

    return {
        balances,
        isLoading,
        error,
        getBalance,
        getAvailableBalance,
        getLockedBalance,
        getTotalBalance,
        updateBalance,
        totalPortfolioValue,
        hasZeroBalance,
    };
};
