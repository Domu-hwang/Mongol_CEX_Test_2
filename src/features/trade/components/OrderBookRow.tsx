import React from 'react';

interface OrderBookRowProps {
    price: number;
    amount: number;
    total: number;
    type: 'bid' | 'ask';
    maxTotal: number;
}

const OrderBookRow: React.FC<OrderBookRowProps> = ({ price, amount, total, type, maxTotal }) => {
    const isBid = type === 'bid';
    const rowColor = isBid ? 'text-success' : 'text-destructive';
    const barColor = isBid ? 'bg-success/20' : 'bg-destructive/20';
    const barWidth = (total / maxTotal) * 100;

    return (
        <div className={`relative flex justify-between py-0.5 text-xs ${rowColor}`}>
            {/* Background bar for depth visualization */}
            <div
                className={`absolute inset-y-0 ${isBid ? 'left-0' : 'right-0'} ${barColor}`}
                style={{ width: `${barWidth}%` }}
            />
            <span className="relative z-10 w-1/3 text-left">{price.toFixed(2)}</span>
            <span className="relative z-10 w-1/3 text-right">{amount.toFixed(4)}</span>
            <span className="relative z-10 w-1/3 text-right">{total.toFixed(2)}</span>
        </div>
    );
};

export default OrderBookRow;
