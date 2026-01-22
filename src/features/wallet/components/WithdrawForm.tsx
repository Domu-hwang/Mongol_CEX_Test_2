import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface WithdrawFormProps {
    onWithdraw: (currency: string, amount: number, address: string) => void;
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw }) => {
    const [currency, setCurrency] = useState('BTC');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currency && amount && address) {
            onWithdraw(currency, parseFloat(amount), address);
            setAmount('');
            setAddress('');
        }
    };

    return (
        <Card title="Withdraw" className="bg-secondary-700 border border-secondary-600">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="withdraw-currency" className="block text-sm font-medium text-gray-300">
                        Cryptocurrency
                    </label>
                    <select
                        id="withdraw-currency"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-secondary-500 bg-secondary-600 text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-600 focus:border-primary-600 sm:text-sm rounded-md"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                    >
                        <option>BTC</option>
                        <option>ETH</option>
                        <option>USDT</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-300">
                        Amount
                    </label>
                    <Input
                        id="withdraw-amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount to withdraw"
                        min="0"
                        step="any"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="withdraw-address" className="block text-sm font-medium text-gray-300">
                        Withdrawal Address
                    </label>
                    <Input
                        id="withdraw-address"
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Recipient's wallet address"
                        required
                    />
                </div>
                <Button type="submit" className="w-full">
                    Request Withdrawal
                </Button>
            </form>
        </Card>
    );
};

export default WithdrawForm;
