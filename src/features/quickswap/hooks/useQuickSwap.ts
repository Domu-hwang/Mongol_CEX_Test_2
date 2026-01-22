import { useState, useEffect, useCallback } from 'react';
import { quickSwapService } from '../services/quickSwapService';
import { QuickSwapAsset, QuickSwapQuote, QuickSwapHistoryItem } from '../types'; // Import types

// Remove local interface definitions as they are now imported

export const useQuickSwap = (userId: string) => {
    const [assets, setAssets] = useState<QuickSwapAsset[]>([]);
    const [currentQuote, setCurrentQuote] = useState<QuickSwapQuote | null>(null);
    const [swapHistory, setSwapHistory] = useState<QuickSwapHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch supported assets
    const fetchAssets = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const fetchedAssets: QuickSwapAsset[] = await quickSwapService.getAssets() as QuickSwapAsset[]; // Explicit cast
            setAssets(fetchedAssets);
        } catch (err: any) {
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
            const quote: QuickSwapQuote = await quickSwapService.requestQuote(fromAsset, toAsset, amount) as QuickSwapQuote; // Explicit cast
            setCurrentQuote(quote);
            return quote;
        } catch (err: any) {
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
            const history: QuickSwapHistoryItem[] = await quickSwapService.getSwapHistory(userId) as QuickSwapHistoryItem[]; // Explicit cast
            setSwapHistory(history);
        } catch (err: any) {
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
