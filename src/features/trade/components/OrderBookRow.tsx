import React from 'react';

interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;
}

interface OrderBookRowProps {
    entry: OrderBookEntry;
    type: 'bid' | 'ask';
}

const OrderBookRow: React.FC<OrderBookRowProps> = ({ entry, type }) => {
    const colorClass = type === 'bid' ? 'text-success-600' : 'text-danger-600';
    const bgColorClass = type === 'bid' ? 'bg-success-600/10' : 'bg-danger-600/10';

    return (
        <div className={`flex justify-between text-xs p-1 px-2 rounded-sm transition-colors hover:bg-secondary-500/50 ${bgColorClass}`}>
            <span className={`${colorClass} font-bold font-mono`}>${entry.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            <span className="text-[#eaecef] font-mono">{entry.amount.toFixed(4)}</span>
            <span className="text-gray-500 font-mono">${entry.total.toLocaleString()}</span>
        </div>
    );
};

export default OrderBookRow;
