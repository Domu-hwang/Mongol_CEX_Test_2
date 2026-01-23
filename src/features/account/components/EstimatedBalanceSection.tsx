import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, Eye } from 'lucide-react';

const EstimatedBalanceSection: React.FC = () => {
    return (
        <Card className="bg-black p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Estimated Balance</h3>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-700">Deposit</Button>
                    <Button variant="outline" size="sm" className="text-gray-300 border-gray-600 hover:bg-gray-700">Withdraw</Button>
                </div>
            </div>
            <div className="flex items-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-white">0.00</span>
                <span className="text-lg text-gray-400">BTC</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
                <Eye className="h-4 w-4 text-gray-400 cursor-pointer" />
            </div>
            <p className="text-gray-500 text-sm">≈ $0.00</p>
            <p className="text-gray-500 text-sm">Today's P&L <span className="text-green-500">+ $0.00 (0.00%)</span></p>
        </Card>
    );
};

export default EstimatedBalanceSection;
