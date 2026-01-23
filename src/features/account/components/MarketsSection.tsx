import React from 'react';
import { useNavigate } from 'react-router-dom';
import AssetList from '@/features/wallet/components/AssetList';

const MarketsSection: React.FC = () => {
    const navigate = useNavigate();

    const mockAssets = [
        { id: '1', name: 'Bitcoin', symbol: 'BTC', balance: 0.5, usdValue: 30000, logoUrl: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png', change24h: 0.025 },
        { id: '2', name: 'Ethereum', symbol: 'ETH', balance: 2.5, usdValue: 7500, logoUrl: 'https://cryptologos.cc/logos/ethereum-eth-logo.png', change24h: -0.012 },
        { id: '3', name: 'XRP', symbol: 'XRP', balance: 1000, usdValue: 500, logoUrl: 'https://cryptologos.cc/logos/xrp-xrp-logo.png', change24h: 0.005 },
        { id: '4', name: 'BNB', symbol: 'BNB', balance: 5, usdValue: 2000, logoUrl: 'https://cryptologos.cc/logos/bnb-bnb-logo.png', change24h: 0.031 },
    ];

    const selectedCurrency = {
        name: 'USD',
        symbol: '$',
        conversionRate: 1,
    };

    const handleTradeClick = (symbol: string) => {
        navigate(`/trade?symbol=${symbol}`);
    };

    return (
        <div className="bg-card p-4 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-4">Markets</h3>
            <AssetList
                assets={mockAssets}
                selectedCurrency={selectedCurrency}
                onTradeClick={handleTradeClick}
            />
        </div>
    );
};

export default MarketsSection;
