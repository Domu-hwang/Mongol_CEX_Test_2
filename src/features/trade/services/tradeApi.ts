import type { Order, OrderBook, CreateOrderRequest } from '../types';

// Mock data
const MOCK_ORDER_BOOK: OrderBook = {
    symbol: 'BTC-USDT',
    bids: [
        { price: 44999.0, amount: 0.5, total: 22499.5 },
        { price: 44998.5, amount: 0.3, total: 13499.55 },
        { price: 44998.0, amount: 0.2, total: 8999.6 },
    ],
    asks: [
        { price: 45001.0, amount: 0.4, total: 18000.4 },
        { price: 45001.5, amount: 0.6, total: 27000.9 },
        { price: 45002.0, amount: 0.1, total: 4500.2 },
    ],
    timestamp: new Date().toISOString(),
};

let mockOpenOrders: Order[] = [];
let nextOrderId = 1;

const MOCK_BALANCES = {
    USDT: 100000,
    BTC: 5,
};

export const tradeApi = {
    async fetchOrderBook(symbol: string): Promise<OrderBook> {
        console.log(`[Mock API] Fetching order book for ${symbol}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_ORDER_BOOK);
            }, 500);
        });
    },

    async placeOrder(payload: CreateOrderRequest): Promise<Order> {
        console.log(`[Mock API] Placing order:`, payload);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Basic validation
                if (payload.amount <= 0) {
                    reject(new Error('Amount must be positive'));
                    return;
                }
                if (payload.type === 'limit' && (!payload.price || payload.price <= 0)) {
                    reject(new Error('Price is required for limit orders'));
                    return;
                }
                if ((payload.type === 'stop-limit' || payload.type === 'stop-market') && (!payload.triggerPrice || payload.triggerPrice <= 0)) {
                    reject(new Error('Trigger price is required for stop orders'));
                    return;
                }

                const newOrder: Order = {
                    id: `mock-order-${nextOrderId++}`,
                    userId: 'mock-user-1',
                    symbol: payload.symbol,
                    side: payload.side,
                    type: payload.type,
                    price: payload.price,
                    triggerPrice: payload.triggerPrice,
                    limitPrice: payload.limitPrice,
                    amount: payload.amount,
                    filledAmount: 0,
                    averagePrice: 0,
                    fee: 0, // Mock fee
                    status: payload.type.startsWith('stop') ? 'new' : 'open', // Stop orders are 'new' initially
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                mockOpenOrders.push(newOrder);
                resolve(newOrder);
            }, 1000);
        });
    },

    async cancelOrder(orderId: string): Promise<void> {
        console.log(`[Mock API] Cancelling order: ${orderId}`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const initialLength = mockOpenOrders.length;
                mockOpenOrders = mockOpenOrders.filter((order) => order.id !== orderId);
                if (mockOpenOrders.length < initialLength) {
                    resolve();
                } else {
                    reject(new Error('Order not found or already cancelled'));
                }
            }, 500);
        });
    },

    async fetchOpenOrders(): Promise<Order[]> {
        console.log(`[Mock API] Fetching open orders`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(mockOpenOrders.filter(order => order.status === 'open' || order.status === 'new'));
            }, 300);
        });
    },

    async fetchBalances(): Promise<Array<{ asset: string; available: number; locked: number }>> {
        console.log(`[Mock API] Fetching balances`);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { asset: 'USDT', available: MOCK_BALANCES.USDT, locked: 0 },
                    { asset: 'BTC', available: MOCK_BALANCES.BTC, locked: 0 },
                ]);
            }, 200);
        });
    },
};