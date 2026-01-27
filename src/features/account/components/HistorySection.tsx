import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import TransactionHistory from '@/features/wallet/components/TransactionHistory';

const HistorySection: React.FC = () => {
    return (
        <Card className="bg-background border-none shadow-none">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-semibold">Transaction History</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
                <TransactionHistory />
            </CardContent>
        </Card>
    );
};

export default HistorySection;
