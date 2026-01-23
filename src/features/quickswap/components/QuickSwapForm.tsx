import React, { useState, useEffect } from 'react';
import { useQuickSwap } from '../hooks/useQuickSwap';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export const QuickSwapForm: React.FC = () => {
    const { user } = useAuth(); // Get user from auth hook
    const userId = user?.id || 'guest'; // Placeholder user ID for now
    const { assets, currentQuote, loading, error, requestQuote, executeSwap, setCurrentQuote } = useQuickSwap(userId);

    const [fromAsset, setFromAsset] = useState('');
    const [toAsset, setToAsset] = useState('');
    const [amount, setAmount] = useState('');
    const [quoteCountdown, setQuoteCountdown] = useState(0);

    useEffect(() => {
        if (assets.length > 0) {
            setFromAsset(assets[0].fromAsset);
            setToAsset(assets[0].toAsset);
        }
    }, [assets]);

    useEffect(() => {
        let timer: number; // Changed NodeJS.Timeout to number
        if (currentQuote && currentQuote.expiresAt) {
            const expiryTime = new Date(currentQuote.expiresAt).getTime();
            const interval = setInterval(() => {
                const now = Date.now();
                const remaining = Math.max(0, Math.floor((expiryTime - now) / 1000));
                setQuoteCountdown(remaining);
                if (remaining === 0) {
                    clearInterval(interval);
                    setCurrentQuote(null); // Clear expired quote
                }
            }, 1000);
            timer = interval;
        }
        return () => clearInterval(timer);
    }, [currentQuote, setCurrentQuote]);

    const handleRequestQuote = async () => {
        if (!fromAsset || !toAsset || !amount || parseFloat(amount) <= 0) {
            alert('Please select assets and enter a valid amount.');
            return;
        }
        try {
            await requestQuote(fromAsset, toAsset, amount);
        } catch (e) {
            // Error handled by useQuickSwap hook, displayed via 'error' state
        }
    };

    const handleExecuteSwap = async () => {
        if (!currentQuote || quoteCountdown === 0) {
            alert('No active quote or quote expired. Please request a new quote.');
            return;
        }
        try {
            await executeSwap(currentQuote.quoteId);
            alert('Swap executed successfully!');
            setAmount(''); // Clear amount after successful swap
        } catch (e) {
            // Error handled by useQuickSwap hook
        }
    };

    const handleFlipAssets = () => {
        setFromAsset(toAsset);
        setToAsset(fromAsset);
        setCurrentQuote(null); // Clear quote as assets changed
    };

    if (loading && !currentQuote) {
        return <p>Loading assets...</p>;
    }

    return (
        <div className="space-y-4">
            {error && <p className="text-destructive">{error}</p>}

            <div>
                <label htmlFor="from-asset" className="block text-sm font-medium text-foreground">From Asset</label>
                <select
                    id="from-asset"
                    value={fromAsset}
                    onChange={(e) => { setFromAsset(e.target.value); setCurrentQuote(null); }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-input text-foreground"
                >
                    {assets.map(asset => (
                        <option key={asset.fromAsset} value={asset.fromAsset}>{asset.fromAsset}</option>
                    ))}
                </select>
            </div>

            <Button onClick={handleFlipAssets} variant="outline" className="w-full">
                Flip Assets
            </Button>

            <div>
                <label htmlFor="to-asset" className="block text-sm font-medium text-foreground">To Asset</label>
                <select
                    id="to-asset"
                    value={toAsset}
                    onChange={(e) => { setToAsset(e.target.value); setCurrentQuote(null); }}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md bg-input text-foreground"
                >
                    {assets.map(asset => (
                        <option key={asset.toAsset} value={asset.toAsset}>{asset.toAsset}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-foreground">Amount</label>
                <Input
                    id="amount"
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setCurrentQuote(null); }}
                    placeholder="Enter amount"
                    className="mt-1 block w-full"
                />
            </div>

            {currentQuote ? (
                <Card className="p-4 bg-secondary text-secondary-foreground">
                    <p className="text-lg font-semibold">Quote Details:</p>
                    <p>{currentQuote.fromAmount} {currentQuote.fromAsset} = {currentQuote.toAmount} {currentQuote.toAsset}</p>
                    <p>Rate: 1 {currentQuote.fromAsset} = {currentQuote.rate} {currentQuote.toAsset}</p>
                    <p>Expires in: {quoteCountdown} seconds</p>
                    <Button onClick={handleExecuteSwap} variant="default" className="mt-4 w-full" disabled={loading || quoteCountdown === 0}>
                        {loading ? 'Executing...' : 'Confirm Swap'}
                    </Button>
                    <Button onClick={() => setCurrentQuote(null)} variant="secondary" className="w-full mt-2">
                        Cancel Quote
                    </Button>
                </Card>
            ) : (
                <Button onClick={handleRequestQuote} variant="default" className="w-full" disabled={loading || !fromAsset || !toAsset || parseFloat(amount) <= 0}>
                    {loading ? 'Getting Quote...' : 'Get Quote'}
                </Button>
            )}
        </div>
    );
};
