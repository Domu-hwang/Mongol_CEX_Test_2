import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2, ArrowRight, Wallet } from 'lucide-react';
import NetworkSelector from './NetworkSelector';
import { useTransaction } from '../hooks/useTransaction';
import { useWallet } from '../hooks/useWallet';
import {
    getSupportedCurrencies,
    getCurrencyInfo,
    formatAmount,
} from '@/constants/cryptoPolicy';
import { VerticalStepper } from '@/components/ui/VerticalStepper';

interface WithdrawFormProps {
    onWithdraw?: (currency: string, amount: number, address: string, network: string) => void;
    isLoading?: boolean;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw, isLoading = false }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const { getAvailableBalance, isLoading: isWalletLoading } = useWallet();

    const steps = [
        { label: 'Select Crypto', description: 'Choose the cryptocurrency to withdraw' },
        { label: 'Select Network', description: 'Choose the network for your withdrawal' },
        { label: 'Enter Details', description: 'Enter amount and recipient address' },
    ];

    const supportedCurrencies = useMemo(() => getSupportedCurrencies(), []);

    // Initialize useTransaction with available balance
    const {
        currency,
        network,
        amount,
        address,
        networks,
        networkPolicy,
        currencyInfo,
        fee,
        receiveAmount,
        isValid,
        errors,
        setCurrency,
        setNetwork,
        setAmount,
        setAddress,
        handleMaxClick,
        getFieldError,
        reset,
    } = useTransaction({
        type: 'withdraw',
        availableBalance: getAvailableBalance(supportedCurrencies[0] || 'USDT'),
    });

    // Get available balance for selected currency
    const availableBalance = useMemo(
        () => getAvailableBalance(currency),
        [currency, getAvailableBalance]
    );

    // Re-create transaction hook when currency changes to update availableBalance
    const transactionWithBalance = useTransaction({
        type: 'withdraw',
        availableBalance,
    });

    // Use values from the transaction hook with updated balance
    const currentFee = transactionWithBalance.fee;
    const currentReceiveAmount = useMemo(() => {
        const numAmount = parseFloat(transactionWithBalance.amount) || 0;
        return Math.max(0, numAmount - currentFee);
    }, [transactionWithBalance.amount, currentFee]);

    // Update step based on form progress
    useEffect(() => {
        if (transactionWithBalance.currency && transactionWithBalance.network) {
            setCurrentStep(2); // Move to "Enter Details" step
        } else if (transactionWithBalance.currency) {
            setCurrentStep(1); // Move to "Select Network" step
        } else {
            setCurrentStep(0); // "Select Crypto" step
        }
    }, [transactionWithBalance.currency, transactionWithBalance.network]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!transactionWithBalance.isValid || !transactionWithBalance.network) return;

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));
            onWithdraw?.(
                transactionWithBalance.currency,
                parseFloat(transactionWithBalance.amount),
                transactionWithBalance.address,
                transactionWithBalance.network
            );
            transactionWithBalance.reset();
        } catch (error) {
            console.error('Withdrawal failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const amountError = transactionWithBalance.getFieldError('amount');
    const addressError = transactionWithBalance.getFieldError('address');
    const networkError = transactionWithBalance.getFieldError('network');

    if (isLoading || isWalletLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-border">
            <div className="flex">
                {/* Stepper (Left part inside card) */}
                <div className="w-48 p-6 border-r border-border shrink-0">
                    <VerticalStepper currentStep={currentStep} steps={steps.map((step, idx) => ({
                        ...step,
                        inactive: idx > currentStep,
                    }))} />
                </div>

                {/* Form Content (Right part inside card) */}
                <div className="flex-1">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl">Withdraw</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Send cryptocurrency to an external wallet
                        </p>
                    </CardHeader>
                    <CardContent>
                        {/* Wrapper div to ensure CardContent has a single child */}
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Currency Selector */}
                                <div className="space-y-2">
                                    <Label htmlFor="withdraw-currency">Select Cryptocurrency</Label>
                                    <Select
                                        value={transactionWithBalance.currency}
                                        onValueChange={transactionWithBalance.setCurrency}
                                    >
                                        <SelectTrigger id="withdraw-currency">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {supportedCurrencies.map((cur) => {
                                                const info = getCurrencyInfo(cur);
                                                const balance = getAvailableBalance(cur);
                                                return (
                                                    <SelectItem key={cur} value={cur}>
                                                        <div className="flex items-center justify-between gap-4 w-full">
                                                            <div className="flex items-center gap-2">
                                                                <img
                                                                    src={info?.icon}
                                                                    alt={cur}
                                                                    className="w-5 h-5 rounded-full"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                                    }}
                                                                />
                                                                <span>{info?.name || cur}</span>
                                                                <span className="text-muted-foreground">({cur})</span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {/* Available Balance */}
                                    <div className="flex items-center gap-2 text-sm">
                                        <Wallet className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Available:</span>
                                        <span className="font-medium">
                                            {formatAmount(availableBalance, transactionWithBalance.currency)}{' '}
                                            {transactionWithBalance.currency}
                                        </span>
                                    </div>
                                </div>

                                {/* Network Selector */}
                                <div className="space-y-2">
                                    <Label>Select Network</Label>
                                    <NetworkSelector
                                        networks={transactionWithBalance.networks}
                                        selectedNetwork={transactionWithBalance.network}
                                        onNetworkSelect={transactionWithBalance.setNetwork}
                                    />
                                    {networkError && !transactionWithBalance.network && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {networkError}
                                        </p>
                                    )}
                                </div>

                                {/* Amount Input with Max Button */}
                                <div className="space-y-2">
                                    <Label htmlFor="withdraw-amount">Amount</Label>
                                    <div className="relative">
                                        <Input
                                            id="withdraw-amount"
                                            type="text"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            value={transactionWithBalance.amount}
                                            onChange={(e) => transactionWithBalance.setAmount(e.target.value)}
                                            disabled={isSubmitting}
                                            className={amountError ? 'border-destructive pr-16' : 'pr-16'}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={transactionWithBalance.handleMaxClick}
                                            disabled={isSubmitting || availableBalance <= 0}
                                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2 text-xs font-semibold text-primary hover:text-primary"
                                        >
                                            MAX
                                        </Button>
                                    </div>
                                    {amountError && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {amountError}
                                        </p>
                                    )}
                                </div>

                                {/* Withdrawal Address */}
                                <div className="space-y-2">
                                    <Label htmlFor="withdraw-address">Withdrawal Address</Label>
                                    <Input
                                        id="withdraw-address"
                                        type="text"
                                        placeholder="Enter recipient's wallet address"
                                        value={transactionWithBalance.address}
                                        onChange={(e) => transactionWithBalance.setAddress(e.target.value)}
                                        disabled={isSubmitting}
                                        className={addressError ? 'border-destructive' : ''}
                                    />
                                    {addressError && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {addressError}
                                        </p>
                                    )}
                                </div>

                                {/* Summary Card */}
                                {transactionWithBalance.network && parseFloat(transactionWithBalance.amount) > 0 && (
                                    <div className="p-4 bg-muted/50 rounded-lg space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <h4 className="font-medium text-sm">Transaction Summary</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Amount</span>
                                                <span>
                                                    {transactionWithBalance.amount || '0'}{' '}
                                                    {transactionWithBalance.currency}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Network Fee</span>
                                                <span className="text-warning">
                                                    -{currentFee} {transactionWithBalance.currency}
                                                </span>
                                            </div>
                                            <div className="border-t border-border pt-2 mt-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-medium">You will receive</span>
                                                    <div className="flex items-center gap-2">
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                                        <span className="font-bold text-lg text-success">
                                                            {formatAmount(currentReceiveAmount, transactionWithBalance.currency)}{' '}
                                                            {transactionWithBalance.currency}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Network Info */}
                                {transactionWithBalance.networkPolicy && (
                                    <div className="text-xs text-muted-foreground space-y-1">
                                        <p>
                                            Minimum withdrawal: {transactionWithBalance.networkPolicy.minWithdraw}{' '}
                                            {transactionWithBalance.currency}
                                        </p>
                                        <p>Estimated time: {transactionWithBalance.networkPolicy.estimatedTime}</p>
                                    </div>
                                )}

                                {/* Submit Button */}
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={!transactionWithBalance.isValid || isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Withdraw'
                                    )}
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                </div>
            </div>
        </Card>
    );
};

export default WithdrawForm;
