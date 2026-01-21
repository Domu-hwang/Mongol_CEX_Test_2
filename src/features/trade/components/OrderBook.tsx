import React from 'react';
import OrderBookRow from './OrderBookRow';

interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;
}

interface OrderBookProps {
    symbol: string;
}

const mockOrderBook = {
    bids: [
        { price: 44999.50, amount: 0.123, total: 5534.84 },
        { price: 44999.00, amount: 0.250, total: 11249.75 },
        { price: 44998.00, amount: 0.050, total: 2249.90 },
    ],
    asks: [
        { price: 45000.50, amount: 0.300, total: 13500.15 },
        { price: 45001.00, amount: 0.100, total: 4500.10 },
        { price: 45002.00, amount: 0.080, total: 3601.76 },
    ],
};

const OrderBook: React.FC<OrderBookProps> = ({ symbol }) => {
    const bids = mockOrderBook.bids;
    const asks = mockOrderBook.asks;
    const spread = asks[0].price - bids[0].price;
    const isLoading = false;

    if (isLoading) {
        return <div className="text-center text-slate-500 py-10">Loading Order Book...</div>;
    }

    return (
        <div className="flex flex-col h-full bg-[#181a20] overflow-hidden">
            <div className="px-3 py-2 border-b border-gray-800/50 shrink-0">
                <h3 className="text-[11px] font-bold text-gray-400 tracking-wider uppercase">Order Book</h3>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden">
                <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase px-3 py-1.5 shrink-0">
                    <span>Price (USDT)</span>
                    <span>Amount (BTC)</span>
                    <span className="text-right">Total</span>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    {/* Asks (Sell orders) */}
                    <div className="flex flex-col-reverse">
                        {asks.map((entry, idx) => (
                            <OrderBookRow key={`ask-${idx}`} entry={entry} type="ask" />
                        ))}
                    </div>

                    {/* Spread */}
                    <div className="py-2 border-y border-gray-800/50 flex justify-between px-3 text-[11px] bg-[#1e2329]/50 shrink-0 my-1">
                        <span className="text-gray-500 font-medium tracking-tight">Spread</span>
                        <span className="text-[#eaecef] font-bold font-mono tracking-tight">${spread.toFixed(2)}</span>
                    </div>

                    {/* Bids (Buy orders) */}
                    <div className="flex flex-col">
                        {bids.map((entry, idx) => (
                            <OrderBookRow key={`bid-${idx}`} entry={entry} type="bid" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderBook;
