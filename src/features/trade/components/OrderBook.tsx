import React from 'react';
import OrderBookRow from './OrderBookRow';

interface Order {
    price: number;
    amount: number;
    total: number;
}

interface OrderBookProps {
    bids: Order[];
    asks: Order[];
    currentPrice: number;
}

const OrderBook: React.FC<OrderBookProps> = ({ bids, asks, currentPrice }) => {
    const allTotals = [...bids, ...asks].map(order => order.total);
    const maxTotal = Math.max(...allTotals, 1);

    return (
        <div className="bg-card rounded-lg shadow-md p-4 h-[400px] flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Order Book</h3>
            <div className="flex justify-between text-muted-foreground text-xs mb-2 px-1">
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {/* Asks (Sell Orders) */}
                <div className="flex flex-col-reverse">
                    {asks.map((order, index) => (
                        <OrderBookRow
                            key={`ask-${index}`}
                            price={order.price}
                            amount={order.amount}
                            total={order.total}
                            type="ask"
                            maxTotal={maxTotal}
                        />
                    ))}
                </div>

                {/* Current Price */}
                <div className="text-center py-2 text-xl font-bold text-primary border-y border-border my-1">
                    {currentPrice.toFixed(2)}
                </div>

                {/* Bids (Buy Orders) */}
                <div className="flex flex-col">
                    {bids.map((order, index) => (
                        <OrderBookRow
                            key={`bid-${index}`}
                            price={order.price}
                            amount={order.amount}
                            total={order.total}
                            type="bid"
                            maxTotal={maxTotal}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderBook;
