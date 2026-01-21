import React from 'react';

type Trade = {
    id: string;
    symbol: string;
    price: number;
    amount: number;
    side: 'buy' | 'sell';
    timestamp: string;
};

interface RecentTradesProps {
    symbol: string;
}

const mockRecentTrades: Trade[] = [
    { id: 't-1', symbol: 'BTC-USDT', price: 45000.50, amount: 0.001, side: 'buy', timestamp: '09:15:01' },
    { id: 't-2', symbol: 'BTC-USDT', price: 45000.00, amount: 0.005, side: 'sell', timestamp: '09:15:05' },
    { id: 't-3', symbol: 'BTC-USDT', price: 45001.00, amount: 0.002, side: 'buy', timestamp: '09:15:10' },
    { id: 't-4', symbol: 'BTC-USDT', price: 44999.50, amount: 0.010, side: 'sell', timestamp: '09:15:15' },
    { id: 't-5', symbol: 'BTC-USDT', price: 45000.20, amount: 0.003, side: 'buy', timestamp: '09:15:20' },
];

const RecentTrades: React.FC<RecentTradesProps> = ({ symbol }) => {
    const trades = mockRecentTrades;
    const isLoading = false;

    if (isLoading) {
        return <div className="text-center text-slate-500 py-10">Loading Recent Trades...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-[#181a20] overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-800/50 shrink-0">
                <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Market Trades</h3>
            </div>

            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#181a20] z-10">
                        <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-3 py-2">Time</th>
                            <th className="px-3 py-2">Price</th>
                            <th className="px-3 py-2">Amount</th>
                            <th className="px-3 py-2 text-right">Side</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/20">
                        {trades.map((trade) => (
                            <tr key={trade.id} className="hover:bg-gray-800/30 transition-colors">
                                <td className="px-3 py-1.5 text-[11px] text-gray-400 font-mono">{trade.timestamp}</td>
                                <td className="px-3 py-1.5 text-[11px] text-[#eaecef] font-mono font-bold">${trade.price.toLocaleString()}</td>
                                <td className="px-3 py-1.5 text-[11px] text-gray-400 font-mono">{trade.amount.toFixed(4)}</td>
                                <td className="px-3 py-1.5 text-[11px] text-right">
                                    <span className={`font-bold ${trade.side === 'buy' ? 'text-success-600' : 'text-danger-600'}`}>
                                        {trade.side.toUpperCase()}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentTrades;
