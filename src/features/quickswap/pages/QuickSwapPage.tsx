import React from 'react';
import { QuickSwapForm } from '../components/QuickSwapForm';
import { QuickSwapHistory } from '../components/QuickSwapHistory';
import { Card } from '@/components/ui/card';

export const QuickSwapPage: React.FC = () => {
    return (
        <div className="container mx-auto flex flex-col items-center py-12 px-10 space-y-8">
            <h1 className="text-3xl font-bold text-center">Quick Swap</h1>
            {/* Swap Panel */}
            <Card className="p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">Swap panel</h2>
                <QuickSwapForm />
            </Card>
            {/* History Section */}
            <Card className="p-6 w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">History</h2>
                <QuickSwapHistory />
            </Card>
        </div>
    );
};
