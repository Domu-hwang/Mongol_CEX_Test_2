import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { P2POrder, MerchantInfo } from '../types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import p2pApi from '../api/p2pApi';
import P2pChatModule from '../components/P2pChatModule';
import P2pDisputeDialog from '../components/P2pDisputeDialog';
import { cn } from '@/lib/utils';
import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    Copy,
    Shield,
    ArrowRight,
    User,
    Banknote,
    Lock,
    Unlock,
    MessageSquare,
    ChevronRight
} from 'lucide-react';

// Trade step indicator
const TradeSteps = ({ currentStep, status }: { currentStep: number; status: string }) => {
    const steps = [
        { id: 1, label: 'Order Created', icon: CheckCircle2 },
        { id: 2, label: 'Payment Pending', icon: Banknote },
        { id: 3, label: 'Payment Confirmed', icon: Lock },
        { id: 4, label: 'Completed', icon: Unlock },
    ];

    const getStepStatus = (stepId: number) => {
        if (status === 'Dispute') return stepId <= currentStep ? 'dispute' : 'pending';
        if (status === 'Cancelled') return stepId <= currentStep ? 'cancelled' : 'pending';
        if (stepId < currentStep) return 'completed';
        if (stepId === currentStep) return 'active';
        return 'pending';
    };

    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => {
                const stepStatus = getStepStatus(step.id);
                const Icon = step.icon;
                return (
                    <React.Fragment key={step.id}>
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all",
                                    stepStatus === 'completed' && "bg-green-500 text-white",
                                    stepStatus === 'active' && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                    stepStatus === 'pending' && "bg-muted text-muted-foreground",
                                    stepStatus === 'dispute' && "bg-orange-500 text-white",
                                    stepStatus === 'cancelled' && "bg-red-500 text-white"
                                )}
                            >
                                <Icon className="w-5 h-5" />
                            </div>
                            <span className={cn(
                                "text-xs text-center max-w-[80px]",
                                stepStatus === 'active' && "text-primary font-medium",
                                stepStatus === 'completed' && "text-green-500",
                                stepStatus === 'pending' && "text-muted-foreground"
                            )}>
                                {step.label}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={cn(
                                "flex-1 h-0.5 mx-2 mt-[-24px]",
                                stepStatus === 'completed' ? "bg-green-500" : "bg-muted"
                            )} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

const P2pTradeDetailPage = () => {
    const { tradeId } = useParams<{ tradeId: string }>();
    const navigate = useNavigate();
    const [order, setOrder] = useState<P2POrder | null>(null);
    const [merchant, setMerchant] = useState<MerchantInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [countdown, setCountdown] = useState(60 * 15); // 15 minutes
    const [isDisputeDialogOpen, setIsDisputeDialogOpen] = useState(false);
    const [copied, setCopied] = useState<string | null>(null);

    // Mock seller payment info
    const sellerPaymentInfo = {
        bankName: 'Khan Bank',
        accountName: 'Б***** М*****',
        accountNumber: '5***4567890',
        fullAccountNumber: '5012345678901234567890'
    };

    useEffect(() => {
        if (tradeId) {
            fetchOrderDetails(tradeId);
        }
    }, [tradeId]);

    useEffect(() => {
        if (order && order.status === 'Pending') {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev === 0) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [order]);

    const fetchOrderDetails = async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const mockOrder: P2POrder = {
                id: id,
                advertisementId: 'ad-1',
                buyerId: 'mock-user-123',
                sellerId: 'merchant-1',
                asset: 'USDT',
                fiatCurrency: 'MNT',
                fiatAmount: 345000,
                cryptoAmount: 100,
                price: 3450,
                status: 'Pending',
                paymentMethod: 'Khan Bank',
                createdAt: new Date().toISOString(),
            };

            const mockMerchant: MerchantInfo = {
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

            setOrder(mockOrder);
            setMerchant(mockMerchant);
        } catch (err) {
            setError('Failed to fetch order details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsPaid = async () => {
        if (!order) return;
        try {
            await p2pApi.updateOrderStatus(order.id, 'Paid');
            setOrder({ ...order, status: 'Paid' });
        } catch (err) {
            alert('Failed to mark order as paid.');
            console.error(err);
        }
    };

    const handleReleaseAsset = async () => {
        if (!order) return;
        try {
            await p2pApi.updateOrderStatus(order.id, 'Completed');
            setOrder({ ...order, status: 'Completed' });
        } catch (err) {
            alert('Failed to release asset.');
            console.error(err);
        }
    };

    const handleSendMessage = (tradeId: string, sender: string, message: string) => {
        console.log('Message sent:', { tradeId, sender, message });
    };

    const handleUploadImage = (tradeId: string, sender: string, imageUrl: string) => {
        console.log('Image uploaded:', { tradeId, sender, imageUrl });
    };

    const handleRaiseDispute = () => {
        setIsDisputeDialogOpen(true);
    };

    const handleDisputeSubmit = async (tradeId: string, reason: string, evidenceUrl?: string) => {
        try {
            await p2pApi.updateOrderStatus(tradeId, 'Dispute');
            if (order) {
                setOrder({ ...order, status: 'Dispute' });
            }
            alert('Dispute submitted successfully. Our team will review your case.');
        } catch (err) {
            alert('Failed to submit dispute.');
            console.error(err);
        }
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopied(field);
        setTimeout(() => setCopied(null), 2000);
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const getCurrentStep = () => {
        if (!order) return 1;
        switch (order.status) {
            case 'Pending': return 2;
            case 'Paid': return 3;
            case 'Completed': return 4;
            case 'Dispute': return 3;
            case 'Cancelled': return 2;
            default: return 1;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading trade details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <p className="text-destructive">{error || 'Order not found.'}</p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/p2p')}>
                        Back to P2P Market
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            Buy {order.asset}
                            <Badge variant={order.status === 'Completed' ? 'default' : order.status === 'Dispute' ? 'destructive' : 'secondary'}>
                                {order.status}
                            </Badge>
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            Order #{order.id} • Created {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                    {order.status === 'Pending' && (
                        <div className="text-right">
                            <p className="text-sm text-muted-foreground">Time remaining</p>
                            <p className={cn(
                                "text-2xl font-mono font-bold",
                                countdown < 300 ? "text-red-500" : "text-primary"
                            )}>
                                {formatTime(countdown)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Progress Steps */}
                <div className="bg-card rounded-xl border border-border p-6 mb-6">
                    <TradeSteps currentStep={getCurrentStep()} status={order.status} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Info & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Summary */}
                        <div className="bg-card rounded-xl border border-border p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Banknote className="h-5 w-5" />
                                Order Information
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Amount</p>
                                    <p className="text-xl font-bold text-green-500">
                                        {formatNumber(order.cryptoAmount)} {order.asset}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Price</p>
                                    <p className="text-xl font-bold">
                                        {formatNumber(order.price)} {order.fiatCurrency}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Total Payment</p>
                                    <p className="text-2xl font-bold text-primary">
                                        {formatNumber(order.fiatAmount)} {order.fiatCurrency}
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-muted-foreground">Payment Method</p>
                                    <Badge variant="outline" className="text-base">
                                        {order.paymentMethod}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        {(order.status === 'Pending' || order.status === 'Paid') && (
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-primary" />
                                    {order.status === 'Pending' ? 'Make Payment' : 'Payment Details'}
                                </h2>

                                {order.status === 'Pending' && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-medium text-yellow-500">Important</p>
                                                <p className="text-muted-foreground mt-1">
                                                    Transfer exactly <span className="font-bold text-foreground">{formatNumber(order.fiatAmount)} {order.fiatCurrency}</span> to the seller's account.
                                                    The crypto is held in escrow and will be released after payment confirmation.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Bank Name</p>
                                            <p className="font-medium">{sellerPaymentInfo.bankName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Account Name</p>
                                            <p className="font-medium">{sellerPaymentInfo.accountName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Account Number</p>
                                            <p className="font-medium font-mono">{sellerPaymentInfo.accountNumber}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(sellerPaymentInfo.fullAccountNumber, 'account')}
                                        >
                                            {copied === 'account' ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                        <div>
                                            <p className="text-xs text-muted-foreground">Amount to Transfer</p>
                                            <p className="font-bold text-lg text-primary">{formatNumber(order.fiatAmount)} {order.fiatCurrency}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => copyToClipboard(order.fiatAmount.toString(), 'amount')}
                                        >
                                            {copied === 'amount' ? (
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {order.status === 'Pending' && (
                                    <Button
                                        className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white h-12 text-base"
                                        onClick={handleMarkAsPaid}
                                    >
                                        I've Made the Payment
                                    </Button>
                                )}

                                {order.status === 'Paid' && (
                                    <div className="mt-6 text-center p-4 bg-green-500/10 rounded-lg">
                                        <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                        <p className="font-medium text-green-500">Payment Confirmed</p>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Waiting for seller to release the crypto...
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Completed Status */}
                        {order.status === 'Completed' && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center">
                                <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-green-500">Trade Completed!</h3>
                                <p className="text-muted-foreground mt-2">
                                    {formatNumber(order.cryptoAmount)} {order.asset} has been credited to your wallet.
                                </p>
                                <Button className="mt-4" onClick={() => navigate('/wallet')}>
                                    View Wallet
                                </Button>
                            </div>
                        )}

                        {/* Dispute Status */}
                        {order.status === 'Dispute' && (
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                    <AlertTriangle className="h-8 w-8 text-orange-500 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-lg font-bold text-orange-500">Dispute In Progress</h3>
                                        <p className="text-muted-foreground mt-2">
                                            A dispute has been raised for this trade. Our support team is reviewing the case and will contact you shortly.
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-2">
                                            Average resolution time: 2-4 hours
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Seller Info & Chat */}
                    <div className="space-y-6">
                        {/* Seller Info */}
                        {merchant && (
                            <div className="bg-card rounded-xl border border-border p-6">
                                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Seller Information
                                </h2>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-lg">
                                        {merchant.nickname.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{merchant.nickname}</span>
                                            {merchant.isVerified && (
                                                <CheckCircle2 className="h-4 w-4 text-primary" />
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">Verified Merchant</p>
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Completed Orders</span>
                                        <span className="font-medium">{formatNumber(merchant.completedOrders)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Completion Rate</span>
                                        <span className="font-medium text-green-500">
                                            {(merchant.completionRate * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Avg. Release Time</span>
                                        <span className="font-medium">
                                            {Math.round(merchant.averageReleaseTime / 60)} min
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Escrow Status */}
                        <div className="bg-card rounded-xl border border-border p-6">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Lock className="h-5 w-5 text-primary" />
                                Escrow Protection
                            </h2>
                            <div className="flex items-center gap-3 p-3 bg-green-500/10 rounded-lg">
                                <Shield className="h-8 w-8 text-green-500" />
                                <div>
                                    <p className="font-medium text-green-500">Assets Secured</p>
                                    <p className="text-xs text-muted-foreground">
                                        {formatNumber(order.cryptoAmount)} {order.asset} is locked in escrow
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">
                                The seller's crypto is held safely in escrow until you confirm payment. You can raise a dispute if any issues occur.
                            </p>
                        </div>

                        {/* Quick Actions */}
                        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                            <div className="bg-card rounded-xl border border-border p-4">
                                <Button
                                    variant="outline"
                                    className="w-full justify-between"
                                    onClick={handleRaiseDispute}
                                >
                                    <span className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4" />
                                        Raise Dispute
                                    </span>
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Module */}
                <div className="mt-6">
                    <P2pChatModule
                        tradeId={tradeId || ''}
                        currentUserId="mock-user-123"
                        onSendMessage={handleSendMessage}
                        onUploadImage={handleUploadImage}
                        onRaiseDispute={handleRaiseDispute}
                    />
                </div>

                {/* Dispute Dialog */}
                <P2pDisputeDialog
                    isOpen={isDisputeDialogOpen}
                    onClose={() => setIsDisputeDialogOpen(false)}
                    onDisputeSubmit={handleDisputeSubmit}
                    tradeId={order.id}
                />
            </div>
        </div>
    );
};

export default P2pTradeDetailPage;
