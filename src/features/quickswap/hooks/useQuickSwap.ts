import { useState, useEffect, useCallback } from 'react';
import { quickSwapService } from '../services/quickSwapService';

interface Asset {
    fromAsset: string;
    toAsset: string;
    minAmount: string;
    maxAmount: string;
}

interface Quote {
    quoteId: string;
    fromAsset: string;
    toAsset: string;
    fromAmount: string;
    toAmount: string;
    rate: string;
    spread: string;
    expiresAt: string;
}

interface SwapHistoryItem {
    transactionId: string;
    fromAsset: string;
    toAsset: string;
    fromAmount: string;
    toAmount: string;
    timestamp: string;
}

export const useQuickSwap = (userId: string) => {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
    const [swapHistory, setSwapHistory] = useState<SwapHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch supported assets
    const fetchAssets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedAssets = await quickSwapService.getAssets();
            setAssets(fetchedAssets);
        } catch (err: any) { // Explicitly type err as any
            setError('Failed to fetch assets.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Request a new quote
    const requestQuote = useCallback(async (fromAsset: string, toAsset: string, amount: string) => {
        setLoading(true);
        setError(null);
        try {
            const quote = await quickSwapService.requestQuote(fromAsset, toAsset, amount);
            setCurrentQuote(quote);
            return quote;
        } catch (err: any) { // Explicitly type err as any
            setError('Failed to get quote. Please try again.');
            console.error(err);
            setCurrentQuote(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch swap history
    const fetchSwapHistory = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const history = await quickSwapService.getSwapHistory(userId);
            setSwapHistory(history);
        } catch (err: any) { // Explicitly type err as any
            setError('Failed to fetch swap history.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Execute a swap
    const executeSwap = useCallback(async (quoteId: string, slippageTolerance?: number) => {
        setLoading(true);
        setError(null);
        try {
            const result = await quickSwapService.executeSwap(quoteId, slippageTolerance);
            setCurrentQuote(null); // Clear quote after successful execution
            fetchSwapHistory(); // Refresh history
            return result;
        } catch (err: any) { // Explicitly type err as any
            setError('Swap execution failed. Quote might have expired or market moved.');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [fetchSwapHistory]); // Dependency for useCallback

    // Initial data fetch
    useEffect(() => {
        fetchAssets();
        fetchSwapHistory();
    }, [fetchAssets, fetchSwapHistory]);

    return {
        assets,
        currentQuote,
        swapHistory,
        loading,
        error,
        fetchAssets,
        requestQuote,
        executeSwap,
        fetchSwapHistory,
        setCurrentQuote // Allow clearing current quote from component
    };
};
