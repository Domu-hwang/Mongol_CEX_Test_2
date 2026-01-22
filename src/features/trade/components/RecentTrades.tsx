import React from 'react';

interface Trade {
    time: string;
    price: number;
    amount: number;
    type: 'buy' | 'sell';
}

interface RecentTradesProps {
    trades: Trade[];
}

const RecentTrades: React.FC<RecentTradesProps> = ({ trades }) => {
    return (
        <div className="bg-card rounded-lg shadow-md p-4 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Trades</h3>
            <div className="flex justify-between text-muted-foreground text-xs mb-2 px-1">
                <span>Time</span>
                <span>Price</span>
                <span>Amount</span>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {trades.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-4">No recent trades.</p>
                ) : (
                    <ul className="space-y-1">
                        {trades.map((trade, index) => (
                            <li
                                key={index}
                                className={`flex justify-between text-xs py-1 px-1 ${
                                    trade.type === 'buy' ? 'text-success' : 'text-destructive'
                                }`}
                            >
                                <span>{trade.time}</span>
                                <span>{trade.price.toFixed(2)}</span>
                                <span>{trade.amount.toFixed(4)}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RecentTrades;
