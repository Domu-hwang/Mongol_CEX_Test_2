import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { P2PAd, MerchantInfo } from '../types';
import { cn } from '@/lib/utils';
import {
    CheckCircle2,
    Shield,
    Clock,
    ArrowRight,
    AlertCircle,
    Wallet,
    Banknote
} from 'lucide-react';

interface P2pOrderCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ad: P2PAd | null;
    onPlaceOrder: (adId: string, cryptoAmount: number, fiatAmount: number) => void;
    merchant?: MerchantInfo;
}

const P2pOrderCreateDialog: React.FC<P2pOrderCreateDialogProps> = ({
    isOpen,
    onClose,
    ad,
    onPlaceOrder,
    merchant,
}) => {
    const [fiatAmount, setFiatAmount] = useState('');
    const [cryptoAmount, setCryptoAmount] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
    const [errors, setErrors] = useState<{ fiat?: string; crypto?: string }>({});

    // Mock merchant if not provided
    const displayMerchant: MerchantInfo = merchant || {
        id: 'merchant-1',
        userId: 'user-1',
        nickname: 'CryptoKing_MN',
        kycLevel: 'Level 2',
        isVerified: true,
        completedOrders: 1250,
        completionRate: 0.9892,
        averageReleaseTime: 180,
        collateralAmount: 5000,
        collateralCurrency: 'USDT',
        applicationStatus: 'Approved',
        appliedAt: new Date().toISOString(),
    };

    useEffect(() => {
        if (ad && isOpen) {
            setFiatAmount('');
            setCryptoAmount('');
            setSelectedPaymentMethod(ad.paymentMethods[0] || '');
            setErrors({});
        }
    }, [ad, isOpen]);

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const handleFiatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFiatAmount(value);
        setErrors({});

        if (ad && value && !isNaN(parseFloat(value))) {
            const crypto = parseFloat(value) / ad.price;
            setCryptoAmount(crypto.toFixed(ad.asset === 'USDT' ? 2 : 6));
        } else {
            setCryptoAmount('');
        }
    };

    const handleCryptoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCryptoAmount(value);
        setErrors({});

        if (ad && value && !isNaN(parseFloat(value))) {
            const fiat = parseFloat(value) * ad.price;
            setFiatAmount(fiat.toFixed(0));
        } else {
            setFiatAmount('');
        }
    };

    const handleQuickAmount = (percentage: number) => {
        if (!ad) return;
        const maxCrypto = Math.min(ad.availableAmount, ad.maxLimit / ad.price);
        const crypto = maxCrypto * (percentage / 100);
        setCryptoAmount(crypto.toFixed(ad.asset === 'USDT' ? 2 : 6));
        setFiatAmount((crypto * ad.price).toFixed(0));
        setErrors({});
    };

    const validateForm = (): boolean => {
        if (!ad) return false;

        const parsedFiat = parseFloat(fiatAmount);
        const parsedCrypto = parseFloat(cryptoAmount);
        const newErrors: { fiat?: string; crypto?: string } = {};

        if (isNaN(parsedFiat) || parsedFiat <= 0) {
            newErrors.fiat = 'Please enter a valid amount';
        } else if (parsedFiat < ad.minLimit) {
            newErrors.fiat = `Minimum amount is ${formatNumber(ad.minLimit)} ${ad.fiatCurrency}`;
        } else if (parsedFiat > ad.maxLimit) {
            newErrors.fiat = `Maximum amount is ${formatNumber(ad.maxLimit)} ${ad.fiatCurrency}`;
        }

        if (isNaN(parsedCrypto) || parsedCrypto <= 0) {
            newErrors.crypto = 'Please enter a valid amount';
        } else if (parsedCrypto > ad.availableAmount) {
            newErrors.crypto = `Only ${formatNumber(ad.availableAmount)} ${ad.asset} available`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ad || !validateForm()) return;

        onPlaceOrder(ad.id, parseFloat(cryptoAmount), parseFloat(fiatAmount));
    };

    if (!ad) return null;

    const isBuy = ad.type === 'BUY';

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                {/* Header */}
                <DialogHeader className={cn(
                    "p-6 pb-4",
                    isBuy ? "bg-green-500/10" : "bg-red-500/10"
                )}>
                    <DialogTitle className="flex items-center gap-3">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            isBuy ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        )}>
                            {isBuy ? <Wallet className="h-5 w-5" /> : <Banknote className="h-5 w-5" />}
                        </div>
                        <div>
                            <span className={cn(
                                "text-xl font-bold",
                                isBuy ? "text-green-500" : "text-red-500"
                            )}>
                                {isBuy ? 'Buy' : 'Sell'} {ad.asset}
                            </span>
                            <p className="text-sm font-normal text-muted-foreground mt-0.5">
                                Price: {formatNumber(ad.price)} {ad.fiatCurrency}
                            </p>
                        </div>
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Merchant Info */}
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {displayMerchant.nickname.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm">{displayMerchant.nickname}</span>
                                    {displayMerchant.isVerified && (
                                        <CheckCircle2 className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{displayMerchant.completedOrders} orders</span>
                                    <span>•</span>
                                    <span className="text-green-500">{(displayMerchant.completionRate * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>~{Math.round(displayMerchant.averageReleaseTime / 60)} min</span>
                            </div>
                        </div>
                    </div>

                    {/* Amount Input - Fiat */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="fiatAmount" className="text-sm font-medium">
                                {isBuy ? 'I will pay' : 'I will receive'}
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                Limit: {formatNumber(ad.minLimit)} - {formatNumber(ad.maxLimit)} {ad.fiatCurrency}
                            </span>
                        </div>
                        <div className="relative">
                            <Input
                                id="fiatAmount"
                                type="number"
                                value={fiatAmount}
                                onChange={handleFiatChange}
                                className={cn(
                                    "pr-16 h-12 text-lg",
                                    errors.fiat && "border-red-500 focus-visible:ring-red-500"
                                )}
                                placeholder="0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                                {ad.fiatCurrency}
                            </span>
                        </div>
                        {errors.fiat && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.fiat}
                            </p>
                        )}
                    </div>

                    {/* Arrow */}
                    <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                            <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                        </div>
                    </div>

                    {/* Amount Input - Crypto */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="cryptoAmount" className="text-sm font-medium">
                                {isBuy ? 'I will receive' : 'I will pay'}
                            </Label>
                            <span className="text-xs text-muted-foreground">
                                Available: {formatNumber(ad.availableAmount)} {ad.asset}
                            </span>
                        </div>
                        <div className="relative">
                            <Input
                                id="cryptoAmount"
                                type="number"
                                value={cryptoAmount}
                                onChange={handleCryptoChange}
                                className={cn(
                                    "pr-16 h-12 text-lg",
                                    errors.crypto && "border-red-500 focus-visible:ring-red-500"
                                )}
                                placeholder="0"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                                {ad.asset}
                            </span>
                        </div>
                        {errors.crypto && (
                            <p className="text-xs text-red-500 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.crypto}
                            </p>
                        )}
                    </div>

                    {/* Quick Amount Buttons */}
                    <div className="flex gap-2">
                        {[25, 50, 75, 100].map((percentage) => (
                            <Button
                                key={percentage}
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => handleQuickAmount(percentage)}
                            >
                                {percentage}%
                            </Button>
                        ))}
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Payment Method</Label>
                        <div className="flex flex-wrap gap-2">
                            {ad.paymentMethods.map((method) => (
                                <Badge
                                    key={method}
                                    variant={selectedPaymentMethod === method ? "default" : "outline"}
                                    className={cn(
                                        "cursor-pointer transition-all px-3 py-1.5",
                                        selectedPaymentMethod === method && "ring-2 ring-primary ring-offset-2"
                                    )}
                                    onClick={() => setSelectedPaymentMethod(method)}
                                >
                                    {method}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Escrow Notice */}
                    <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Escrow Protection:</span>{' '}
                            {isBuy
                                ? "The seller's crypto will be locked in escrow until you complete the payment."
                                : "Your crypto will be locked in escrow until the buyer completes payment."}
                        </div>
                    </div>

                    {/* Terms */}
                    {ad.terms && (
                        <div className="p-3 bg-muted/30 rounded-lg">
                            <p className="text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">Seller's Terms:</span>{' '}
                                {ad.terms}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className={cn(
                            "w-full h-12 text-base font-semibold",
                            isBuy
                                ? "bg-green-500 hover:bg-green-600 text-white"
                                : "bg-red-500 hover:bg-red-600 text-white"
                        )}
                        disabled={!fiatAmount || !cryptoAmount}
                    >
                        {isBuy ? 'Buy' : 'Sell'} {ad.asset}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default P2pOrderCreateDialog;
