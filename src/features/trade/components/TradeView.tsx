import React, { useState } from 'react';
import MarketSelector from './MarketSelector';
import PriceDisplay from './PriceDisplay';
import OrderBook from './OrderBook';
import OrderForm from './OrderForm';
import PriceChart from './PriceChart';
import RecentTrades from './RecentTrades';
import OrderHistory from './OrderHistory';
import { Card } from '@/components/ui/Card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'; // Assuming Tabs component
import { Input } from '@/components/ui/Input'; // Assuming Input component
import { Button } from '@/components/ui/Button'; // Assuming Button component

// Mock Data - these would come from an API in a real application
const mockBids = [
    { price: 41380.18, amount: 0.500277, total: 0.925688 },
    { price: 41378.58, amount: 0.300166, total: 0.425422 },
    { price: 41366.65, amount: 0.025190, total: 0.325645 },
    { price: 41363.17, amount: 0.100055, total: 0.100055 },
    { price: 41363.16, amount: 0.021464, total: 0.021464 },
    { price: 41361.41, amount: 0.988522, total: 0.988522 },
    { price: 41359.70, amount: 1.252597, total: 1.252597 },
    { price: 41357.62, amount: 1.288842, total: 1.288842 },
];

const mockAsks = [
    { price: 41380.20, amount: 0.500300, total: 0.926000 },
    { price: 41378.60, amount: 0.300200, total: 0.425500 },
    { price: 41366.60, amount: 0.025200, total: 0.325700 },
];

const mockMarketTrades = [
    { time: '10:28:15', price: 0.768, amount: 1.01, type: 'sell' as const },
    { time: '10:28:15', price: 0.768, amount: 874.03, type: 'buy' as const },
    { time: '10:27:59', price: 0.767, amount: 408.17, type: 'buy' as const },
    { time: '10:27:35', price: 0.767, amount: 131.09, type: 'sell' as const },
    { time: '10:27:29', price: 0.767, amount: 2.30, type: 'buy' as const },
    { time: '10:27:10', price: 0.767, amount: 580.00, type: 'sell' as const },
    { time: '10:27:05', price: 0.767, amount: 400.00, type: 'buy' as const },
    { time: '10:26:41', price: 0.768, amount: 9.81, type: 'sell' as const },
    { time: '10:26:41', price: 0.768, amount: 10.92, type: 'buy' as const },
    { time: '10:26:30', price: 0.768, amount: 1.04, type: 'sell' as const },
];

const mockOrderHistory = [
    { id: 'ORD001', time: '2023-01-20 10:00', market: 'BTC/USDT', type: 'buy' as const, price: 34500.00, amount: 0.1, total: 3450.00, status: 'Filled' as const, profit: '$74.32' },
    { id: 'ORD002', time: '2023-01-20 11:30', market: 'BTC/USDT', type: 'sell' as const, price: 35100.00, amount: 0.05, total: 1755.00, status: 'Filled' as const, profit: '$36.14' },
    { id: 'ORD003', time: '2023-01-20 12:00', market: 'ETH/USDT', type: 'buy' as const, price: 2000.00, amount: 1.0, total: 2000.00, status: 'Cancelled' as const, profit: '$4.12' },
    { id: 'ORD004', time: '2023-01-20 12:00', market: 'BTC/USDT', type: 'buy' as const, price: 34500.00, amount: 0.1, total: 3450.00, status: 'Filled' as const, profit: '$21.56' },
    { id: 'ORD005', time: '2023-01-20 12:00', market: 'ETH/USDT', type: 'sell' as const, price: 2000.00, amount: 1.0, total: 2000.00, status: 'Filled' as const, profit: '$41.01' },
];

