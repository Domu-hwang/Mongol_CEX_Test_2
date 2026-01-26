import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/Button';
import { Wallet } from 'lucide-react';

const DepositOverviewCard: React.FC = () => {
    return (
        <Card className="bg-card border border-border">
            <CardContent className="p-4 flex flex-col items-start space-y-4">
                <Wallet className="h-8 w-8 text-muted-foreground" />
                <h4 className="text-lg font-semibold text-foreground">Deposit</h4>
            </CardContent>
        </Card>
    );
};

export default DepositOverviewCard;
