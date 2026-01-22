import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AssetList from '../features/wallet/components/AssetList';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const WalletPage: React.FC = () => {
    const navigate = useNavigate();

    // Mock data for assets (expanded to include 24h change)
    const mockAssets = [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: 0.5, usdValue: 35000 * 0.5, price: 35000, change24h: 0.20, logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026' },
        { id: '2', name: 'Ethereum', symbol: 'ETH', balance: 2.0, usdValue: 2000 * 2.0, price: 2000, change24h: -0.05, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026' },
        { id: '3', name: 'Ripple', symbol: 'XRP', balance: 1000, usdValue: 0.5 * 1000, price: 0.5, change24h: 0.10, logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=026' },
        { id: '4', name: 'Litecoin', symbol: 'LTC', balance: 10, usdValue: 70 * 10, price: 70, change24h: 0.02, logoUrl: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=026' },
    ];

    const totalBalanceUSD = mockAssets.reduce((sum, asset) => sum + asset.usdValue, 0);

    const handleDepositClick = () => {
        // Implement navigation to Deposit page or open a modal
        navigate('/wallet/deposit');
        console.log('Navigate to Deposit');
    };

    const handleWithdrawClick = () => {
        // Implement navigation to Withdraw page or open a modal
        navigate('/wallet/withdraw');
        console.log('Navigate to Withdraw');
    };

    return (
        <div className="container mx-auto py-6 px-10 bg-background text-foreground space-y-8">
            <h1 className="text-3xl font-bold mb-6">My Wallet</h1>

            {/* My Balance Section */}
            <Card className="p-6 bg-gray-100 dark:bg-gray-800 border-none shadow-sm">
                <CardHeader className="p-0 mb-4">
                    <CardTitle className="text-xl font-semibold">My balance</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-4xl font-bold text-gray-900 dark:text-white">
                        {totalBalanceUSD.toFixed(2)} USD
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        Equivalent to approximately{' '}
                        {(mockAssets.find(asset => asset.symbol === 'BTC')?.balance || 0).toFixed(4)} BTC
                    </p>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Button onClick={handleDepositClick} className="flex-1 py-6 text-lg bg-black text-white hover:bg-gray-800 border border-white">
                    Deposit
                </Button>
                <Button onClick={handleWithdrawClick} className="flex-1 py-6 text-lg bg-black text-white hover:bg-gray-800 border border-white">
                    Withdraw
                </Button>
            </div>

            {/* My Assets Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold">My assets</h2>
                <AssetList assets={mockAssets} />
            </div>
        </div>
    );
};

export default WalletPage;
