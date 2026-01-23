import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

const DepositOverviewCard: React.FC = () => {
    return (
        <Card className="bg-black">
            <CardContent className="p-4 flex flex-col items-start space-y-4">
                <Wallet className="h-8 w-8 text-gray-400" />
                <h4 className="text-lg font-semibold text-white">Deposit</h4>
                <Button variant="outline" className="w-full">Deposit</Button>
            </CardContent>
        </Card>
    );
};

export default DepositOverviewCard;
