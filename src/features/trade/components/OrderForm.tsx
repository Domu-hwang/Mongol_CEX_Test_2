import React, { useState, useMemo } from 'react';
// import { z } from 'zod'; // Will add zod later for validation
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
// import { toast } from 'react-hot-toast'; // Will add toast later for notifications

// Placeholder types
interface Market {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
}

type OrderSide = 'buy' | 'sell';
type OrderType = 'market' | 'limit';
type Order = any; // Placeholder
type CreateOrderRequest = any; // Placeholder


interface OrderFormProps {
    market: Market;
    balance: number;
    currentPrice: number;
    onSuccess?: (order: Order) => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ market, balance, currentPrice, onSuccess }) => {
    const [side, setSide] = useState<OrderSide>('buy');
    const [type, setType] = useState<OrderType>('market');
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState(currentPrice.toString());

    // const placeOrder = usePlaceOrder(); // Placeholder

    // Calculate total cost
    const total = useMemo(() => {
        const amt = parseFloat(amount) || 0;
        const prc = type === 'market' ? currentPrice : (parseFloat(price) || 0);
        return amt * prc;
    }, [amount, price, type, currentPrice]);

    // Calculate fee (0.1%)
    const fee = total * 0.001;
    const totalWithFee = total + fee;

    // Validation
    const isValid = useMemo(() => {
        const amt = parseFloat(amount);
        if (!amt || amt <= 0) return false;
        if (type === 'limit') {
            const prc = parseFloat(price);
            if (!prc || prc <= 0) return false;
        }
        if (side === 'buy' && totalWithFee > balance) return false;
        return true;
    }, [amount, price, type, side, totalWithFee, balance]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        console.log('Order submitted:', {
            symbol: market.symbol,
            side,
            type,
            amount: parseFloat(amount),
            ...(type === 'limit' && { price: parseFloat(price) }),
        });
        // try {
        //   await placeOrder.mutateAsync({
        //     symbol: market.symbol,
        //     side,
        //     type,
        //     amount: parseFloat(amount),
        //     ...(type === 'limit' && { price: parseFloat(price) }),
        //   });

        //   toast.success(`${side === 'buy' ? 'Buy' : 'Sell'} order placed!`);
        //   setAmount('');
        //   onSuccess?.();
        // } catch (error) {
        //   // Error handled by mutation
        // }
        setAmount(''); // Clear amount after mock submission
        onSuccess?.(null); // Call onSuccess with null for mock
    };

    const handlePercentageClick = (percentage: number) => {
        const targetPrice = type === 'market' ? currentPrice : (parseFloat(price) || 0);
        const availableAmount = side === 'buy'
            ? (balance * percentage) / targetPrice
            : balance * percentage;
        setAmount(availableAmount.toFixed(8));
    };

    return (
        <div className="space-y-4">
            {/* Order Type Toggle */}
            <div className="flex space-x-1 bg-secondary-600 rounded-lg p-1 border border-secondary-500">
                <Button
                    type="button"
                    onClick={() => setType('market')}
                    variant={type === 'market' ? 'primary' : 'outline'}
                    size="sm"
                    className="flex-1 border-none bg-transparent hover:bg-secondary-500 data-[selected=true]:bg-secondary-500 data-[selected=true]:text-primary-600"
                    data-selected={type === 'market'}
                >
                    Market
                </Button>
                <Button
                    type="button"
                    onClick={() => setType('limit')}
                    variant={type === 'limit' ? 'primary' : 'outline'}
                    size="sm"
                    className="flex-1 border-none bg-transparent hover:bg-secondary-500 data-[selected=true]:bg-secondary-500 data-[selected=true]:text-primary-600"
                    data-selected={type === 'limit'}
                >
                    Limit
                </Button>
            </div>

            {/* Buy/Sell Tabs */}
            <div className="flex space-x-2 p-1">
                <Button
                    type="button"
                    onClick={() => setSide('buy')}
                    variant={side === 'buy' ? 'success' : 'outline'}
                    className="flex-1"
                >
                    Buy
                </Button>
                <Button
                    type="button"
                    onClick={() => setSide('sell')}
                    variant={side === 'sell' ? 'danger' : 'outline'}
                    className="flex-1"
                >
                    Sell
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Price input (limit orders only) */}
                {type === 'limit' && (
                    <div>
                        <label className="block text-sm font-medium mb-1 text-gray-400">
                            Price ({market.quoteAsset})
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder={currentPrice.toString()}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Market: ${currentPrice.toLocaleString()}
                        </p>
                    </div>
                )}

                {/* Amount input */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-gray-400">
                        Amount ({market.baseAsset})
                    </label>
                    <Input
                        type="number"
                        step="0.00000001"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                    />

                    {/* Quick percentage buttons */}
                    <div className="flex space-x-2 mt-2">
                        {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                            <button
                                key={pct}
                                type="button"
                                onClick={() => handlePercentageClick(pct)}
                                className="flex-1 py-1 text-xs bg-secondary-600 text-gray-400 rounded-md hover:bg-secondary-500 transition-colors border border-secondary-500"
                            >
                                {(pct * 100).toFixed(0)}%
                            </button>
                        ))}
                    </div>
                </div>

                {/* Available balance */}
                <div className="text-sm">
                    <span className="text-gray-400">Available: </span>
                    <span className="font-medium text-[#eaecef]">
                        {balance.toFixed(8)} {side === 'buy' ? market.quoteAsset : market.baseAsset}
                    </span>
                </div>

                {/* Total calculation */}
                <div className="space-y-1 text-sm border-t border-secondary-500 pt-3 mt-4">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Total:</span>
                        <span className="text-[#eaecef]">${total.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Fee (0.1%):</span>
                        <span className="text-gray-500">${fee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-primary-600 mt-1 pt-1 border-t border-dashed border-secondary-500">
                        <span>Total with Fee:</span>
                        <span>${totalWithFee.toLocaleString()}</span>
                    </div>
                </div>

                {/* Submit button */}
                <Button
                    type="submit"
                    variant={side === 'buy' ? 'success' : 'danger'}
                    className="w-full"
                    disabled={!isValid /* || placeOrder.isLoading */}
                >
                    {/* {placeOrder.isLoading */}
                    {false // Mock isLoading
                        ? 'Placing Order...'
                        : `${side === 'buy' ? 'Buy' : 'Sell'} ${market.baseAsset}`}
                </Button>

                {/* Validation errors */}
                {!isValid && amount && (
                    <p className="text-sm text-danger-600">
                        {side === 'buy' && totalWithFee > balance
                            ? 'Insufficient balance'
                            : 'Invalid order parameters'}
                    </p>
                )}
            </form>
        </div>
    );
};

export default OrderForm;
