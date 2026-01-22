import React, { useState } from 'react';
import MarketSelector from '@/features/trade/components/MarketSelector';
import PriceDisplay from '@/features/trade/components/PriceDisplay';
import PriceChart from '@/features/trade/components/PriceChart';
import OrderBook from '@/features/trade/components/OrderBook';
import OrderForm from '@/features/trade/components/OrderForm';
import OrderHistory from '@/features/trade/components/OrderHistory';
import RecentTrades from '@/features/trade/components/RecentTrades';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

const TradePage: React.FC = () => {
    const [currentMarket, setCurrentMarket] = useState("BTC/USDT");

    // Placeholder data for PriceDisplay
    const priceDisplayProps = {
        currentPrice: 41367.32,
        priceChange24h: 3.78,
        priceChangePercent24h: 1.37,
        market: currentMarket,
    };

    // Placeholder data for OrderBook
    const mockBids = [
        { price: 41367.00, amount: 0.5, total: 20683.50 },
        { price: 41366.50, amount: 0.2, total: 8273.30 },
    ];
    const mockAsks = [
        { price: 41368.00, amount: 0.3, total: 12410.40 },
        { price: 41368.50, amount: 0.1, total: 4136.85 },
    ];

    // Placeholder data for RecentTrades
    const mockTrades = [
        { time: "14:30:15", price: 41367.50, amount: 0.05, type: 'buy' as const },
        { time: "14:30:10", price: 41367.20, amount: 0.12, type: 'sell' as const },
    ];

    // Placeholder data for OrderHistory
    const mockOrders = [
        { id: "1", time: "2026-01-21 10:00:00", market: "BTC/USDT", type: "buy" as const, price: 40000, amount: 0.1, total: 4000, status: "Filled" as const, profit: "$200" },
        { id: "2", time: "2026-01-21 09:30:00", market: "ETH/USDT", type: "sell" as const, price: 2500, amount: 0.5, total: 1250, status: "Open" as const },
    ];

    // Placeholder for available balance
    const availableBalance = { base: 1.5, quote: 10000 };

    const handlePlaceOrder = (type: 'buy' | 'sell', orderType: 'limit' | 'market' | 'stop-limit', price: number, amount: number) => {
        console.log(`Placing ${type} ${orderType} order for ${amount} at ${price}`);
    };

    return (
        <div className="flex flex-col flex-grow text-foreground">
            {/* Top Market Data and Timeframe */}
            <div className="flex flex-col md:flex-row justify-between items-center p-2 md:p-4 border-b border-border bg-background">
                <div className="flex items-center space-x-2 md:space-x-4 mb-2 md:mb-0">
                    <MarketSelector onSelectMarket={setCurrentMarket} currentMarket={currentMarket} />
                    <PriceDisplay {...priceDisplayProps} />
                </div>
                {/* Timeframe Selector */}
                <div className="flex space-x-1 text-xs md:text-sm">
                    {['1m', '5m', '15m', '30m', '1h', '4h', '1D', '7D', 'Full'].map(time => (
                        <button key={time} className="px-2 py-1 rounded hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                            {time}
                        </button>
                    ))}
                </div>
            </div>

            <main className="flex flex-col lg:flex-row flex-grow overflow-hidden">
                {/* Main Content Area - Chart and Order Form */}
                <div className="flex flex-col lg:flex-row flex-grow">
                    {/* Chart Area */}
                    <div className="flex flex-col w-full lg:w-3/4 border-b lg:border-b-0 lg:border-r border-border">
                        <div className="flex-grow p-2 bg-card h-[45vh] lg:h-2/3">
                            <PriceChart market={currentMarket} />
                        </div>

                        {/* Order Book / Trading History / Order History Tabs */}
                        <div className="flex-grow bg-card border-t border-border h-[55vh] lg:h-1/3">
                            <Tabs defaultValue="order-book" variant="underline" className="w-full h-full flex flex-col">
                                <TabsList className="flex bg-background border-b border-border">
                                    <TabsTrigger value="order-book" className="flex-1 px-2 py-2 text-xs md:px-4 md:text-sm">Order Book</TabsTrigger>
                                    <TabsTrigger value="trading-history" className="flex-1 px-2 py-2 text-xs md:px-4 md:text-sm">Trading History</TabsTrigger>
                                    <TabsTrigger value="order-history" className="flex-1 px-2 py-2 text-xs md:px-4 md:text-sm">Order History</TabsTrigger>
                                </TabsList>
                                <TabsContent value="order-book" className="flex-grow p-2 overflow-y-auto">
                                    <OrderBook bids={mockBids} asks={mockAsks} currentPrice={priceDisplayProps.currentPrice} />
                                </TabsContent>
                                <TabsContent value="trading-history" className="flex-grow p-2 overflow-y-auto">
                                    <RecentTrades trades={mockTrades} />
                                </TabsContent>
                                <TabsContent value="order-history" className="flex-grow p-2 overflow-y-auto">
                                    <OrderHistory orders={mockOrders} />
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Order Form Panel */}
                    <div className="w-full lg:w-1/4 bg-card p-2 md:p-4 border-t lg:border-t-0 border-border">
                        <OrderForm
                            currentMarket={currentMarket}
                            availableBalance={availableBalance}
                            onPlaceOrder={handlePlaceOrder}
                            isLoading={false}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TradePage;
