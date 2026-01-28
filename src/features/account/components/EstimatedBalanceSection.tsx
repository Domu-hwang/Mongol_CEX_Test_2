import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye, EyeOff, Plus, ArrowUpRight, ArrowRightLeft } from 'lucide-react'; // Added ArrowRightLeft icon
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { Skeleton } from '@/components/ui/skeleton';

const EstimatedBalanceSection: React.FC = () => {
    const navigate = useNavigate();
    const [isHidden, setIsHidden] = useState(false);
    const { balances, isLoading } = useWallet();

    // Calculate estimated total (simplified - in real app would use price data)
    const estimatedBTC = balances.reduce((sum, b) => {
        if (b.currency === 'BTC') return sum + b.total;
        // Simplified conversion - in reality would use actual exchange rates
        return sum;
    }, 0);

    const estimatedUSD = balances.reduce((sum, b) => {
        // Mock USD values - in reality would fetch from price API
        const mockPrices: Record<string, number> = {
            BTC: 65000,
            ETH: 3500,
            USDT: 1,
            XRP: 0.5,
            LTC: 80,
        };
        return sum + b.total * (mockPrices[b.currency] || 0);
    }, 0);

    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-6 w-40" />
                    <div className="flex items-center space-x-2">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
                <Skeleton className="h-9 w-32 mb-2" />
                <Skeleton className="h-4 w-24" />
            </Card>
        );
    }

    return (
        <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold text-foreground">Estimated Balance</h3>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/wallet/deposit')}
                        className="gap-1"
                    >
                        <Plus className="h-4 w-4" />
                        Add Fund
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/wallet/withdraw')}
                        className="gap-1"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                        Withdraw
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate('/wallet/transfer')} // Added navigation for transfer
                        className="gap-1"
                    >
                        <ArrowRightLeft className="h-4 w-4" /> {/* Added Transfer icon */}
                        Transfer
                    </Button>
                </div>
            </div>
            <div className="flex items-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-foreground tabular-nums">
                    {isHidden ? '****' : estimatedBTC.toFixed(8)}
                </span>
                <span className="text-lg text-muted-foreground">BTC</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <button
                    onClick={() => setIsHidden(!isHidden)}
                    className="p-1 hover:bg-muted rounded transition-colors"
                >
                    {isHidden ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                </button>
            </div>
            <p className="text-muted-foreground text-sm tabular-nums">
                {isHidden ? '≈ $****' : `≈ $${estimatedUSD.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
            <p className="text-muted-foreground text-sm">
                Today's P&L{' '}
                <span className="text-success font-medium">+ $0.00 (0.00%)</span>
            </p>
        </Card>
    );
};

export default EstimatedBalanceSection;
