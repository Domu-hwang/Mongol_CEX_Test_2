import React, { useEffect } from 'react';
import { useQuickSwap } from '../hooks/useQuickSwap';
import { useAuth } from '@/features/auth/AuthContext';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';

export const QuickSwapHistory: React.FC = () => {
    const { user } = useAuth();
    const userId = user?.id || 'guest';
    const { swapHistory, loading, error, fetchSwapHistory } = useQuickSwap(userId);

    useEffect(() => {
        fetchSwapHistory(); // Initial fetch and refetch if dependencies change
    }, [fetchSwapHistory]);

    if (loading) {
        return <p>Loading swap history...</p>;
    }

    if (error) {
        return <p className="text-destructive">Error: {error}</p>;
    }

    if (swapHistory.length === 0) {
        return <p>No swap history found.</p>;
    }

    return (
        <div className="space-y-4">
            {swapHistory.map((swap) => (
                <Card key={swap.transactionId} className="p-4">
                    <p className="font-semibold">Transaction ID: {swap.transactionId}</p>
                    <p>
                        {swap.fromAmount} {swap.fromAsset} swapped for {swap.toAmount} {swap.toAsset}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Date: {format(new Date(swap.timestamp), 'PPP p')}
                    </p>
                </Card>
            ))}
        </div>
    );
};
