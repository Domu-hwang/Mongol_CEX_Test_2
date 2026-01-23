import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WithdrawForm from '../components/WithdrawForm';

const WithdrawPage: React.FC = () => {
    const navigate = useNavigate();

    const handleWithdraw = (currency: string, amount: number, address: string) => {
        console.log('Withdraw:', { currency, amount, address });
        // TODO: Implement actual withdrawal logic
    };

    return (
        <div className="container mx-auto py-6 px-10 bg-background text-foreground space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/wallet')}>
                    ← Back to Wallet
                </Button>
                <h1 className="text-3xl font-bold">Withdraw</h1>
            </div>
            <div className="max-w-md">
                <WithdrawForm onWithdraw={handleWithdraw} />
            </div>
        </div>
    );
};

export default WithdrawPage;
