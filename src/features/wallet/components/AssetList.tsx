import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Import Button component

interface Asset {
    id: string;
    name: string;
    symbol: string;
    balance: number;
    usdValue: number;
    logoUrl?: string;
    change24h?: number; // 24h price change percentage
}

interface Currency {
    name: string;
    symbol: string;
    conversionRate: number;
}

interface AssetListProps {
    assets: Asset[];
    selectedCurrency: Currency;
    onTradeClick: (symbol: string) => void;
}

const AssetList: React.FC<AssetListProps> = ({ assets, selectedCurrency, onTradeClick }) => {
    return (
        <Card className="bg-secondary-700 border border-secondary-600">
            {assets.length === 0 ? (
                <p className="text-center text-gray-500">No assets held.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-600">
                        <thead className="bg-secondary-600">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Logo
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Asset
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    24h Change
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Value ({selectedCurrency.name})
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-secondary-700 divide-y divide-secondary-600">
                            {assets.map((asset) => (
                                <tr key={asset.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {asset.logoUrl && <img src={asset.logoUrl} alt={`${asset.name} logo`} className="h-6 w-6 rounded-full inline-block mr-2" />}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{asset.name} ({asset.symbol})</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{asset.balance.toFixed(8)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {asset.change24h !== undefined ? (
                                            <span className={asset.change24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                                                {asset.change24h >= 0 ? '+' : ''}{(asset.change24h * 100).toFixed(2)}%
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                        {selectedCurrency.symbol}{(asset.usdValue * selectedCurrency.conversionRate).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Button
                                            variant="default" // Use default variant for primary styling
                                            size="sm"
                                            onClick={() => onTradeClick(asset.symbol)}
                                            className="ml-2"
                                        >
                                            Trade
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </Card>
    );
};

export default AssetList;
