import React, { useState, useEffect } from 'react';
import { useQuickSwap } from '../hooks/useQuickSwap';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/Card';
import { ArrowDownUp, ChevronDown, Clock, Info } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export const QuickSwapForm: React.FC = () => {
    const { user } = useAuth();
    const userId = user?.id || 'guest';
    const { assets, currentQuote, loading, error, requestQuote, executeSwap, setCurrentQuote } = useQuickSwap(userId);

    const [fromAsset, setFromAsset] = useState('');
    const [toAsset, setToAsset] = useState('');
    const [amount, setAmount] = useState('');
    const [quoteCountdown, setQuoteCountdown] = useState(0);

    // Mock balance data - replace with actual balance from API
    const mockBalances: Record<string, number> = {
        'BTC': 0.5,
        'ETH': 2.0,
        'USDT': 1000,
        'MNT': 50000,
    };

    useEffect(() => {
        if (assets.length > 0) {
            setFromAsset(assets[0].fromAsset);
            setToAsset(assets[0].toAsset);
        }
    }, [assets]);

    useEffect(() => {
        let timer: number;
        if (currentQuote && currentQuote.expiresAt) {
            const expiryTime = new Date(currentQuote.expiresAt).getTime();
            const interval = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
                setQuoteCountdown(remaining);
                if (remaining === 0) {
                    clearInterval(interval);
                    setCurrentQuote(null);
                }
            }, 1000);
            timer = interval;
        }
        return () => clearInterval(timer);
    }, [currentQuote, setCurrentQuote]);

    const handleRequestQuote = async () => {
        if (!fromAsset || !toAsset || !amount || parseFloat(amount) <= 0) {
            return;
        }
        try {
            await requestQuote(fromAsset, toAsset, amount);
        } catch (e) {
            // Error handled by useQuickSwap hook
        }
    };

    const handleExecuteSwap = async () => {
        if (!currentQuote || quoteCountdown === 0) {
            return;
        }
        try {
            await executeSwap(currentQuote.quoteId);
            setAmount('');
        } catch (e) {
            // Error handled by useQuickSwap hook
        }
    };

    const handleFlipAssets = () => {
        const tempFrom = fromAsset;
        setFromAsset(toAsset);
        setToAsset(tempFrom);
        setCurrentQuote(null);
    };

    const handleMaxClick = () => {
        const balance = mockBalances[fromAsset] || 0;
        setAmount(balance.toString());
        setCurrentQuote(null);
    };

    const handleHalfClick = () => {
        const balance = mockBalances[fromAsset] || 0;
        setAmount((balance / 2).toString());
        setCurrentQuote(null);
    };

    const fromBalance = mockBalances[fromAsset] || 0;
    const toBalance = mockBalances[toAsset] || 0;
    const estimatedOutput = currentQuote ? currentQuote.toAmount : (amount && parseFloat(amount) > 0 ? '—' : '0');

    if (loading && !currentQuote && assets.length === 0) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {/* From Token Section */}
            <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">From</span>
                    <span className="text-xs text-muted-foreground">
                        Balance: {fromBalance.toLocaleString()} {fromAsset}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Amount Input */}
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => { setAmount(e.target.value); setCurrentQuote(null); }}
                        placeholder="0.00"
                        className="flex-1 text-2xl font-semibold bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                    />

                    {/* Token Selector */}
                    <Select value={fromAsset} onValueChange={(value) => { setFromAsset(value); setCurrentQuote(null); }}>
                        <SelectTrigger className="w-[130px] bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {assets.map(asset => (
                                <SelectItem key={asset.fromAsset} value={asset.fromAsset}>
                                    {asset.fromAsset}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Quick Amount Buttons */}
                <div className="flex items-center gap-2 mt-3">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleHalfClick}
                        className="h-7 text-xs px-3"
                    >
                        50%
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleMaxClick}
                        className="h-7 text-xs px-3"
                    >
                        MAX
                    </Button>
                </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-1 relative z-10">
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={handleFlipAssets}
                    className="rounded-full h-10 w-10 bg-background border-border hover:bg-muted"
                >
                    <ArrowDownUp className="h-4 w-4" />
                </Button>
            </div>

            {/* To Token Section */}
            <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">To</span>
                    <span className="text-xs text-muted-foreground">
                        Balance: {toBalance.toLocaleString()} {toAsset}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Estimated Output (Read-only) */}
                    <div className="flex-1 text-2xl font-semibold text-foreground">
                        {estimatedOutput}
                    </div>

                    {/* Token Selector */}
                    <Select value={toAsset} onValueChange={(value) => { setToAsset(value); setCurrentQuote(null); }}>
                        <SelectTrigger className="w-[130px] bg-background border-border">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            {assets.map(asset => (
                                <SelectItem key={asset.toAsset} value={asset.toAsset}>
                                    {asset.toAsset}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Quote Details */}
            {currentQuote && (
                <div className="p-3 bg-muted/30 rounded-lg border border-border space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Rate</span>
                        <span className="text-foreground">
                            1 {currentQuote.fromAsset} = {currentQuote.rate} {currentQuote.toAsset}
                        </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Quote expires
                        </span>
                        <span className={quoteCountdown <= 10 ? 'text-destructive' : 'text-foreground'}>
                            {quoteCountdown}s
                        </span>
                    </div>
                </div>
            )}

            {/* Action Button */}
            {currentQuote ? (
                <div className="space-y-2">
                    <Button
                        onClick={handleExecuteSwap}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium h-12"
                        disabled={loading || quoteCountdown === 0}
                    >
                        {loading ? 'Executing...' : 'Confirm Swap'}
                    </Button>
                    <Button
                        onClick={() => setCurrentQuote(null)}
                        variant="ghost"
                        className="w-full text-muted-foreground"
                    >
                        Cancel
                    </Button>
                </div>
            ) : (
                <Button
                    onClick={handleRequestQuote}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium h-12"
                    disabled={loading || !fromAsset || !toAsset || !amount || parseFloat(amount) <= 0}
                >
                    {loading ? 'Getting Quote...' : 'Get Quote'}
                </Button>
            )}

            {/* Info Notice */}
            <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">
                    Quotes are valid for 30 seconds. Final rate may vary slightly due to market conditions.
                </p>
            </div>
        </div>
    );
};
