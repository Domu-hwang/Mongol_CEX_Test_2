import React, { useEffect, useMemo } from 'react';
import { useQuickSwap } from '../hooks/useQuickSwap';
import { useAuth } from '@/features/auth/AuthContext';
import { ArrowRightLeft, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

// Utility function to format date header (e.g., "Thu Oct 08 2020")
const formatDateHeader = (date: Date): string => {
    return format(date, 'EEE MMM dd yyyy');
};

// Group swaps by date
const groupByDate = <T extends { timestamp: string }>(items: T[]): Map<string, T[]> => {
    const groups = new Map<string, T[]>();

    items.forEach(item => {
        const date = new Date(item.timestamp);
        const dateKey = format(date, 'yyyy-MM-dd');

        if (!groups.has(dateKey)) {
            groups.set(dateKey, []);
        }
        groups.get(dateKey)!.push(item);
    });

    return groups;
};

export const QuickSwapHistory: React.FC = () => {
    const { user } = useAuth();
    const userId = user?.id || 'guest';
    const { swapHistory, loading, error, fetchSwapHistory } = useQuickSwap(userId);

    useEffect(() => {
        fetchSwapHistory();
    }, [fetchSwapHistory]);

    // Group and sort swaps by date
    const groupedSwaps = useMemo(() => {
        const sorted = [...swapHistory].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        return groupByDate(sorted);
    }, [swapHistory]);

    if (loading) {
        return (
            <div
                className="flex flex-col items-start p-5 gap-2.5 w-full bg-[#0D0D0D] border border-[#6F7178] rounded-xl"
                style={{ isolation: 'isolate' }}
            >
                <p className="text-center text-muted-foreground w-full py-4">Loading swap history...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div
                className="flex flex-col items-start p-5 gap-2.5 w-full bg-[#0D0D0D] border border-[#6F7178] rounded-xl"
                style={{ isolation: 'isolate' }}
            >
                <p className="text-center text-destructive w-full py-4">Error: {error}</p>
            </div>
        );
    }

    return (
        <div
            className="flex flex-col items-start p-5 gap-4 w-full bg-[#0D0D0D] border border-[#6F7178] rounded-xl"
            style={{ isolation: 'isolate' }}
        >
            {swapHistory.length === 0 ? (
                <p className="text-center text-muted-foreground w-full py-4">No swap history.</p>
            ) : (
                <div className="flex flex-col gap-4 w-full">
                    {Array.from(groupedSwaps.entries()).map(([dateKey, swaps]) => (
                        <div key={dateKey} className="flex flex-col gap-3">
                            {/* Date Header */}
                            <p className="text-sm text-muted-foreground">
                                {formatDateHeader(new Date(swaps[0].timestamp))}
                            </p>

                            {/* Swaps for this date */}
                            {swaps.map((swap) => (
                                <div
                                    key={swap.transactionId}
                                    className="flex items-center gap-3 py-2"
                                >
                                    {/* Icon */}
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-success/10">
                                        <ArrowRightLeft className="h-5 w-5 text-success" />
                                    </div>

                                    {/* From Token */}
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">
                                            {swap.fromAsset}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {swap.fromAmount} {swap.fromAsset}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />

                                    {/* To Token */}
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0 text-right">
                                        <p className="text-sm font-medium text-foreground">
                                            {swap.toAsset}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {swap.toAmount} {swap.toAsset}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
