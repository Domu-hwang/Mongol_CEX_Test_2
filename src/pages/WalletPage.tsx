import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import AssetList from '../features/wallet/components/AssetList';
import DepositForm from '../features/wallet/components/DepositForm';
import WithdrawForm from '../features/wallet/components/WithdrawForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';

const WalletPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('assets'); // 'assets', 'deposit', 'withdraw'

    // Mock data for assets
    const mockAssets = [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: 0.5, usdValue: 35000 * 0.5 },
        { id: '2', name: 'Ethereum', symbol: 'ETH', balance: 2.0, usdValue: 2000 * 2.0 },
    ];

    const handleDeposit = (currency: string, amount: number, address: string) => {
        console.log(`Deposit Request: ${amount} ${currency} to ${address}`);
        // Add actual API integration logic here
        alert(`${amount} ${currency} deposit request has been submitted.`);
    };

    const handleWithdraw = (currency: string, amount: number, address: string) => {
        console.log(`Withdrawal Request: ${amount} ${currency} from ${address}`);
        // Add actual API integration logic here
        alert(`${amount} ${currency} withdrawal request has been submitted.`);
    };

    return (
        <div className="container mx-auto p-4"> {/* Keep container and padding, but remove bg color, text color, min-h-screen */}
            <h1 className="text-3xl font-bold mb-6">My Wallet</h1>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <div className="mb-6">
                    <TabsList>
                        <TabsTrigger value="assets">Assets</TabsTrigger>
                        <TabsTrigger value="deposit">Deposit</TabsTrigger>
                        <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="assets">
                    <Card title="Total Assets">
                        <p className="text-2xl font-semibold">
                            {mockAssets.reduce((sum, asset) => sum + asset.usdValue, 0).toFixed(2)} USD
                        </p>
                        <p className="text-gray-500">
                            ~{' '}
                            {(
                                mockAssets.find((asset) => asset.symbol === 'BTC')?.balance || 0
                            ).toFixed(8)}{' '}
                            BTC
                        </p>
                    </Card>
                    <div className="mt-8">
                        <AssetList assets={mockAssets} />
                    </div>
                </TabsContent>

                <TabsContent value="deposit">
                    <DepositForm onDeposit={handleDeposit} />
                </TabsContent>

                <TabsContent value="withdraw">
                    <WithdrawForm onWithdraw={handleWithdraw} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default WalletPage;
