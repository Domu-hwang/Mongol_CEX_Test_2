import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import AssetList from '@/features/wallet/components/AssetList';
import TransactionHistory from '@/features/wallet/components/TransactionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import EstimatedBalanceSection from './EstimatedBalanceSection'; // Import EstimatedBalanceSection

const UserAssetsSection: React.FC = () => {
    const navigate = useNavigate();

    // Reusing mock data logic from WalletPage for consistency in this view
    const mockAssets = [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: 0.5, usdValue: 35000 * 0.5, price: 35000, change24h: 0.20, logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026' },
        { id: '2', name: 'Ethereum', symbol: 'ETH', balance: 2.0, usdValue: 2000 * 2.0, price: 2000, change24h: -0.05, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
        { id: '3', name: 'Ripple', symbol: 'XRP', balance: 1000, usdValue: 0.5 * 1000, price: 0.5, change24h: 0.10, logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=026' },
        { id: '4', name: 'Litecoin', symbol: 'LTC', balance: 10, usdValue: 70 * 10, price: 70, change24h: 0.02, logoUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=026' },
    ];

    const supportedCurrencies = [
        { name: 'USD', symbol: '$', conversionRate: 1 },
    ];
    const [selectedCurrency] = useState(supportedCurrencies[0]);

    const handleTradeClick = (symbol: string) => {
        navigate(`/trade/${symbol}`);
    };

    return (
        <div className="space-y-6"> {/* Use a div to wrap for overall spacing */}
            <EstimatedBalanceSection /> {/* Add EstimatedBalanceSection here */}

            <Card className="bg-background border-none shadow-none">
                <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl font-semibold">My Assets</CardTitle>
                </CardHeader>
                <CardContent className="px-0">
                    <Tabs defaultValue="portfolio" className="space-y-4">
                        <TabsList className="bg-muted">
                            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                            <TabsTrigger value="history">History</TabsTrigger>
                        </TabsList>
                        <TabsContent value="portfolio" className="space-y-4">
                            <AssetList assets={mockAssets} selectedCurrency={selectedCurrency} onTradeClick={handleTradeClick} />
                        </TabsContent>
                        <TabsContent value="history" className="space-y-4">
                            <TransactionHistory />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default UserAssetsSection;
