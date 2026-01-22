import React, { useState, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface DepositFormProps {
    onDeposit: (currency: string, amount: number, address: string) => void;
    isLoading?: boolean;
}

const DepositForm: React.FC<DepositFormProps> = ({ onDeposit, isLoading = false }) => {
    const [currency, setCurrency] = useState('BTC');
    const [amount, setAmount] = useState('');
    const [address, setAddress] = useState('bitcoin-deposit-address-example'); // Example address
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
            newErrors.address = 'Deposit address is required.';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onDeposit(currency, numAmount, address);
        setAmount('');
        // setAddress(''); // Keep address for consistency or clear based on UX
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="deposit-currency">Cryptocurrency</Label>
                        <select
                            id="deposit-currency"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={currency}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                setCurrency(e.target.value);
                                setErrors((prev) => ({ ...prev, currency: '' }));
                            }}
                        >
                            <option value="USDT">USDT</option>
                            <option value="BTC">BTC</option>
                            <option value="ETH">ETH</option>
                        </select>
                        {errors.currency && <p className="mt-1 text-sm text-destructive-foreground">{errors.currency}</p>}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="deposit-amount">Amount</Label>
                        <Input
                            id="deposit-amount"
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
                        <Label htmlFor="deposit-address">Deposit Address</Label>
                        <Input
                            id="deposit-address"
                            type="text"
                            value={address}
                            readOnly
                            className="cursor-copy"
                            onClick={(e: React.MouseEvent<HTMLInputElement>) => navigator.clipboard.writeText((e.target as HTMLInputElement).value)}
                            title="Click to copy"
                            disabled={isLoading}
                        />
                        <p className="mt-2 text-xs text-muted-foreground">Click to copy address.</p>
                        {errors.address && <p className="mt-1 text-sm text-destructive-foreground">{errors.address}</p>}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        Request Deposit
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default DepositForm;
