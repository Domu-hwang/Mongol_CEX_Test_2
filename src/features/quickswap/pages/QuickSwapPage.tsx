import React from 'react';
import { QuickSwapForm } from '../components/QuickSwapForm';
import { QuickSwapHistory } from '../components/QuickSwapHistory';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Zap } from 'lucide-react';

export const QuickSwapPage: React.FC = () => {
    return (
        <div className="container mx-auto flex flex-col items-center py-12 px-4 md:px-10 space-y-8">
            {/* Page Header */}
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <Zap className="h-8 w-8 text-yellow-500" />
                    <h1 className="text-3xl font-bold text-foreground">Quick Swap</h1>
                </div>
                <p className="text-muted-foreground">
                    Instantly swap between cryptocurrencies at the best rates
                </p>
            </div>

            {/* Swap Panel */}
            <Card className="w-full max-w-md border-border">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Swap</CardTitle>
                    <CardDescription>Trade tokens instantly with no order book</CardDescription>
                </CardHeader>
                <CardContent>
                    <QuickSwapForm />
                </CardContent>
            </Card>

            {/* History Section */}
            <Card className="w-full max-w-md border-border">
                <CardHeader className="pb-4">
                    <CardTitle className="text-lg">Recent Swaps</CardTitle>
                    <CardDescription>Your swap transaction history</CardDescription>
                </CardHeader>
                <CardContent>
                    <QuickSwapHistory />
                </CardContent>
            </Card>
        </div>
    );
};
