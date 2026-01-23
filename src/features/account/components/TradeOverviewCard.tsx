import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

const TradeOverviewCard: React.FC = () => {
    return (
        <Card className="bg-black">
            <CardContent className="p-4 flex flex-col items-start space-y-4">
                <Clock className="h-8 w-8 text-gray-400" />
                <h4 className="text-lg font-semibold text-white">Trade</h4>
                <p className="text-gray-400 text-sm">Pending</p>
            </CardContent>
        </Card>
    );
};

export default TradeOverviewCard;
