import React from 'react';
import classNames from 'classnames';

type OrderStatus = 'open' | 'partially_filled' | 'filled' | 'cancelled';
type Order = {
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    type: 'market' | 'limit';
    price?: number;
    amount: number;
    filledAmount: number;
    status: OrderStatus;
    createdAt: string;
};

interface OrderFilters {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    symbol?: string;
}

interface OrderHistoryProps {
    filters?: OrderFilters;
    onOrderClick?: (order: Order) => void;
}

const mockOrderHistory: Order[] = [
    {
        id: 'ord-1',
        symbol: 'BTC-USDT',
        side: 'buy',
        type: 'market',
        amount: 0.01,
        filledAmount: 0.01,
        status: 'filled',
        createdAt: '2026-01-20T10:00:00Z',
    },
    {
        id: 'ord-2',
        symbol: 'ETH-USDT',
        side: 'sell',
        type: 'limit',
        price: 2400,
        amount: 0.1,
        filledAmount: 0.05,
        status: 'partially_filled',
        createdAt: '2026-01-20T10:30:00Z',
    },
    {
        id: 'ord-3',
        symbol: 'BTC-USDT',
        side: 'buy',
        type: 'limit',
        price: 44000,
        amount: 0.05,
        filledAmount: 0,
        status: 'open',
        createdAt: '2026-01-20T11:00:00Z',
    },
];

const OrderHistory: React.FC<OrderHistoryProps> = ({ filters, onOrderClick }) => {
    const orders = mockOrderHistory.filter(order => filters?.status ? order.status === filters.status : true);
    const isLoading = false;

    if (isLoading) {
        return <div className="text-center text-slate-500 py-10 uppercase tracking-widest text-[11px]">Loading...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-[#181a20] overflow-hidden">
            <div className="px-4 py-2 border-b border-gray-800 flex items-center justify-between bg-[#1e2329]/30 shrink-0">
                <div className="flex items-center gap-6">
                    <h3 className="text-[11px] font-bold text-primary-600 border-b-2 border-primary-600 py-1 uppercase tracking-wider cursor-pointer">Open Orders</h3>
                    <h3 className="text-[11px] font-bold text-gray-500 hover:text-[#eaecef] cursor-pointer py-1 uppercase tracking-wider">Order History</h3>
                    <h3 className="text-[11px] font-bold text-gray-500 hover:text-[#eaecef] cursor-pointer py-1 uppercase tracking-wider">Trade History</h3>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="min-w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-[#181a20] z-10 border-b border-gray-800">
                        <tr className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-4 py-2">Symbol</th>
                            <th className="px-4 py-2">Side</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2 text-right">Price</th>
                            <th className="px-4 py-2 text-right">Amount</th>
                            <th className="px-4 py-2 text-right">Filled</th>
                            <th className="px-4 py-2 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/30">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-800/30 transition-colors cursor-pointer" onClick={() => onOrderClick?.(order)}>
                                <td className="px-4 py-2 text-[11px] text-[#eaecef] font-bold">{order.symbol}</td>
                                <td className="px-4 py-2 text-[11px]">
                                    <span className={`font-bold ${order.side === 'buy' ? 'text-success-600' : 'text-danger-600'}`}>
                                        {order.side.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-4 py-2 text-[11px] text-gray-400 uppercase">{order.type}</td>
                                <td className="px-4 py-2 text-[11px] text-[#eaecef] font-mono text-right">
                                    {order.price ? `$${order.price.toLocaleString()}` : 'Market'}
                                </td>
                                <td className="px-4 py-2 text-[11px] text-gray-400 font-mono text-right">{order.amount.toFixed(4)}</td>
                                <td className="px-4 py-2 text-[11px] text-gray-400 font-mono text-right">{order.filledAmount.toFixed(4)}</td>
                                <td className="px-4 py-2 text-right">
                                    <span className={classNames(
                                        'px-2 py-0.5 inline-flex text-[10px] leading-5 font-bold rounded',
                                        order.status === 'filled' ? 'bg-success-600/20 text-success-600' :
                                            order.status === 'open' ? 'bg-primary-600/20 text-primary-600' :
                                                order.status === 'partially_filled' ? 'bg-yellow-600/20 text-yellow-600' :
                                                    'bg-gray-700/50 text-gray-400'
                                    )}>
                                        {order.status.replace('_', ' ').toUpperCase()}
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

export default OrderHistory;
