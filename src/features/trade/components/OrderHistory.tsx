import React from 'react';

interface Order {
    id: string;
    time: string;
    market: string;
    type: 'buy' | 'sell';
    price: number;
    amount: number;
    total: number;
    status: 'Filled' | 'Partial' | 'Open' | 'Cancelled';
    profit?: string;
}

interface OrderHistoryProps {
    orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
    return (
        <div className="bg-card rounded-lg shadow-md p-4 h-full flex flex-col">
            <h3 className="text-lg font-semibold text-foreground mb-4">Order History</h3>
            <div className="grid grid-cols-8 text-muted-foreground text-xs mb-2 px-1">
                <span>ID</span>
                <span>Time</span>
                <span>Pair</span>
                <span>Type</span>
                <span>Price</span>
                <span>Amount</span>
                <span>Total</span>
                <span>Action</span>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
                {orders.length === 0 ? (
                    <p className="text-center text-muted-foreground mt-4">No order history.</p>
                ) : (
                    <ul className="space-y-1">
                        {orders.map((order) => (
                            <li
                                key={order.id}
                                className={`grid grid-cols-8 text-xs py-1 px-1 ${
                                    order.type === 'buy' ? 'text-success' : 'text-destructive'
                                }`}
                            >
                                <span>{order.id}</span>
                                <span>{order.time.split(' ')[1]}</span>
                                <span>{order.market}</span>
                                <span>{order.type === 'buy' ? 'Buy' : 'Sell'}</span>
                                <span>{order.price.toFixed(2)}</span>
                                <span>{order.amount.toFixed(4)}</span>
                                <span>{order.total.toFixed(2)}</span>
                                <span>
                                    {order.status === 'Filled' ? (
                                        <span className="text-success">{order.profit || 'Filled'}</span>
                                    ) : (
                                        <span className="text-primary">{order.status}</span>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
