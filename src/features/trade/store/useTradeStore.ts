import { create } from 'zustand';

interface TradeState {
    currentPair: string;
    price: string;
    amount: string;
    orderType: 'market' | 'limit' | 'stop-limit' | 'stop-market';
    orderSide: 'buy' | 'sell';
    setPrice: (price: string) => void;
    setAmount: (amount: string) => void;
    setOrderType: (type: 'market' | 'limit' | 'stop-limit' | 'stop-market') => void;
    setOrderSide: (side: 'buy' | 'sell') => void;
    setCurrentPair: (pair: string) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
    currentPair: 'BTC-USDT',
    price: '',
    amount: '',
    orderType: 'market',
    orderSide: 'buy',
    setPrice: (price) => set({ price }),
    setAmount: (amount) => set({ amount }),
    setOrderType: (orderType) => set({ orderType }),
    setOrderSide: (orderSide) => set({ orderSide }),
    setCurrentPair: (currentPair) => set({ currentPair }),
}));