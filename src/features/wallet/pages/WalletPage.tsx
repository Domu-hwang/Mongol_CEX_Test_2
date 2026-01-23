import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssetList from '../components/AssetList';
import { useNavigate } from 'react-router-dom';
import TransactionHistory from '../components/TransactionHistory';

const WalletPage: React.FC = () => {
    const navigate = useNavigate();

    // Mock data for assets (expanded to include 24h change)
    const mockAssets = [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: 0.5, usdValue: 35000 * 0.5, price: 35000, change24h: 0.20, logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026' },
        { id: '2', name: 'Ethereum', symbol: 'ETH', balance: 2.0, usdValue: 2000 * 2.0, price: 2000, change24h: -0.05, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
        { id: '3', name: 'Ripple', symbol: 'XRP', balance: 1000, usdValue: 0.5 * 1000, price: 0.5, change24h: 0.10, logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=026' },
        { id: '4', name: 'Litecoin', symbol: 'LTC', balance: 10, usdValue: 70 * 10, price: 70, change24h: 0.02, logoUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=026' },
    ];

    const supportedCurrencies = [
        { name: 'USD', symbol: '$', conversionRate: 1 },
        { name: 'Bitcoin', symbol: 'BTC', conversionRate: 1 / (mockAssets.find(asset => asset.symbol === 'BTC')?.price || 1) },
        { name: 'Ethereum', symbol: 'ETH', conversionRate: 1 / (mockAssets.find(asset => asset.symbol === 'ETH')?.price || 1) },
    ];

    const totalBalanceUSD = mockAssets.reduce((sum, asset) => sum + asset.usdValue, 0);

    const [selectedCurrency, setSelectedCurrency] = useState(supportedCurrencies[0]);
    const [displayedBalance, setDisplayedBalance] = useState(totalBalanceUSD);

    useEffect(() => {
        // Update displayed balance when selected currency changes
        setDisplayedBalance(totalBalanceUSD * selectedCurrency.conversionRate);
    }, [selectedCurrency, totalBalanceUSD]);

    const handleCurrencyChange = (currency: { name: string, symbol: string, conversionRate: number }) => {
        setSelectedCurrency(currency);
    };

    const handleDepositClick = () => {
        navigate('/wallet/deposit');
        console.log('Navigate to Deposit');
    };

    const handleWithdrawClick = () => {
        navigate('/wallet/withdraw');
        console.log('Navigate to Withdraw');
    };

    const handleTradeClick = (symbol: string) => {
        navigate(`/trade/${symbol}`);
        console.log(`Navigate to Trade page for ${symbol}`);
    };

    return (
        <div className="container mx-auto py-6 px-10 bg-background text-foreground space-y-8">
            {/* My Balance Section */}
            <Card className="p-6 bg-gray-100 dark:bg-gray-800 border-none shadow-sm">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-semibold">My balance</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="flex items-center space-x-2">
                        <p className="text-4xl font-bold text-gray-900 dark:text-white">
                            {selectedCurrency.symbol}{displayedBalance.toFixed(2)}
                        </p>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-900 dark:text-white"
                                >
                                    <ChevronRight className="h-6 w-6" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-40 bg-white dark:bg-gray-700 p-2 rounded shadow-lg">
                                {supportedCurrencies.map((currency) => (
                                    <Button
                                        key={currency.name}
                                        variant="ghost"
                                        className="w-full justify-start text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                        onClick={() => handleCurrencyChange(currency)}
                                    >
                                        {currency.name} ({currency.symbol})
                                    </Button>
                                ))}
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button onClick={handleDepositClick} variant="default" className="flex-1 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                    Deposit
                </Button>
                <Button onClick={handleWithdrawClick} variant="outline" className="flex-1 py-6 text-lg">
                    Withdraw
                </Button>
            </div>

            {/* My Assets Section */}
            <Tabs defaultValue="portfolio" className="space-y-4">
                <TabsList className="bg-gray-200 dark:bg-gray-700">
                    <TabsTrigger value="portfolio" className="text-lg px-6 py-2">My Portfolio</TabsTrigger>
                    <TabsTrigger value="history" className="text-lg px-6 py-2">History</TabsTrigger>
                </TabsList>
                <TabsContent value="portfolio" className="space-y-4">
                    <h2 className="text-2xl font-bold">My assets</h2>
                    <AssetList assets={mockAssets} selectedCurrency={selectedCurrency} onTradeClick={handleTradeClick} />
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                    <h2 className="text-2xl font-bold">History</h2>
                    <TransactionHistory />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default WalletPage;
