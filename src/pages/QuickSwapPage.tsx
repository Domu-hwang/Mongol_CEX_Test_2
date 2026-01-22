import React from 'react';
import { QuickSwapForm } from '../features/quickswap/components/QuickSwapForm';
import { QuickSwapHistory } from '../features/quickswap/components/QuickSwapHistory';
import { Card } from '../components/ui/card';

export const QuickSwapPage: React.FC = () => {
    return (
        <div className="container mx-auto py-12 px-10"> {/* Increased vertical padding by ~40% (from py-8 to py-12) and horizontal padding (added px-10) */}
            <h1 className="text-3xl font-bold text-center mb-8">Quick Swap</h1>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                <Card className="p-6 md:col-span-3"> {/* 60% width */}
                    <h2 className="text-2xl font-semibold mb-4">New Swap</h2>
                    <QuickSwapForm />
                </Card>
                <Card className="p-6 md:col-span-2"> {/* 40% width */}
                    <h2 className="text-2xl font-semibold mb-4">Swap History</h2>
                    <QuickSwapHistory />
                </Card>
            </div>
        </div>
    );
};
