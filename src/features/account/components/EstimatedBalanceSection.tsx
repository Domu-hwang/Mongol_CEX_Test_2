import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { ChevronDown, Eye } from 'lucide-react';

const EstimatedBalanceSection: React.FC = () => {
    return (
        <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-foreground">Estimated Balance</h3>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">Deposit</Button>
                    <Button variant="outline" size="sm">Withdraw</Button>
                    <Button variant="outline" size="sm">Cash In</Button>
                </div>
            </div>
            <div className="flex items-center space-x-2 mb-2">
                <span className="text-3xl font-bold text-foreground">0.00</span>
                <span className="text-lg text-muted-foreground">BTC</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                <Eye className="h-4 w-4 text-muted-foreground cursor-pointer" />
            </div>
            <p className="text-muted-foreground text-sm">≈ $0.00</p>
            <p className="text-muted-foreground text-sm">Today's P&L <span className="text-green-500 font-medium">+ $0.00 (0.00%)</span></p>
        </Card>
    );
};

export default EstimatedBalanceSection;
