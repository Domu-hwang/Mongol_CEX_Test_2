import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useOnboardingStore } from '@/features/kyc/store/useOnboardingStore';
import p2pApi from '../api/p2pApi';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
    CheckCircle2,
    Shield,
    TrendingUp,
    Star,
    Zap,
    Award,
    AlertCircle,
    ArrowRight,
    Wallet,
    Users,
    Clock,
    BadgeCheck
} from 'lucide-react';

const P2pMerchantApplicationPage = () => {
    const navigate = useNavigate();
    const { kycStatus } = useOnboardingStore();
    const [collateralAmount, setCollateralAmount] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [step, setStep] = useState(1);

    const isKycApproved = kycStatus === 'approved';
    const minCollateral = 1000;

    const benefits = [
        {
            icon: BadgeCheck,
            title: 'Verified Badge',
            description: 'Display a verified merchant badge on your profile to build trust with traders.'
        },
        {
            icon: TrendingUp,
            title: 'Priority Listing',
            description: 'Your ads appear at the top of search results for maximum visibility.'
        },
        {
            icon: Wallet,
            title: 'Higher Limits',
            description: 'Increased daily trading limits compared to regular users.'
        },
        {
            icon: Zap,
            title: 'Zero Fees',
            description: 'Enjoy zero trading fees on all P2P transactions during the promotional period.'
        }
    ];

    const requirements = [
        { label: 'KYC Level 2 Verified', completed: isKycApproved },
        { label: `Minimum ${minCollateral} USDT Collateral`, completed: parseFloat(collateralAmount) >= minCollateral },
        { label: 'Unique Nickname', completed: nickname.length >= 3 },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!isKycApproved) {
            setError('KYC Level 2 must be approved to apply for merchant status.');
            setLoading(false);
            return;
        }

        const amount = parseFloat(collateralAmount);
        if (isNaN(amount) || amount < minCollateral) {
            setError(`Minimum collateral amount is ${minCollateral} USDT.`);
            setLoading(false);
            return;
        }

        if (nickname.length < 3) {
            setError('Nickname must be at least 3 characters.');
            setLoading(false);
            return;
        }

        try {
            await p2pApi.applyForMerchant({
                userId: 'mock-user-123',
                nickname: nickname,
                kycLevel: kycStatus,
            });
            setSuccess(true);
        } catch (err) {
            setError('Failed to submit merchant application. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen bg-background">
                <div className="container mx-auto px-4 py-12 max-w-2xl">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="h-10 w-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold mb-4">Application Submitted!</h1>
                        <p className="text-muted-foreground mb-8">
                            Your merchant application has been submitted successfully. Our team will review your application within 24-48 hours.
                        </p>
                        <div className="bg-card rounded-xl border border-border p-6 mb-8 text-left">
                            <h3 className="font-semibold mb-4">What's Next?</h3>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">1</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Our team will verify your KYC documents and collateral deposit.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">2</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        You'll receive an email notification once your application is approved.
                                    </p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-primary">3</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Start creating ads and trading as a verified merchant!
                                    </p>
                                </li>
                            </ul>
                        </div>
                        <div className="flex gap-4 justify-center">
                            <Button variant="outline" onClick={() => navigate('/p2p')}>
                                Back to P2P Market
                            </Button>
                            <Button onClick={() => navigate('/wallet')}>
                                View Wallet
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <Badge className="mb-4">Become a Merchant</Badge>
                    <h1 className="text-4xl font-bold mb-4">
                        Join Our Verified Merchant Program
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Become a verified P2P merchant and unlock exclusive benefits. Trade with higher limits, priority listing, and zero fees.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {benefits.map((benefit) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={benefit.title}
                                className="bg-card rounded-xl border border-border p-6 hover:border-primary/50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-card rounded-xl border border-border p-6">
                            <h2 className="text-xl font-semibold mb-6">Application Form</h2>

                            {/* KYC Status */}
                            <div className="mb-6">
                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-lg border",
                                    isKycApproved ? "bg-green-500/10 border-green-500/20" : "bg-red-500/10 border-red-500/20"
                                )}>
                                    <div className="flex items-center gap-3">
                                        {isKycApproved ? (
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <AlertCircle className="h-5 w-5 text-red-500" />
                                        )}
                                        <div>
                                            <p className="font-medium">KYC Status</p>
                                            <p className={cn(
                                                "text-sm",
                                                isKycApproved ? "text-green-500" : "text-red-500"
                                            )}>
                                                {isKycApproved ? 'Level 2 Verified' : 'Verification Required'}
                                            </p>
                                        </div>
                                    </div>
                                    {!isKycApproved && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate('/onboarding/intro/status')}
                                        >
                                            Complete KYC
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nickname */}
                                <div className="space-y-2">
                                    <Label htmlFor="nickname">Merchant Nickname</Label>
                                    <Input
                                        id="nickname"
                                        type="text"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        placeholder="Enter your merchant nickname"
                                        disabled={!isKycApproved || loading}
                                        className="h-12"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        This will be displayed to other traders. Choose a professional name.
                                    </p>
                                </div>

                                {/* Collateral Amount */}
                                <div className="space-y-2">
                                    <Label htmlFor="collateral">Collateral Amount (USDT)</Label>
                                    <div className="relative">
                                        <Input
                                            id="collateral"
                                            type="number"
                                            value={collateralAmount}
                                            onChange={(e) => setCollateralAmount(e.target.value)}
                                            placeholder={`Minimum ${minCollateral} USDT`}
                                            disabled={!isKycApproved || loading}
                                            className="h-12 pr-16"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                                            USDT
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Collateral is held as security and will be returned if you deactivate your merchant account.
                                    </p>
                                </div>

                                {/* Quick Amount Buttons */}
                                <div className="flex gap-2">
                                    {[1000, 2000, 5000, 10000].map((amount) => (
                                        <Button
                                            key={amount}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setCollateralAmount(amount.toString())}
                                            disabled={!isKycApproved || loading}
                                        >
                                            {amount.toLocaleString()}
                                        </Button>
                                    ))}
                                </div>

                                {/* Collateral Info */}
                                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-muted-foreground">
                                        <p className="font-medium text-foreground mb-1">About Collateral</p>
                                        <p>
                                            Your collateral serves as a security deposit to protect buyers. Higher collateral amounts unlock higher trading limits and build more trust with traders.
                                        </p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-12 text-base"
                                    disabled={!isKycApproved || loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        <>
                                            Submit Application
                                            <ArrowRight className="h-4 w-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </div>

                    {/* Requirements Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-card rounded-xl border border-border p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Award className="h-5 w-5 text-primary" />
                                Requirements
                            </h3>
                            <ul className="space-y-4">
                                {requirements.map((req, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                                            req.completed ? "bg-green-500" : "bg-muted"
                                        )}>
                                            {req.completed ? (
                                                <CheckCircle2 className="h-4 w-4 text-white" />
                                            ) : (
                                                <span className="text-xs font-bold text-muted-foreground">{index + 1}</span>
                                            )}
                                        </div>
                                        <span className={cn(
                                            "text-sm",
                                            req.completed ? "text-foreground" : "text-muted-foreground"
                                        )}>
                                            {req.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Merchant Stats
                            </h3>
                            <div className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Active Merchants</span>
                                    <span className="font-medium">1,234</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Avg. Daily Volume</span>
                                    <span className="font-medium">$2.5M</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Avg. Completion Rate</span>
                                    <span className="font-medium text-green-500">98.5%</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-card rounded-xl border border-border p-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Clock className="h-5 w-5 text-primary" />
                                Processing Time
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Applications are typically reviewed within <span className="font-medium text-foreground">24-48 hours</span>. You'll receive an email notification once your application is processed.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default P2pMerchantApplicationPage;
