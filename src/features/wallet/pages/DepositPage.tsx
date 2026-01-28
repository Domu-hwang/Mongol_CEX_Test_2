import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import DepositForm from '../components/DepositForm';
import TransactionHistory from '../components/TransactionHistory';
import { useMemo } from 'react'; // Import useMemo for filtering

// Placeholder for FAQ content
const FAQSection: React.FC = () => (
    <Card className="p-4 space-y-4 border-border">
        <h3 className="text-lg font-semibold">FAQ</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:underline">How to deposit crypto? (Video)</a></li>
            <li><a href="#" className="hover:underline">How to Deposit Crypto Step-by-step Guide</a></li>
            <li><a href="#" className="hover:underline">Deposit hasn't arrived?</a></li>
            <li><a href="#" className="hover:underline">Deposit & Withdrawal Status query</a></li>
        </ul>
    </Card>
);

const DepositPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-foreground py-6 px-4 md:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/my-assets')}
                        className="shrink-0"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold">Wallet</h1>
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
                    <Button
                        variant="ghost"
                        className="bg-background text-foreground shadow-sm"
                    >
                        Add Fund
                    </Button>
                    <Button
                        variant="ghost"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => navigate('/wallet/withdraw')}
                    >
                        Withdraw
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Deposit Form */}
                    <div className="lg:col-span-2">
                        <DepositForm />
                    </div>

                    {/* Right Sidebar - FAQ */}
                    <div className="lg:col-span-1">
                        <FAQSection />
                    </div>
                </div>

                {/* Recent Deposits Section - Bottom */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Recent Deposits</h2>
                    <TransactionHistory typeFilter="Deposit" /> {/* Filter for deposit history */}
                </div>
            </div>
        </div>
    );
};

export default DepositPage;