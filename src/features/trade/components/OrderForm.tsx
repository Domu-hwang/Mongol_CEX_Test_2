import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

interface OrderFormProps {
    currentMarket: string;
    availableBalance: { base: number; quote: number };
    onPlaceOrder: (type: 'buy' | 'sell', orderType: 'limit' | 'market' | 'stop-limit', price: number, amount: number) => void;
    isLoading?: boolean;
}

const OrderForm: React.FC<OrderFormProps> = ({
    currentMarket,
    availableBalance,
    onPlaceOrder,
    isLoading,
}) => {
    const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
    const [tradeType, setTradeType] = useState<'limit' | 'market' | 'stop-limit'>('limit');
    const [price, setPrice] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [total, setTotal] = useState<string>('');
    const [takeProfit, setTakeProfit] = useState<boolean>(false);
    const [stopLoss, setStopLoss] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [baseAsset, quoteAsset] = currentMarket.split('/');

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPrice = e.target.value;
        setPrice(newPrice);
        if (newPrice && amount) {
            setTotal((parseFloat(newPrice) * parseFloat(amount)).toFixed(2));
        } else {
            setTotal('');
        }
        setErrors((prev) => ({ ...prev, price: '' }));
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newAmount = e.target.value;
        setAmount(newAmount);
        if (price && newAmount) {
            setTotal((parseFloat(price) * parseFloat(newAmount)).toFixed(2));
        } else {
            setTotal('');
        }
        setErrors((prev) => ({ ...prev, amount: '' }));
    };

    const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTotal = e.target.value;
        setTotal(newTotal);
        if (price && newTotal && parseFloat(price) > 0) {
            setAmount((parseFloat(newTotal) / parseFloat(price)).toFixed(4));
        } else {
            setAmount('');
        }
        setErrors((prev) => ({ ...prev, total: '' }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        const numPrice = parseFloat(price);
        const numAmount = parseFloat(amount);
        const numTotal = parseFloat(total);

        if (tradeType !== 'market' && (isNaN(numPrice) || numPrice <= 0)) {
            newErrors.price = 'Please enter a valid price.';
        }
        if (isNaN(numAmount) || numAmount <= 0) {
            newErrors.amount = 'Please enter a valid amount.';
        }
        if (isNaN(numTotal) || numTotal <= 0) {
            newErrors.total = 'Please enter a valid total.';
        }

        if (orderSide === 'buy') {
            if (numTotal > availableBalance.quote) {
                newErrors.total = `Insufficient balance: You only have ${availableBalance.quote.toFixed(2)} ${quoteAsset}.`;
            }
        } else {
            if (numAmount > availableBalance.base) {
                newErrors.amount = `Insufficient balance: You only have ${availableBalance.base.toFixed(4)} ${baseAsset}.`;
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onPlaceOrder(orderSide, tradeType, parseFloat(price), parseFloat(amount));
            setPrice('');
            setAmount('');
            setTotal('');
            setErrors({});
        }
    };

    const isPriceEditable = tradeType === 'limit' || tradeType === 'stop-limit';

    return (
        <div className="bg-card p-4 rounded-lg shadow-md border border-border">
            <div className="flex bg-muted rounded-md p-1 mb-4">
                <Button
                    variant="ghost"
                    className={`flex-1 ${orderSide === 'buy' ? 'bg-success text-success-foreground' : 'text-muted-foreground'}`}
                    onClick={() => setOrderSide('buy')}
                >
                    Buy
                </Button>
                <Button
                    variant="ghost"
                    className={`flex-1 ${orderSide === 'sell' ? 'bg-destructive text-destructive-foreground' : 'text-muted-foreground'}`}
                    onClick={() => setOrderSide('sell')}
                >
                    Sell
                </Button>
            </div>

            <Tabs value={tradeType} onValueChange={(value) => setTradeType(value as 'limit' | 'market' | 'stop-limit')} className="mb-4">
                <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-md">
                    <TabsTrigger value="limit">Limit</TabsTrigger>
                    <TabsTrigger value="market">Market</TabsTrigger>
                    <TabsTrigger value="stop-limit">Stop Limit</TabsTrigger>
                </TabsList>
                <TabsContent value={tradeType} className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            label="Price"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={price}
                            onChange={handlePriceChange}
                            error={errors.price}
                            readOnly={isLoading || !isPriceEditable}
                            suffix={quoteAsset}
                        />
                        <div className="flex justify-between items-center text-sm">
                            <Input
                                label="Amount"
                                type="number"
                                step="0.0001"
                                placeholder="0.0000"
                                value={amount}
                                onChange={handleAmountChange}
                                error={errors.amount}
                                readOnly={isLoading}
                                suffix={baseAsset}
                                className="flex-grow mr-2"
                            />
                            <div className="flex space-x-1">
                                {[25, 50, 75, 100].map((percent) => (
                                    <Button
                                        key={percent}
                                        type="button"
                                        variant="outline"
                                        size="xs"
                                        onClick={() => {
                                            const balanceToUse = orderSide === 'buy' ? availableBalance.quote : availableBalance.base;
                                            const calculatedAmount = (balanceToUse * percent / 100) / (parseFloat(price) || 1);
                                            setAmount(calculatedAmount.toFixed(4));
                                            if (price) setTotal((calculatedAmount * parseFloat(price)).toFixed(2));
                                        }}
                                    >
                                        {percent}%
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="Total"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={total}
                            onChange={handleTotalChange}
                            error={errors.total}
                            readOnly={isLoading || tradeType === 'market'}
                            suffix={quoteAsset}
                        />

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={takeProfit}
                                    onChange={(e) => setTakeProfit(e.target.checked)}
                                    className="rounded border-border bg-background"
                                />
                                <span>Take profit</span>
                            </label>
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={stopLoss}
                                    onChange={(e) => setStopLoss(e.target.checked)}
                                    className="rounded border-border bg-background"
                                />
                                <span>Stop loss</span>
                            </label>
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>Available:</span>
                            <span>
                                {orderSide === 'buy'
                                    ? `${availableBalance.quote.toFixed(2)} ${quoteAsset}`
                                    : `${availableBalance.base.toFixed(4)} ${baseAsset}`}
                            </span>
                        </div>

                        <Button
                            type="submit"
                            variant={orderSide === 'buy' ? 'success' : 'destructive'}
                            className="w-full font-bold"
                            disabled={isLoading}
                            isLoading={isLoading}
                        >
                            {orderSide === 'buy' ? `Buy ${baseAsset}` : `Sell ${baseAsset}`}
                        </Button>
                    </form>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default OrderForm;
