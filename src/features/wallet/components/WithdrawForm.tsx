import React, { useState, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface WithdrawFormProps {
    onWithdraw: (currency: string, amount: number, address: string) => void;
    isLoading?: boolean; // Add isLoading prop
}

const WithdrawForm: React.FC<WithdrawFormProps> = ({ onWithdraw, isLoading = false }) => {
    const [currency, setCurrency] = useState('BTC');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newErrors: Record<string, string> = {};
        if (!currency) {
            newErrors.currency = 'Please select a currency.';
        }
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            newErrors.amount = 'Please enter a valid amount.';
        }
        if (!address) {
            newErrors.address = 'Withdrawal address is required.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onWithdraw(currency, numAmount, address);
        setAmount('');
        setAddress('');
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="withdraw-currency">Cryptocurrency</Label>
                        <select
                            id="withdraw-currency"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={currency}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setCurrency(e.target.value);
                                setErrors((prev) => ({ ...prev, currency: '' }));
                            }}
                            disabled={isLoading}
                        >
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                            <option value="USDT">USDT</option>
                        </select>
                        {errors.currency && <p className="mt-1 text-sm text-destructive-foreground">{errors.currency}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="withdraw-amount">Amount</Label>
                        <Input
                            id="withdraw-amount"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setAmount(e.target.value);
                                setErrors((prev) => ({ ...prev, amount: '' }));
                            }}
                            disabled={isLoading}
                        />
                        {errors.amount && <p className="mt-1 text-sm text-destructive-foreground">{errors.amount}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="withdraw-address">Withdrawal Address</Label>
                        <Input
                            id="withdraw-address"
                            type="text"
                            value={address}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setAddress(e.target.value);
                                setErrors((prev) => ({ ...prev, address: '' }));
                            }}
                            placeholder="Recipient's wallet address"
                            disabled={isLoading}
                        />
                        {errors.address && <p className="mt-1 text-sm text-destructive-foreground">{errors.address}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        Request Withdrawal
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default WithdrawForm;