const TradeView: React.FC = () => {
    const [currentMarket, setCurrentMarket] = useState('BTC/USDT');
    const [currentPrice, setCurrentPrice] = useState(41367.32); // Mock current price from image
    const [priceChange24h, setPriceChange24h] = useState(3.78); // Mock 24h change
    const [priceChangePercent24h, setPriceChangePercent24h] = useState(1.37); // Mock 24h % change
    const [high24h, setHigh24h] = useState(41928.23);
    const [low24h, setLow24h] = useState(40930.74);
    const [volume24h, setVolume24h] = useState(1249258811.39);

    // Mock available balance
    const availableBalance = {
        base: 1.2345, // e.g., BTC balance
        quote: 50000.00, // e.g., USDT balance
    };

    // Updated handlePlaceOrder signature to match OrderFormProps
    const handlePlaceOrder = (type: 'buy' | 'sell', orderType: 'limit' | 'market' | 'stop-limit', price: number, amount: number) => {
        console.log(`Order Placed: ${orderType} ${type} ${amount} ${currentMarket.split('/')[0]} at ${price} ${currentMarket.split('/')[1]}`);
        alert(`Order placed: ${orderType} ${type} ${amount} at ${price}`);
        // In a real app, this would trigger an API call and update state
    };

    return (
        <div className="flex flex-grow w-full h-full text-white bg-gray-900 overflow-hidden">
            {/* Main Content Area - Now full width as sidebar is removed */}
            <div className="flex-grow flex flex-col overflow-hidden">
                {/* Top Info Bar */}
                <div className="flex items-center justify-between p-4 bg-secondary-800 border-b border-gray-700">
                    <div className="flex items-center space-x-4">
                        <span className="text-xl font-bold">BTC/USDT</span>
                        <span className="text-2xl font-bold text-green-500">{currentPrice.toLocaleString()}</span>
                        <span className={`text-sm ${priceChangePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            Change: {priceChange24h.toFixed(2)} ({priceChangePercent24h.toFixed(2)}%)
                        </span>
                        <span className="text-sm text-gray-400">High: {high24h.toLocaleString()}</span>
                        <span className="text-sm text-gray-400">Low: {low24h.toLocaleString()}</span>
                        <span className="text-sm text-gray-400">24H Vol: {volume24h.toLocaleString()}</span>
                    </div>
                    <div className="flex space-x-2">
                        {/* Currency Tiles - Example */}
                        <span className="bg-gray-700 px-3 py-1 rounded-md text-sm">ETH/USDT <span className="text-red-500">-0.36%</span></span>
                        <span className="bg-gray-700 px-3 py-1 rounded-md text-sm">BTC/USDT <span className="text-green-500">+1.79%</span></span>
                        <span className="bg-gray-700 px-3 py-1 rounded-md text-sm">TRX/USDT <span className="text-red-500">-2.54%</span></span>
                        <span className="bg-gray-700 px-3 py-1 rounded-md text-sm">LTC/USDT <span className="text-red-500">-5.41%</span></span>
                    </div>
                </div>

                <div className="flex flex-grow overflow-hidden">
                    {/* Center Column: Order Book, Chart & History */}
                    {/* Adjusted to take more width as left sidebar is removed */}
                    <div className="flex flex-col w-3/5 p-4 space-y-4 overflow-hidden">
                        {/* Order Book */}
                        <div className="h-1/2 flex flex-col"> {/* Adjust height as needed */}
                            <Tabs defaultValue="order-book" className="flex-grow flex flex-col">
                                <TabsList className="bg-gray-800 self-start">
                                    <TabsTrigger value="order-book">Order Book</TabsTrigger>
                                    <TabsTrigger value="trading-history">Trading History</TabsTrigger>
                                    <TabsTrigger value="order-history">Order History</TabsTrigger>
                                </TabsList>
                                <TabsContent value="order-book" className="flex-grow overflow-hidden">
                                    <OrderBook bids={mockBids} asks={mockAsks} currentPrice={currentPrice} />
                                </TabsContent>
                                <TabsContent value="trading-history" className="flex-grow overflow-hidden">
                                    <RecentTrades trades={mockMarketTrades} />
                                </TabsContent>
                                <TabsContent value="order-history" className="flex-grow overflow-hidden">
                                    <OrderHistory orders={mockOrderHistory} />
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* Price Chart */}
                        <div className="flex-grow"> {/* This will take remaining space */}
                            <PriceChart market={currentMarket} />
                        </div>
                    </div>

                    {/* Right Column: Asset List & Order Form */}
                    {/* Adjusted to take more width as left sidebar is removed */}
                    <div className="flex flex-col w-2/5 p-4 space-y-4 border-l border-gray-700">
                        {/* Market Price & Spot/Margin Toggle */}
                        <Card className="bg-secondary-700 p-4">
                            <h3 className="text-md font-semibold text-gray-300 mb-2">Market Price</h3>
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-2xl font-bold">{currentPrice.toLocaleString()}</span>
                                <span className="text-sm text-gray-400">USD</span>
                                <span className={`text-md font-semibold ${priceChangePercent24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    percent: {priceChangePercent24h.toFixed(2)}%
                                </span>
                                {priceChangePercent24h >= 0 ? (
                                    <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                                )}
                            </div>
                            <div className="flex bg-gray-800 rounded-md p-1">
                                <Button variant="ghost" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">Spot</Button>
                                <Button variant="ghost" className="flex-1 text-gray-400 cursor-not-allowed">Margin</Button>
                            </div>
                        </Card>

                        {/* Order Entry Form */}
                        <OrderForm
                            currentMarket={currentMarket}
                            availableBalance={availableBalance}
                            onPlaceOrder={handlePlaceOrder}
                        />

                        {/* Asset Selection List (originally Left Panel in wireframes, moved to right for image match) */}
                        <Card className="bg-secondary-700 p-4 flex-grow">
                            <h3 className="text-md font-semibold text-gray-300 mb-2">Markets</h3>
                            <Input placeholder="Search" className="mb-3 bg-gray-800 border-gray-700 text-white" />
                            <div className="flex text-sm mb-3">
                                <Tabs defaultValue="USDT" className="flex-grow">
                                    <TabsList className="bg-gray-800 w-full justify-start">
                                        <TabsTrigger value="New">New</TabsTrigger>
                                        <TabsTrigger value="USDC">USDC</TabsTrigger>
                                        <TabsTrigger value="USDT">USDT</TabsTrigger>
                                        <TabsTrigger value="USD1">USD1</TabsTrigger>
                                        <TabsTrigger value="USD">USD</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <MarketSelector currentMarket={currentMarket} onSelectMarket={setCurrentMarket} />
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TradeView;
