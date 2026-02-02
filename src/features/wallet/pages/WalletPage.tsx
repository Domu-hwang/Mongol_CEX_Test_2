import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssetList from '../components/AssetList';
import { useNavigate } from 'react-router-dom';
import TransactionHistory from '../components/TransactionHistory';
import EstimatedBalanceSection from '@/features/account/components/EstimatedBalanceSection';
import P2pWalletAccount from '../components/P2pWalletAccount'; // Import P2pWalletAccount

const WalletPage: React.FC = () => {
    const navigate = useNavigate();

    // Mock data for assets (expanded to include 24h change)
    const mockAssets = [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: 0.5, usdValue: 35000 * 0.5, price: 35000, change24h: 0.20, logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026' },
        { id: '2', name: 'Ethereum', symbol: 'ETH', balance: 2.0, usdValue: 2000 * 2.0, price: 2000, change24h: -0.05, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
        { id: '3', name: 'Ripple', symbol: 'XRP', balance: 1000, usdValue: 0.5 * 1000, price: 0.5, change24h: 0.10, logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=026' },
        { id: '4', name: 'Litecoin', symbol: 'LTC', balance: 10, usdValue: 70 * 10, price: 70, change24h: 0.02, logoUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=026' },
    ];

    // Mock P2P account balance
    const mockP2PBalance = 1500; // Example USDT balance in P2P account

    const supportedCurrencies = [
        { name: 'USD', symbol: '$', conversionRate: 1 },
    ];

    const [selectedCurrency] = useState(supportedCurrencies[0]);

    const handleTradeClick = (symbol: string) => {
        navigate(`/trade/${symbol}`);
    };

    const handleP2PTransferClick = () => {
        // TODO: Implement P2P transfer logic or navigate to a transfer page
        console.log('P2P Transfer clicked');
    };

    return (
        <div className="container mx-auto py-6 px-10 bg-background text-foreground space-y-8">
            {/* Estimated Balance Section */}
            <EstimatedBalanceSection />

            {/* My Assets Section */}
            <Tabs defaultValue="portfolio" className="space-y-4">
                <TabsList className="bg-muted">
                    <TabsTrigger value="portfolio" className="text-lg px-6 py-2">My Portfolio</TabsTrigger>
                    <TabsTrigger value="p2p-account" className="text-lg px-6 py-2">P2P Account</TabsTrigger>
                    <TabsTrigger value="history" className="text-lg px-6 py-2">History</TabsTrigger>
                </TabsList>
                <TabsContent value="portfolio" className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">My assets</h2>
                    <AssetList assets={mockAssets} selectedCurrency={selectedCurrency} onTradeClick={handleTradeClick} />
                </TabsContent>
                <TabsContent value="p2p-account" className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">P2P Account</h2>
                    <P2pWalletAccount balance={mockP2PBalance} currency="USDT" onTransferClick={handleP2PTransferClick} />
                </TabsContent>
                <TabsContent value="history" className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">History</h2>
                    <TransactionHistory />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default WalletPage;
