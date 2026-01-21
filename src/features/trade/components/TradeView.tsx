import React, { useState } from 'react';
import { useMediaQuery } from '@/features/shared/hooks/useMediaQuery';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'; // Assuming Tabs component is available
// import { useAuth } from '@/features/auth/hooks/useAuth'; // Placeholder, actual hook will be integrated later
// import { useBalances } from '@/features/wallet/hooks/useBalances'; // Placeholder, actual hook will be integrated later
// import { useMarkets } from '../hooks/useMarkets'; // Placeholder, actual hook will be integrated later
// import { useMarketPrice } from '../hooks/useMarketPrice'; // Placeholder, actual hook will be integrated later

// Import sub-components (will create these next)
import MarketSelector from './MarketSelector';
import PriceDisplay from './PriceDisplay';
import PriceChart from './PriceChart';
import OrderBook from './OrderBook';
import OrderForm from './OrderForm';
import OrderHistory from './OrderHistory';
import RecentTrades from './RecentTrades';

// Placeholder types for now
type Market = { symbol: string; quoteAsset: string; baseAsset: string };
type Balance = { asset: string; available: number };
type OrderFilters = { status: string };

const TradeView: React.FC = () => {
    // const { user } = useAuth(); // Placeholder
    // const { data: markets } = useMarkets(); // Placeholder
    const [selectedSymbol, setSelectedSymbol] = useState('BTC-USDT');

    // const { price, change24h, isConnected } = useMarketPrice(selectedSymbol); // Placeholder
    // const { data: balances } = useBalances(user?.id); // Placeholder

    // Mock data for initial rendering
    const mockMarkets: Market[] = [
        { symbol: 'BTC-USDT', quoteAsset: 'USDT', baseAsset: 'BTC' },
        { symbol: 'ETH-USDT', quoteAsset: 'USDT', baseAsset: 'ETH' },
    ];
    const mockBalances: Balance[] = [{ asset: 'USDT', available: 10000 }, { asset: 'BTC', available: 0.5 }];
    const mockPrice = 45000;
    const mockChange24h = 2.5;
    const mockIsConnected = true;

    const selectedMarket = mockMarkets?.find(m => m.symbol === selectedSymbol) || mockMarkets[0];
    const quoteBalance = mockBalances?.find(b => b.asset === selectedMarket?.quoteAsset)?.available || 0;

    const isMobile = useMediaQuery('(max-width: 768px)');

    if (isMobile) {
        return (
            <div className="flex flex-col h-full bg-[#0b0e11] text-[#eaecef]">
                <div className="p-4 border-b border-gray-800 bg-[#181a20]">
                    <MarketSelector
                        markets={mockMarkets}
                        selected={selectedSymbol}
                        onChange={setSelectedSymbol}
                    />
                </div>

                <div className="p-4 border-b border-gray-800">
                    <PriceDisplay
                        price={mockPrice}
                        change24h={mockChange24h}
                        isConnected={mockIsConnected}
                    />
                </div>

                <div className="p-4 border-b border-gray-800" style={{ height: '200px' }}>
                    <PriceChart symbol={selectedSymbol} />
                </div>

                <div className="p-4 border-b border-gray-800">
                    <OrderForm
                        market={selectedMarket}
                        balance={quoteBalance}
                        currentPrice={mockPrice}
                    />
                </div>

                <div className="flex-1 overflow-hidden">
                    <Tabs defaultValue="orderbook">
                        <TabsList className="w-full">
                            <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                            <TabsTrigger value="history">My Orders</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orderbook">
                            <OrderBook symbol={selectedSymbol} />
                        </TabsContent>
                        <TabsContent value="history">
                            <OrderHistory />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#0b0e11] text-[#eaecef] overflow-hidden select-none">
            {/* Top Stat Bar - Full Width */}
            <div className="flex items-center gap-8 px-4 h-14 bg-[#181a20] border-b border-gray-800 shrink-0">
                <MarketSelector
                    markets={mockMarkets}
                    selected={selectedSymbol}
                    onChange={setSelectedSymbol}
                />
                <PriceDisplay
                    price={mockPrice}
                    change24h={mockChange24h}
                    isConnected={mockIsConnected}
                />
                <div className="hidden xl:flex items-center gap-8 text-[11px] font-medium text-gray-500">
                    <div className="space-y-0.5">
                        <p className="uppercase text-[10px]">24h High</p>
                        <p className="text-white font-mono">45,230.00</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="uppercase text-[10px]">24h Low</p>
                        <p className="text-white font-mono">43,890.00</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="uppercase text-[10px]">24h Volume(BTC)</p>
                        <p className="text-white font-mono">1,245.32</p>
                    </div>
                    <div className="space-y-0.5">
                        <p className="uppercase text-[10px]">24h Volume(USDT)</p>
                        <p className="text-white font-mono">55,234,890.00</p>
                    </div>
                </div>
            </div>

            {/* Main Grid Area */}
            <div className="flex-1 grid grid-cols-[280px_1fr_320px] gap-px bg-gray-800 overflow-hidden">
                {/* Column 1: Order Book */}
                <aside className="bg-[#181a20] flex flex-col overflow-hidden">
                    <OrderBook symbol={selectedSymbol} />
                </aside>

                {/* Column 2: Center (Chart + Trading Panel) */}
                <main className="flex flex-col overflow-hidden bg-gray-800 gap-px">
                    <section className="flex-1 bg-[#181a20] relative min-h-[300px]">
                        <PriceChart symbol={selectedSymbol} />
                        {/* Internal Chart Tabs Overlay */}
                        <div className="absolute top-2 left-2 flex items-center gap-2 bg-[#181a20]/80 rounded p-1 z-10 backdrop-blur-sm">
                            <button className="px-2 py-0.5 text-[10px] font-bold text-primary-600 bg-gray-800 rounded">Time</button>
                            <button className="px-2 py-0.5 text-[10px] font-bold text-gray-500 hover:text-white">15m</button>
                            <button className="px-2 py-0.5 text-[10px] font-bold text-gray-500 hover:text-white">1h</button>
                            <button className="px-2 py-0.5 text-[10px] font-bold text-gray-500 hover:text-white">4h</button>
                            <button className="px-2 py-0.5 text-[10px] font-bold text-gray-500 hover:text-white">1d</button>
                        </div>
                    </section>

                    {/* Bottom Trading & History Panel */}
                    <section className="h-[420px] flex flex-col bg-[#181a20]">
                        <div className="flex items-center gap-px bg-gray-800 border-b border-gray-800 shrink-0">
                            <div className="flex-1 flex gap-px bg-gray-800">
                                <div className="bg-[#181a20] px-6 py-2 flex items-center gap-6">
                                    <span className="text-sm font-bold text-primary-600 border-b-2 border-primary-600 py-1 cursor-pointer">Spot</span>
                                    <span className="text-sm font-bold text-gray-500 hover:text-[#eaecef] cursor-pointer py-1">Margin</span>
                                    <span className="text-sm font-bold text-gray-500 hover:text-[#eaecef] cursor-pointer py-1">Grid</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex overflow-hidden">
                            {/* Order Forms Area */}
                            <div className="w-[480px] border-r border-gray-800 p-4 overflow-y-auto custom-scrollbar shrink-0">
                                <OrderForm
                                    market={selectedMarket}
                                    balance={quoteBalance}
                                    currentPrice={mockPrice}
                                />
                            </div>
                            {/* Order History Area */}
                            <div className="flex-1 overflow-hidden flex flex-col">
                                <div className="px-4 py-2 border-b border-gray-800 flex gap-6 shrink-0">
                                    <span className="text-xs font-bold text-primary-600 cursor-pointer">Open Orders(0)</span>
                                    <span className="text-xs font-bold text-gray-500 hover:text-white cursor-pointer">Order History</span>
                                    <span className="text-xs font-bold text-gray-500 hover:text-white cursor-pointer">Trade History</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <OrderHistory filters={{ status: 'open' }} />
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Column 3: Right (Markets + Recent Trades) */}
                <aside className="flex flex-col gap-px bg-gray-800 overflow-hidden">
                    <section className="h-[480px] bg-[#181a20] flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-gray-800 shrink-0">
                            <div className="flex items-center justify-between mb-3 text-[11px] font-bold text-gray-500">
                                <div className="flex gap-4">
                                    <span className="text-primary-600">USDT</span>
                                    <span className="hover:text-white cursor-pointer">BTC</span>
                                    <span className="hover:text-white cursor-pointer">ALTS</span>
                                </div>
                            </div>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search"
                                    className="w-full bg-[#0b0e11] border border-gray-800 rounded px-8 py-1.5 text-xs text-[#eaecef] focus:outline-none focus:border-primary-600"
                                />
                                <svg className="absolute left-2.5 top-2 h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <table className="w-full text-left text-[11px]">
                                <thead className="sticky top-0 bg-[#181a20] text-gray-500 font-bold border-b border-gray-800/50">
                                    <tr>
                                        <th className="px-3 py-2">Pair</th>
                                        <th className="px-3 py-2 text-right">Price</th>
                                        <th className="px-3 py-2 text-right">Change</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockMarkets.map(m => (
                                        <tr key={m.symbol} className="hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800/10">
                                            <td className="px-3 py-1.5 font-bold text-[#eaecef]">{m.symbol}</td>
                                            <td className="px-3 py-1.5 text-right font-mono">45,000.00</td>
                                            <td className="px-3 py-1.5 text-right font-bold text-success-600">+2.5%</td>
                                        </tr>
                                    ))}
                                    {/* Mock more rows */}
                                    {Array.from({ length: 12 }).map((_, i) => (
                                        <tr key={i} className="hover:bg-gray-800/50 cursor-pointer transition-colors border-b border-gray-800/10 opacity-60">
                                            <td className="px-3 py-1.5 font-bold text-[#eaecef]">OG-USDT</td>
                                            <td className="px-3 py-1.5 text-right font-mono">0.768</td>
                                            <td className="px-3 py-1.5 text-right font-bold text-danger-600">-5.5%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="flex-1 bg-[#181a20] overflow-hidden">
                        <RecentTrades symbol={selectedSymbol} />
                    </section>
                </aside>
            </div>
        </div>
    );
};

export default TradeView;
