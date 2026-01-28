import React, { useState, useMemo, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, AlertTriangle, CheckCircle } from 'lucide-react';
import QRCode from 'react-qr-code';
import NetworkSelector from './NetworkSelector';
import { useTransaction } from '../hooks/useTransaction';
import {
    getSupportedCurrencies,
    getCurrencyInfo,
} from '@/constants/cryptoPolicy';
import { copyToClipboard } from '@/utils/clipboard';
import { VerticalStepper } from '@/components/ui/VerticalStepper'; // Import VerticalStepper

interface DepositFormProps {
    isLoading?: boolean;
}

const DepositForm: React.FC<DepositFormProps> = ({ isLoading = false }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [currentStep, setCurrentStep] = useState(0); // Local state for stepper

    const {
        currency,
        network,
        networks,
        networkPolicy,
        setCurrency,
        setNetwork,
    } = useTransaction({ type: 'deposit' });

    const supportedCurrencies = useMemo(() => getSupportedCurrencies(), []);
    const recommendedTokens = ['USDT', 'BTC', 'ETH', 'TRX', 'SOL']; // Recommended tokens as per feedback

    const depositAddress = networkPolicy?.depositAddress || '';

    const handleCopy = async () => {
        if (!depositAddress) return;
        const result = await copyToClipboard(depositAddress);
        if (result.success) {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    // Update step based on currency and network selection
    useEffect(() => {
        // The stepper should initialize with the first step active, others inactive.
        // It should not jump to step 2 directly unless both currency and network are pre-selected.
        // For this task, we want step 3 to be inactive by default.
        if (currency && network) {
            setCurrentStep(2); // Step 3 (index 2) is active if both currency and network are selected
        } else if (currency) {
            setCurrentStep(1); // Step 2 (index 1) is active if currency is selected
        } else {
            setCurrentStep(0); // Step 1 (index 0) is active by default
        }
    }, [currency, network]);


    const steps = [
        { label: 'Select Crypto', description: 'Choose the cryptocurrency to deposit' },
        { label: 'Select Network', description: 'Choose the network for your deposit' },
        { label: 'Deposit Address', description: 'Send funds to the generated address', inactive: true }, // Mark as inactive initially
    ];

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-40 w-40 mx-auto" />
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
                        inactive: idx > currentStep, // Mark steps beyond current as inactive
                    }))} />
                </div>

                {/* Form Content (Right part inside card) */}
                <div className="flex-1">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl">Deposit</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Deposit cryptocurrency to your wallet
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Wrapper div to ensure CardContent has a single child */}
                        <div>
                            {currentStep >= 0 && (
                                <div className="space-y-2">
                                    <Label htmlFor="deposit-currency">Select Cryptocurrency</Label>
                                    <Select value={currency} onValueChange={setCurrency}>
                                        <SelectTrigger id="deposit-currency">
                                            <SelectValue placeholder="Select currency" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {supportedCurrencies.map((cur) => {
                                                const info = getCurrencyInfo(cur);
                                                return (
                                                    <SelectItem key={cur} value={cur}>
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
                                                    </SelectItem>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {/* Recommended Tokens */}
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {recommendedTokens.map((token) => {
                                            const info = getCurrencyInfo(token);
                                            return (
                                                <Button
                                                    key={token}
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setCurrency(token)}
                                                    className="flex items-center gap-1"
                                                >
                                                    <img
                                                        src={info?.icon}
                                                        alt={token}
                                                        className="w-4 h-4 rounded-full"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                        }}
                                                    />
                                                    {token}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {currentStep >= 1 && currency && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Label>Select Network</Label>
                                    <NetworkSelector
                                        networks={networks}
                                        selectedNetwork={network}
                                        onNetworkSelect={setNetwork}
                                    />
                                </div>
                            )}

                            {/* Always render step 3, but apply conditional styling/disabling */}
                            {currentStep >= 2 && network && networkPolicy && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {/* QR Code */}
                                    <div className="flex justify-center p-4 bg-white rounded-lg">
                                        <QRCode
                                            value={depositAddress}
                                            size={160}
                                            level="H"
                                            className="rounded"
                                        />
                                    </div>

                                    {/* Address Display */}
                                    <div className="space-y-2">
                                        <Label>Deposit Address</Label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                                                {depositAddress}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                onClick={handleCopy}
                                                className="shrink-0"
                                            >
                                                {isCopied ? (
                                                    <CheckCircle className="h-4 w-4 text-success" />
                                                ) : (
                                                    <Copy className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Send only {currency} ({networkPolicy.networkFullName}) to this address
                                        </p>
                                    </div>

                                    {/* More Details Accordion */}
                                    <Accordion type="single" collapsible className="w-full">
                                        <AccordionItem value="details" className="border-border">
                                            <AccordionTrigger className="text-sm hover:no-underline">
                                                More details
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="space-y-3 text-sm">
                                                    {/* Network Info */}
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Network</span>
                                                        <span className="font-medium">{networkPolicy.networkFullName}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Minimum deposit</span>
                                                        <span className="font-medium">
                                                            {networkPolicy.minDeposit} {currency}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Confirmations</span>
                                                        <span className="font-medium">{networkPolicy.confirmations}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Estimated time</span>
                                                        <span className="font-medium">{networkPolicy.transactionTime}</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-muted-foreground">Confirmations per hour</span>
                                                        <span className="font-medium">{networkPolicy.confirmationsPerHour}</span>
                                                    </div>

                                                    {/* Warnings */}
                                                    {networkPolicy.warnings.length > 0 && (
                                                        <div className="mt-4 p-3 bg-warning/10 border border-warning/20 rounded-md">
                                                            <div className="flex gap-2">
                                                                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                                                                <div className="space-y-1">
                                                                    {networkPolicy.warnings.map((warning, idx) => (
                                                                        <p key={idx} className="text-xs text-warning">
                                                                            {warning}
                                                                        </p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>
                                </div>
                            )}

                            {/* Initial State Message */}
                            {!currency && (
                                <div className="text-center py-8 text-muted-foreground">
                                    <p>Select a cryptocurrency to begin your deposit</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </div>
            </div>
        </Card>
    );
};

export default DepositForm;