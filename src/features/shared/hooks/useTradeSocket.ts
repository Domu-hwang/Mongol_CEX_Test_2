import React, { useState, useEffect } from 'react';

// Mock WebSocket client for demonstration purposes.
// In a real application, this would connect to a WebSocket server.
const mockWsClient = {
    listeners: new Map<string, Set<Function>>(),

    subscribe(channel: string, callback: Function) {
        if (!this.listeners.has(channel)) {
            this.listeners.set(channel, new Set());
        }
        this.listeners.get(channel)?.add(callback);
    },

    unsubscribe(channel: string, callback?: Function) {
        if (this.listeners.has(channel)) {
            if (callback) {
                this.listeners.get(channel)?.delete(callback);
            } else {
                this.listeners.delete(channel);
            }
        }
    },

    emit(channel: string, data: any) {
        this.listeners.get(channel)?.forEach(callback => callback(data));
    },

    on(event: 'connect' | 'disconnect', callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event)?.add(callback);
    },
    off(event: 'connect' | 'disconnect', callback: Function) {
        this.listeners.get(event)?.delete(callback);
    }
};


interface TickerData {
    symbol: string;
    price: number;
    change24h: number;
    volume24h: number;
    high24h: number; // Added
    low24h: number;  // Added
    timestamp: string;
}

interface TradeData {
    id: string;
    symbol: string;
    price: number;
    amount: number;
    side: 'buy' | 'sell';
    timestamp: string;
}

interface UseTradeSocketReturn {
    ticker: TickerData | null;
    latestTrade: TradeData | null;
    isConnected: boolean;
}

export function useTradeSocket(symbol: string): UseTradeSocketReturn {
    const [ticker, setTicker] = useState<TickerData | null>(null);
    const [latestTrade, setLatestTrade] = useState<TradeData | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    // Ref to track latest price for interval calculations without triggering re-runs
    const latestPriceRef = React.useRef(45000);

    useEffect(() => {
        // Simulate connection
        setIsConnected(true);
        mockWsClient.emit('connect', {});

        // Simulate ticker updates
        const tickerInterval = setInterval(() => {
            const currentPrice = latestPriceRef.current;
            const newPrice = parseFloat((currentPrice + (Math.random() - 0.5) * 20).toFixed(2));
            const change24h = ((newPrice - 45000) / 45000) * 100;

            const mockTickerData: TickerData = {
                symbol,
                price: newPrice,
                change24h: parseFloat(change24h.toFixed(2)),
                volume24h: parseFloat((Math.random() * 1000).toFixed(2)),
                high24h: parseFloat((newPrice + Math.random() * 50).toFixed(2)),
                low24h: parseFloat((newPrice - Math.random() * 50).toFixed(2)),
                timestamp: new Date().toISOString(),
            };

            latestPriceRef.current = newPrice;
            mockWsClient.emit(`market.price.${symbol}`, mockTickerData);
            setTicker(mockTickerData);
        }, 1500);

        // Simulate trade updates
        const tradeInterval = setInterval(() => {
            const tradePrice = latestPriceRef.current;
            const tradeAmount = parseFloat((Math.random() * (1 - 0.01) + 0.01).toFixed(4));
            const tradeSide: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';

            const mockTradeData: TradeData = {
                id: `mock-trade-${Date.now()}`,
                symbol,
                price: tradePrice,
                amount: tradeAmount,
                side: tradeSide,
                timestamp: new Date().toISOString(),
            };
            mockWsClient.emit(`market.trades.${symbol}`, mockTradeData);
            setLatestTrade(mockTradeData);
        }, 1000);

        mockWsClient.subscribe(`market.price.${symbol}`, setTicker);
        mockWsClient.subscribe(`market.trades.${symbol}`, setLatestTrade);

        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        mockWsClient.on('connect', handleConnect);
        mockWsClient.on('disconnect', handleDisconnect);

        return () => {
            clearInterval(tickerInterval);
            clearInterval(tradeInterval);
            mockWsClient.unsubscribe(`market.price.${symbol}`, setTicker);
            mockWsClient.unsubscribe(`market.trades.${symbol}`, setLatestTrade);
            mockWsClient.off('connect', handleConnect);
            mockWsClient.off('disconnect', handleDisconnect);
        };
    }, [symbol]); // Removed ticker from dependencies

    return {
        ticker,
        latestTrade,
        isConnected,
    };
}