import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Clock } from 'lucide-react';

const TradeOverviewCard: React.FC = () => {
    return (
        <Card className="bg-card border border-border">
            <CardContent className="p-4 flex flex-col items-start space-y-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
                <h4 className="text-lg font-semibold text-foreground">Trade</h4>
                <p className="text-muted-foreground text-sm">Pending</p>
            </CardContent>
        </Card>
    );
};

export default TradeOverviewCard;
