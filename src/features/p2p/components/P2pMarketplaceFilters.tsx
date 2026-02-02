import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface P2pMarketplaceFiltersProps {
    onApplyFilters: (filters: {
        fiatCurrency: string;
        paymentMethod: string;
        amountRange: { min?: number; max?: number };
    }) => void;
    selectedFiatCurrency: string;
    onFiatCurrencyChange: (currency: string) => void;
}

const fiatCurrencies = [{ value: 'MNT', label: 'MNT' }];
const paymentMethods = [
    { value: 'all', label: 'All Payment Methods' },
    { value: 'Khan Bank', label: 'Khan Bank' },
    { value: 'TDB', label: 'TDB' },
    { value: 'State Bank', label: 'State Bank' },
];

const P2pMarketplaceFilters: React.FC<P2pMarketplaceFiltersProps> = ({
    onApplyFilters,
    selectedFiatCurrency,
    onFiatCurrencyChange,
}) => {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');

    const handleApplyFilters = () => {
        onApplyFilters({
            fiatCurrency: selectedFiatCurrency,
            paymentMethod: selectedPaymentMethod === 'all' ? '' : selectedPaymentMethod,
            amountRange: {
                min: minAmount ? parseFloat(minAmount) : undefined,
                max: maxAmount ? parseFloat(maxAmount) : undefined,
            },
        });
    };

    return (
        <div className="p-4 border rounded-lg shadow-sm bg-card space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="fiatCurrency" className="block text-sm font-medium text-muted-foreground mb-1">Fiat Currency</label>
                    <Select value={selectedFiatCurrency} onValueChange={onFiatCurrencyChange}>
                        <SelectTrigger id="fiatCurrency">
                            <SelectValue placeholder="Select Fiat" />
                        </SelectTrigger>
                        <SelectContent>
                            {fiatCurrencies.map((currency) => (
                                <SelectItem key={currency.value} value={currency.value}>
                                    {currency.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label htmlFor="paymentMethod" className="block text-sm font-medium text-muted-foreground mb-1">Payment Method</label>
                    <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                        <SelectTrigger id="paymentMethod">
                            <SelectValue placeholder="All Payment Methods" />
                        </SelectTrigger>
                        <SelectContent>
                            {paymentMethods.map((method) => (
                                <SelectItem key={method.value} value={method.value}>
                                    {method.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label htmlFor="minAmount" className="block text-sm font-medium text-muted-foreground mb-1">Min Amount ({selectedFiatCurrency})</label>
                    <Input
                        id="minAmount"
                        type="number"
                        value={minAmount}
                        onChange={(e) => setMinAmount(e.target.value)}
                        placeholder="Min"
                    />
                </div>

                <div>
                    <label htmlFor="maxAmount" className="block text-sm font-medium text-muted-foreground mb-1">Max Amount ({selectedFiatCurrency})</label>
                    <Input
                        id="maxAmount"
                        type="number"
                        value={maxAmount}
                        onChange={(e) => setMaxAmount(e.target.value)}
                        placeholder="Max"
                    />
                </div>
            </div>

            <Button onClick={handleApplyFilters} className="w-full">
                Apply Filters
            </Button>
        </div>
    );
};

export default P2pMarketplaceFilters;
