import React, { useState, useEffect } from 'react';
import P2pMarketplaceFilters from '../components/P2pMarketplaceFilters';
import P2pAdCard from '../components/P2pAdCard';
import { P2PAd, MerchantInfo } from '../types';
import p2pApi from '../api/p2pApi';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import P2pOrderCreateDialog from '../components/P2pOrderCreateDialog';
import P2pOnboardingModal from '../components/P2pOnboardingModal'; // Assuming this component exists
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, CheckCircle2 } from 'lucide-react'; // Import icons
import { cn } from '@/lib/utils'; // Assuming cn utility exists
import { Badge } from '@/components/ui/badge';

const P2P_ONBOARDING_KEY = 'p2p_onboarding_completed';

const P2pMarketPage = () => {
    const navigate = useNavigate();
    const [ads, setAds] = useState<P2PAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilters, setActiveFilters] = useState({
        type: 'BUY' as 'BUY' | 'SELL',
        fiatCurrency: 'MNT',
        paymentMethod: 'all',
        amount: '',
        asset: 'USDT', // Default asset
    });
    const [selectedAd, setSelectedAd] = useState<P2PAd | null>(null);
    const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
    const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => {
        // Check local storage for onboarding status
        return localStorage.getItem(P2P_ONBOARDING_KEY) === 'true';
    });

    // Show onboarding modal on first visit
    useEffect(() => {
        if (!isOnboardingOpen) { // Check if it's not already open or completed
            setIsOnboardingOpen(true);
        }
    }, []);

    const handleOnboardingComplete = () => {
        localStorage.setItem(P2P_ONBOARDING_KEY, 'true');
        setIsOnboardingOpen(false);
    };

    const availableAssets = ['USDT', 'BTC', 'ETH', 'BNB', 'FDUSD']; // Example assets, from Binance P2P
    const availableFiatCurrencies = [
        { value: 'MNT', label: 'MNT' },
        { value: 'USD', label: 'USD' },
        { value: 'CNY', label: 'CNY' },
        { value: 'KRW', label: 'KRW' }, // Added KRW as an example
    ];
    const availablePaymentMethods = [
        { value: 'all', label: 'All Payment Methods' }, // Added for "All Payment Methods" filter
        { value: 'Khan Bank', label: 'Khan Bank' },
        { value: 'TDB', label: 'TDB' },
        { value: 'State Bank', label: 'State Bank' },
        { value: 'Golomt Bank', label: 'Golomt Bank' }, // Added Golomt Bank as an example
    ];


    // Mock Merchants for demonstration, adhering to MerchantInfo type
    const mockMerchants: Record<string, MerchantInfo> = {
        'merchant-1': {
            id: 'merchant-1',
            userId: 'user-1',
            nickname: 'CryptoKing_MN',
            kycLevel: 'Level 2',
            isVerified: true,
            completedOrders: 1250,
            completionRate: 0.9892,
            averageReleaseTime: 180, // in seconds
            collateralAmount: 5000,
            collateralCurrency: 'USDT',
            applicationStatus: 'Approved',
            appliedAt: new Date().toISOString(),
        },
        'merchant-2': {
            id: 'merchant-2',
            userId: 'user-2',
            nickname: 'FastTrader88',
            kycLevel: 'Level 2',
            isVerified: true,
            completedOrders: 856,
            completionRate: 0.9756,
            averageReleaseTime: 240,
            collateralAmount: 3000,
            collateralCurrency: 'USDT',
            applicationStatus: 'Approved',
            appliedAt: new Date().toISOString(),
        },
        'merchant-3': {
            id: 'merchant-3',
            userId: 'user-3',
            nickname: 'MongolCrypto',
            kycLevel: 'Level 2',
            isVerified: true,
            completedOrders: 2341,
            completionRate: 0.9923,
            averageReleaseTime: 120,
            collateralAmount: 10000,
            collateralCurrency: 'USDT',
            applicationStatus: 'Approved',
            appliedAt: new Date().toISOString(),
        },
        'merchant-4': {
            id: 'merchant-4',
            userId: 'user-4',
            nickname: 'UB_Trader',
            kycLevel: 'Level 1',
            isVerified: false, // Not verified
            completedOrders: 156,
            completionRate: 0.9487,
            averageReleaseTime: 360,
            collateralAmount: 1000,
            collateralCurrency: 'USDT',
            applicationStatus: 'Pending', // Application still pending
            appliedAt: new Date().toISOString(),
        },
    };


    useEffect(() => {
        fetchAds(activeFilters);
    }, [activeFilters]);

    const fetchAds = async (filters: typeof activeFilters) => {
        setLoading(true);
        setError(null);
        try {
            // In a real application, you would pass filters to the API
            const fetchedAds = await p2pApi.getAds(filters.type, filters);

            // Mock data for ads, filtered by asset and type initially
            const allMockAds: P2PAd[] = [
                {
                    id: 'ad-1',
                    merchantId: 'merchant-1',
                    type: 'BUY',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    price: 3450.00,
                    minLimit: 100000,
                    maxLimit: 5000000,
                    availableAmount: 2500.00,
                    totalAmount: 5000,
                    paymentMethods: ['Khan Bank', 'TDB'],
                    terms: 'Fast trade. Only verified users.',
                    status: 'Active',
                    priceType: 'Fixed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'ad-2',
                    merchantId: 'merchant-2',
                    type: 'BUY',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    price: 3448.50,
                    minLimit: 50000,
                    maxLimit: 3000000,
                    availableAmount: 1800.00,
                    totalAmount: 3000,
                    paymentMethods: ['Golomt Bank', 'State Bank'],
                    terms: 'Instant release.',
                    status: 'Active',
                    priceType: 'Fixed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'ad-3',
                    merchantId: 'merchant-3',
                    type: 'BUY',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    price: 3452.00,
                    minLimit: 200000,
                    maxLimit: 10000000,
                    availableAmount: 8500.00,
                    totalAmount: 10000,
                    paymentMethods: ['Khan Bank'],
                    terms: 'Large orders welcome.',
                    status: 'Active',
                    priceType: 'Fixed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'ad-4',
                    merchantId: 'merchant-4',
                    type: 'BUY',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    price: 3445.00,
                    minLimit: 10000,
                    maxLimit: 500000,
                    availableAmount: 320.50,
                    totalAmount: 500,
                    paymentMethods: ['TDB'],
                    terms: 'Quick payment required.',
                    status: 'Active',
                    priceType: 'Fixed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                // SELL Ads
                {
                    id: 'ad-5',
                    merchantId: 'merchant-1',
                    type: 'SELL',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    price: 3460.00,
                    minLimit: 100000,
                    maxLimit: 5000000,
                    availableAmount: 3200.00,
                    totalAmount: 5000,
                    paymentMethods: ['Khan Bank', 'TDB', 'Golomt Bank'],
                    terms: 'Fast release guaranteed.',
                    status: 'Active',
                    priceType: 'Fixed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'ad-6',
                    merchantId: 'merchant-3',
                    type: 'SELL',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    price: 3458.00,
                    minLimit: 500000,
                    maxLimit: 20000000,
                    availableAmount: 15000.00,
                    totalAmount: 20000,
                    paymentMethods: ['Khan Bank', 'State Bank'],
                    terms: 'VIP customers only.',
                    status: 'Active',
                    priceType: 'Fixed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'ad-7',
                    merchantId: 'merchant-2',
                    type: 'BUY',
                    asset: 'BTC',
                    fiatCurrency: 'MNT',
                    price: 120000000,
                    minLimit: 500000,
                    maxLimit: 10000000,
                    availableAmount: 0.05,
                    totalAmount: 0.1,
                    paymentMethods: ['Khan Bank'],
                    terms: 'BTC only.',
                    status: 'Active',
                    priceType: 'Fixed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ];

            let filteredAds = allMockAds.filter(ad => ad.type === filters.type && ad.asset === filters.asset);

            if (filters.fiatCurrency !== 'all') { // Assuming 'all' is an option for fiatCurrency too, adjust if needed
                filteredAds = filteredAds.filter(ad => ad.fiatCurrency === filters.fiatCurrency);
            }

            if (filters.paymentMethod && filters.paymentMethod !== 'all') {
                filteredAds = filteredAds.filter(ad => ad.paymentMethods.includes(filters.paymentMethod));
            }

            if (filters.amount) {
                const amount = parseFloat(filters.amount);
                if (!isNaN(amount)) {
                    filteredAds = filteredAds.filter(ad => amount >= ad.minLimit && amount <= ad.maxLimit);
                }
            }

            setAds(filteredAds);
        } catch (err) {
            setError('Failed to fetch ads.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApplyFilters = (newFilters: {
        fiatCurrency: string;
        paymentMethod: string;
        amountRange: { min?: number; max?: number };
    }) => {
        setActiveFilters(prev => ({
            ...prev,
            fiatCurrency: newFilters.fiatCurrency,
            paymentMethod: newFilters.paymentMethod,
            amount: newFilters.amountRange.min?.toString() || '', // Use min amount for general amount filter
        }));
    };

    const handleBuySellClick = (adId: string) => {
        const ad = ads.find(a => a.id === adId);
        if (ad) {
            setSelectedAd(ad);
            setIsOrderDialogOpen(true);
        }
    };

    const handlePlaceOrder = async (adId: string, cryptoAmount: number, fiatAmount: number) => {
        if (!selectedAd) return;
        try {
            const newOrder = await p2pApi.createOrder({
                advertisementId: adId,
                buyerId: 'mock-user-123', // Replace with actual user ID
                sellerId: selectedAd.merchantId,
                asset: selectedAd.asset,
                fiatCurrency: selectedAd.fiatCurrency,
                fiatAmount: fiatAmount,
                cryptoAmount: cryptoAmount,
                price: selectedAd.price,
                paymentMethod: selectedAd.paymentMethods[0], // Assuming first payment method for simplicity
            });
            alert(`Order placed successfully! Order ID: ${newOrder.id}`);
            navigate(`/p2p/trade/${newOrder.id}`); // Navigate to trade detail page
            setIsOrderDialogOpen(false);
            setSelectedAd(null);
            fetchAds(activeFilters); // Refresh ads
        } catch (error) {
            alert('Failed to place order.');
            console.error('Error placing order:', error);
        }
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat().format(num);
    };

    const getMerchant = (merchantId: string): MerchantInfo => {
        return mockMerchants[merchantId] || mockMerchants['merchant-1'];
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-6 max-w-7xl">
                {/* Buy/Sell Tabs */}
                <div className="flex items-center gap-1 mb-6">
                    <button
                        onClick={() => setActiveFilters(prev => ({ ...prev, type: 'BUY' }))}
                        className={cn(
                            "px-6 py-3 text-lg font-semibold rounded-lg transition-all",
                            activeFilters.type === 'BUY'
                                ? "bg-green-500/10 text-green-500"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Buy
                    </button>
                    <button
                        onClick={() => setActiveFilters(prev => ({ ...prev, type: 'SELL' }))}
                        className={cn(
                            "px-6 py-3 text-lg font-semibold rounded-lg transition-all",
                            activeFilters.type === 'SELL'
                                ? "bg-red-500/10 text-red-500"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Sell
                    </button>
                </div>

                {/* Asset Pills */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                    {availableAssets.map((asset) => (
                        <button
                            key={asset}
                            onClick={() => setActiveFilters(prev => ({ ...prev, asset }))}
                            className={cn(
                                "px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-all",
                                activeFilters.asset === asset
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                            )}
                        >
                            {asset}
                        </button>
                    ))}
                </div>

                {/* Filter Row */}
                <div className="flex flex-wrap items-center gap-3 mb-6 p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Fiat</span>
                        <Select
                            value={activeFilters.fiatCurrency}
                            onValueChange={(value) => setActiveFilters(prev => ({ ...prev, fiatCurrency: value }))}
                        >
                            <SelectTrigger className="w-[100px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availableFiatCurrencies.map(currency => (
                                    <SelectItem key={currency.value} value={currency.value}>
                                        {currency.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Amount</span>
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={activeFilters.amount}
                            onChange={(e) => setActiveFilters(prev => ({ ...prev, amount: e.target.value }))}
                            className="w-[150px] h-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Payment</span>
                        <Select
                            value={activeFilters.paymentMethod}
                            onValueChange={(value) => setActiveFilters(prev => ({ ...prev, paymentMethod: value }))}
                        >
                            <SelectTrigger className="w-[150px] h-9">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePaymentMethods.map(method => (
                                    <SelectItem key={method.value} value={method.value}>
                                        {method.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => fetchAds(activeFilters)}
                        className="ml-auto"
                    >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                </div>

                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 text-sm text-muted-foreground border-b border-border">
                    <div className="col-span-3">Advertisers</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-3">Available / Order Limit</div>
                    <div className="col-span-2">Payment</div>
                    <div className="col-span-2 text-right">Trade</div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="py-12 text-center text-muted-foreground">
                        Loading ads...
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="py-12 text-center text-destructive">
                        {error}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && ads.length === 0 && (
                    <div className="py-12 text-center text-muted-foreground">
                        No ads found for the selected filters.
                    </div>
                )}

                {/* Ad Rows */}
                <div className="divide-y divide-border">
                    {ads.map((ad) => {
                        const merchant = getMerchant(ad.merchantId);
                        return (
                            <div
                                key={ad.id}
                                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-4 py-5 hover:bg-muted/30 transition-colors"
                            >
                                {/* Advertiser */}
                                <div className="col-span-3 flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                        {merchant.nickname.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium truncate">{merchant.nickname}</span>
                                            {merchant.isVerified && (
                                                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                            <span>{merchant.completedOrders} orders</span>
                                            <span>{(merchant.completionRate * 100).toFixed(1)}% completion</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="col-span-2 flex flex-col justify-center">
                                    <span className={cn(
                                        "text-xl font-bold",
                                        activeFilters.type === 'BUY' ? "text-green-500" : "text-red-500"
                                    )}>
                                        {formatNumber(ad.price)}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{ad.fiatCurrency}</span>
                                </div>

                                {/* Available / Order Limit */}
                                <div className="col-span-3 flex flex-col justify-center text-sm">
                                    <div className="flex items-center gap-2">
                                        <span className="text-muted-foreground">Available</span>
                                        <span className="font-medium">{formatNumber(ad.availableAmount)} {ad.asset}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-muted-foreground">Limit</span>
                                        <span className="font-medium">
                                            {formatNumber(ad.minLimit)} - {formatNumber(ad.maxLimit)} {ad.fiatCurrency}
                                        </span>
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="col-span-2 flex flex-wrap items-center gap-1">
                                    {ad.paymentMethods.map((method) => (
                                        <Badge
                                            key={method}
                                            variant="outline"
                                            className="text-xs font-normal"
                                        >
                                            {method}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Trade Button */}
                                <div className="col-span-2 flex items-center justify-end">
                                    <Button
                                        onClick={() => handleBuySellClick(ad.id)}
                                        className={cn(
                                            "px-6",
                                            activeFilters.type === 'BUY'
                                                ? "bg-green-500 hover:bg-green-600 text-white"
                                                : "bg-red-500 hover:bg-red-600 text-white"
                                        )}
                                    >
                                        {activeFilters.type === 'BUY' ? 'Buy' : 'Sell'} {ad.asset}
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <P2pOrderCreateDialog
                    isOpen={isOrderDialogOpen}
                    onClose={() => setIsOrderDialogOpen(false)}
                    ad={selectedAd}
                    onPlaceOrder={handlePlaceOrder}
                />

                <P2pOnboardingModal
                    isOpen={isOnboardingOpen}
                    onClose={() => setIsOnboardingOpen(false)}
                    onConfirm={handleOnboardingComplete}
                />
            </div>
        </div>
    );
};

export default P2pMarketPage;