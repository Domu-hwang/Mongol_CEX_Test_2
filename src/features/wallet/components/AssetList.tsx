import React from 'react';
import { Card } from '../../../components/ui/Card';

interface Asset {
    id: string;
    name: string;
    symbol: string;
    balance: number;
    usdValue: number;
}

interface AssetListProps {
    assets: Asset[];
}

const AssetList: React.FC<AssetListProps> = ({ assets }) => {
    return (
        <Card title="My Assets" className="bg-secondary-700 border border-secondary-600">
            {assets.length === 0 ? (
                <p className="text-center text-gray-500">No assets held.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-secondary-600">
                        <thead className="bg-secondary-600">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Asset
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    Quantity
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                    USD Value
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-secondary-700 divide-y divide-secondary-600">
                            {assets.map((asset) => (
                                <tr key={asset.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{asset.name} ({asset.symbol})</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{asset.balance.toFixed(8)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${asset.usdValue.toFixed(2)}</td>
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
