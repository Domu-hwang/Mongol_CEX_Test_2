export interface Market {
    id: string;
    symbol: string;          // 'BTC-USDT'
    baseAsset: string;       // 'BTC'
    quoteAsset: string;      // 'USDT'
    currentPrice: number;
    change24h: number;       // Percentage
    volume24h: number;
    high24h: number;
    low24h: number;
    status: 'active' | 'inactive';
}

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit' | 'stop-limit' | 'stop-market';
export type OrderStatus = 'new' | 'open' | 'partially_filled' | 'filled' | 'cancelled' | 'triggered';

export interface Order {
    id: string;
    userId: string;
    symbol: string;
    side: OrderSide;
    type: OrderType;
    price?: number;          // Null for market orders
    triggerPrice?: number;   // Added for Stop orders
    limitPrice?: number;     // Added for Stop-Limit orders
    amount: number;
    filledAmount: number;
    averagePrice: number;
    fee: number;
    status: OrderStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateOrderRequest {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    amount: number;
    price?: number;          // Required for limit orders
    triggerPrice?: number;   // Added for Stop orders
    limitPrice?: number;     // Added for Stop-Limit orders
}

export interface OrderBook {
    symbol: string;
    bids: OrderBookEntry[];  // Buy orders
    asks: OrderBookEntry[];  // Sell orders
    timestamp: string;
}

export interface OrderBookEntry {
    price: number;
    amount: number;
    total: number;           // Cumulative
}

export interface Trade {
    id: string;
    symbol: string;
    price: number;
    amount: number;
    side: OrderSide;
    timestamp: string;
}

export interface OrderFilters {
    status?: OrderStatus;
    startDate?: string;
    endDate?: string;
    symbol?: string;
}