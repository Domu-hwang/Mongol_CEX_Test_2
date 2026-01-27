import { useState } from "react";
import { Card } from "@/components/ui/card";
import { OrderBook } from "./OrderBook";
import { PriceChart } from "./PriceChart";
import { OrderForm } from "./OrderForm";
import { OrderHistory } from "./OrderHistory";
import { TokenInfo } from "./TokenInfo";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Star } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useParams, Link } from 'react-router-dom';
import { useMediaQuery } from "@/features/shared/hooks/useMediaQuery";
import { TRADE_DESKTOP_GRID_CONFIG } from "@/constants/ui-policy";
import React, { useEffect } from "react"; // Import useEffect for console.log

export const TradeView = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const displaySymbol = symbol ? `${symbol.toUpperCase()}-USDT` : 'BTC-USDT';
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    useEffect(() => {
        console.log("isDesktop:", isDesktop);
    }, [isDesktop]);

    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState<string[]>([]);

    const handleFavoriteToggle = (pair: string) => {
        setFavorites(prevFavorites =>
            prevFavorites.includes(pair)
                ? prevFavorites.filter(fav => fav !== pair)
                : [...prevFavorites, pair]
        );
    };

    const filteredMarkets = Array.from({ length: 20 }).map((_, i) => ({
        pair: `BTC/USDT-${i}`,
        price: `4215${i}.00`,
        change: `${i % 2 === 0 ? '+' : '-'}${i}.${i}0%`,
        isPositiveChange: i % 2 === 0,
    })).filter(market =>
        market.pair.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full p-1 box-border overflow-hidden">
            {/* Token Info and 24h Change Info (Header Section) */}
            <div className="mb-1">
                <TokenInfo
                    symbol={displaySymbol}
                    price={43658.36}
                    priceChange={-0.22}
                    volume24h={836880000}
                    high24h={45426.45}
                    low24h={43342.16}
                    variant="default" // You might need to adjust the variant or component if it needs to look like a separate header bar
                />
            </div>

            {/* Main Trading Grid */}
            <div className="flex-1 grid gap-1"
                style={{
                    gridTemplateColumns: TRADE_DESKTOP_GRID_CONFIG.gridTemplateColumns,
                    gridTemplateRows: TRADE_DESKTOP_GRID_CONFIG.gridTemplateRows,
                    gridTemplateAreas: TRADE_DESKTOP_GRID_CONFIG.gridTemplateAreas,
                }}>
                <Card className="rounded-none border-border flex flex-col" style={{ gridArea: 'market' }}>
                    <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase flex items-center">
                        <Star className="h-3 w-3 mr-2 text-muted-foreground" /> Market Pair
                    </div>
                    <div className="p-2 flex-grow flex flex-col overflow-hidden">
                        <Input
                            type="text"
                            placeholder="Search Pair"
                            className="mb-2 h-8 text-xs"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {/* Market List */}
                        <div className="w-full flex-1 flex flex-col overflow-hidden">
                            <div className="grid grid-cols-[20px_1fr_1fr_1fr] gap-1 text-[10px] text-muted-foreground border-b border-border pb-1 sticky top-0 bg-card">
                                <span className="col-span-1 flex justify-center items-center"><Star className="h-3 w-3" /></span>
                                <span className="col-span-1">Pair</span>
                                <span className="col-span-1 text-right">Price</span>
                                <span className="col-span-1 text-right">Change</span>
                            </div>
                            <div className="overflow-y-auto custom-scrollbar flex-1">
                                {filteredMarkets.map((market, i) => {
                                    const isFavorite = favorites.includes(market.pair);
                                    return (
                                        <div key={i} className="grid grid-cols-[20px_1fr_1fr_1fr] gap-1 py-1 hover:bg-muted/20 cursor-pointer">
                                            <span className="col-span-1 flex justify-center items-center" onClick={() => handleFavoriteToggle(market.pair)}>
                                                <Star className={cn('h-3 w-3', isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground')} />
                                            </span>
                                            <span className="col-span-1 text-foreground">{market.pair}</span>
                                            <span className="col-span-1 text-right">{market.price}</span>
                                            <span className={cn('col-span-1 text-right', market.isPositiveChange ? 'text-success' : 'text-destructive')}>
                                                {market.change}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div> {/* Closing div for "p-2 flex-grow flex flex-col overflow-hidden" */}
                </Card>

                {/* Chart */}
                <Card className="rounded-none border-border overflow-hidden flex flex-col" style={{ gridArea: 'chart' }}>
                    <Tabs defaultValue="chart" className="flex-1 flex flex-col">
                        <TabsList className="grid w-full grid-cols-3 rounded-none bg-transparent border-b border-border p-0 h-10">
                            <TabsTrigger value="chart" className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary">
                                Chart
                            </TabsTrigger>
                            <TabsTrigger value="info" className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary">
                                Info
                            </TabsTrigger>
                            <TabsTrigger value="trading-data" className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary">
                                Trading Data
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="chart" className="flex-1 overflow-hidden mt-0">
                            <PriceChart symbol={displaySymbol} />
                        </TabsContent>
                        <TabsContent value="info" className="flex-1 overflow-hidden mt-0 p-4 text-muted-foreground">
                            Token Info content here.
                        </TabsContent>
                        <TabsContent value="trading-data" className="flex-1 overflow-hidden mt-0 p-4 text-muted-foreground">
                            Trading Data will go here.
                        </TabsContent>
                    </Tabs>
                </Card>

                {/* Order History */}
                <Card className="rounded-none border-border overflow-hidden flex flex-col" style={{ gridArea: 'orderhistory' }}>
                    <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase">Order History</div>
                    <div className="flex-1 overflow-hidden relative">
                        <OrderHistory />
                    </div>
                </Card>

                {/* Order Book */}
                <Card className="rounded-none border-border overflow-hidden flex flex-col min-h-0" style={{ gridArea: 'orderbook' }}>
                    <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase">Order Book</div>
                    <div className="flex-1 overflow-hidden relative">
                        <OrderBook />
                    </div>
                </Card>

                {/* Order Form */}
                <Card className="rounded-none border-border overflow-hidden flex flex-col min-h-0" style={{ gridArea: 'orderform' }}>
                    <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase">Order Form</div>
                    <div className="flex-1 overflow-y-auto">
                        <OrderForm symbol={displaySymbol} />
                    </div>
                </Card>
            </div>
        </div>
    );
};