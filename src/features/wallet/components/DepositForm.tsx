import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';

interface DepositFormProps {
    onDeposit: (currency: string, amount: number, address: string) => void;
}

const DepositForm: React.FC<DepositFormProps> = ({ onDeposit }) => {
    const [currency, setCurrency] = useState('BTC');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('bitcoin-deposit-address-example'); // Example address

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (currency && amount && address) {
            onDeposit(currency, parseFloat(amount), address);
            setAmount('');
        }
    };

    return (
        <Card title="Deposit" className="bg-secondary-700 border border-secondary-600">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="deposit-currency" className="block text-sm font-medium text-gray-300">
                        Cryptocurrency
                    </label>
                    <select
                        id="deposit-currency"
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
                    <label htmlFor="deposit-amount" className="block text-sm font-medium text-gray-300">
                        Amount
                    </label>
                    <Input
                        id="deposit-amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount to deposit"
                        min="0"
                        step="any"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="deposit-address" className="block text-sm font-medium text-gray-300">
                        Deposit Address
                    </label>
                    <Input
                        id="deposit-address"
                        type="text"
                        value={address}
                        readOnly
                        className="bg-secondary-600 cursor-copy"
                        onClick={(e) => navigator.clipboard.writeText((e.target as HTMLInputElement).value)}
                        title="Click to copy"
                    />
                    <p className="mt-2 text-xs text-gray-500">Click to copy address.</p>
                </div>
                <Button type="submit" className="w-full">
                    Request Deposit
                </Button>
            </form>
        </Card>
    );
};

export default DepositForm;
