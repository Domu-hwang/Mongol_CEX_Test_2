import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import DepositForm from '../components/DepositForm';

const DepositPage: React.FC = () => {
    const navigate = useNavigate();

    const handleDeposit = (currency: string, amount: number, address: string) => {
        console.log('Deposit:', { currency, amount, address });
        // TODO: Implement actual deposit logic
    };

    return (
        <div className="container mx-auto py-6 px-10 bg-background text-foreground space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/wallet')}>
                    ← Back to Wallet
                </Button>
                <h1 className="text-3xl font-bold">Deposit</h1>
            </div>
            <div className="max-w-md">
                <DepositForm onDeposit={handleDeposit} />
            </div>
        </div>
    );
};

export default DepositPage;
