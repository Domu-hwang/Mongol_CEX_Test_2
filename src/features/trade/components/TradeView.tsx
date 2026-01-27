import { useState } from "react";
import { Card } from "@/components/ui/card";
import { OrderBook } from "./OrderBook";
import { PriceChart } from "./PriceChart";
import { OrderForm } from "./OrderForm";
import { RecentTrades } from "./RecentTrades";
import { OrderHistory } from "./OrderHistory";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"; // Added SheetClose, SheetHeader, SheetTitle
import { Button } from "@/components/ui/button";
import { useParams, Link } from 'react-router-dom';
import { Menu, BarChart3, BookOpen, History, X, Home, Wallet, RefreshCw, User } from 'lucide-react';
import { useMediaQuery } from "@/features/shared/hooks/useMediaQuery"; // Import useMediaQuery

export const TradeView = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const displaySymbol = symbol ? `${symbol.toUpperCase()}-USDT` : 'BTC-USDT';
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isTransactionSheetOpen, setIsTransactionSheetOpen] = useState(false); // Renamed state for clarity
    const [mobileContentTab, setMobileContentTab] = useState<string>("chart"); // New state for mobile content tabs
    const isDesktop = useMediaQuery("(min-width: 1024px)"); // Hook to check desktop view

    // Mobile Navigation Items (for sidebar)
    const mobileNavItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: BarChart3, label: 'Trade', path: '/trade' },
        { icon: RefreshCw, label: 'Swap', path: '/quick-swap' },
        { icon: Wallet, label: 'Wallet', path: '/wallet' },
        { icon: User, label: 'Account', path: '/account' },
    ];

    return (
        <>
            {/* ============ MOBILE LAYOUT (< lg) ============ */}
            {!isDesktop && (
                <div className="flex flex-col h-[calc(100vh-64px)] bg-background">
                    {/* Mobile Header with Symbol & Menu */}
                    <div className="flex items-center justify-between p-3 border-b border-border bg-card">
                        <div className="flex items-center gap-2">
                            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-64 p-0">
                                    <div className="flex flex-col h-full">
                                        {/* Sidebar Header */}
                                        <div className="p-4 border-b border-border">
                                            <Link to="/" className="text-xl font-bold text-primary">
                                                IKH MYANGAN
                                            </Link>
                                        </div>
                                        {/* Navigation Items */}
                                        <nav className="flex-1 p-4 space-y-2">
                                            {mobileNavItems.map((item) => (
                                                <Link
                                                    key={item.path}
                                                    to={item.path}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-foreground hover:bg-muted transition-colors"
                                                >
                                                    <item.icon className="h-5 w-5" />
                                                    <span>{item.label}</span>
                                                </Link>
                                            ))}
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>
                            <span className="font-semibold text-foreground">{displaySymbol}</span>
                        </div>
                        <div className="text-right">
                            <span className="text-lg font-bold text-success">$42,150.00</span>
                            <span className="text-xs text-success ml-2">+2.34%</span>
                        </div>
                    </div>

                    {/* Mobile Main Content Tabs (Chart, Order Book, Order Form, Trades) */}
                    <Tabs value={mobileContentTab} onValueChange={setMobileContentTab} className="flex-1 flex flex-col overflow-hidden">
                        <TabsList className="grid grid-cols-4 rounded-none bg-card border-b border-border p-0 h-11 shrink-0">
                            <TabsTrigger
                                value="chart"
                                className="rounded-none h-full text-xs data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                            >
                                Chart
                            </TabsTrigger>
                            <TabsTrigger
                                value="orderbook"
                                className="rounded-none h-full text-xs data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                            >
                                Order Book
                            </TabsTrigger>
                            <TabsTrigger
                                value="trade-form"
                                className="rounded-none h-full text-xs data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                            >
                                Trade
                            </TabsTrigger>
                            <TabsTrigger
                                value="info"
                                className="rounded-none h-full text-xs data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                            >
                                Info
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="chart" className="flex-1 flex flex-col overflow-hidden mt-0 p-1">
                            <PriceChart symbol={displaySymbol} />
                        </TabsContent>

                        <TabsContent value="orderbook" className="flex-1 flex flex-col overflow-hidden mt-0 p-1">
                            <OrderBook />
                        </TabsContent>

                        <TabsContent value="trade-form" className="flex-1 flex flex-col overflow-y-auto mt-0 p-1">
                            <OrderForm symbol={displaySymbol} />
                        </TabsContent>

                        <TabsContent value="info" className="flex-1 overflow-y-auto mt-0 p-2 text-muted-foreground">
                            Token Information will go here.
                        </TabsContent>
                    </Tabs>

                    {/* CTA Buttons for Buy/Sell at the bottom */}
                    <div className="flex w-full sticky bottom-0 bg-background border-t border-border">
                        <Button
                            variant="buy"
                            className="flex-1 h-12 rounded-none text-lg"
                            onClick={() => setIsTransactionSheetOpen(true)}
                        >
                            Buy
                        </Button>
                        <Button
                            variant="sell"
                            className="flex-1 h-12 rounded-none text-lg"
                            onClick={() => setIsTransactionSheetOpen(true)}
                        >
                            Sell
                        </Button>
                    </div>

                    {/* Transaction Sheet for Recent Trades and Order History */}
                    <Sheet open={isTransactionSheetOpen} onOpenChange={setIsTransactionSheetOpen}>
                        <SheetContent side="bottom" className="h-3/4 flex flex-col p-1"> {/* Changed p-0 to p-1 */}
                            <SheetHeader className="p-3 border-b border-border flex flex-row items-center justify-between"> {/* Adjusted padding */}
                                <SheetTitle>Recent Trades & Order History</SheetTitle>
                                <SheetClose asChild>
                                    <Button variant="ghost" size="icon">
                                        <X className="h-5 w-5" />
                                    </Button>
                                </SheetClose>
                            </SheetHeader>
                            <Tabs defaultValue="recent-trades" className="flex-1 flex flex-col overflow-hidden">
                                <TabsList className="grid grid-cols-2 rounded-none bg-card border-b border-border p-0 h-11 shrink-0">
                                    <TabsTrigger
                                        value="recent-trades"
                                        className="rounded-none h-full text-xs data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                    >
                                        Recent Trades
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="order-history"
                                        className="rounded-none h-full text-xs data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                    >
                                        Order History
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value="recent-trades" className="flex-1 overflow-y-auto mt-0 p-1"> {/* Changed p-2 to p-1 */}
                                    <RecentTrades />
                                </TabsContent>
                                <TabsContent value="order-history" className="flex-1 overflow-y-auto mt-0 p-1"> {/* Changed p-2 to p-1 */}
                                    <OrderHistory />
                                </TabsContent>
                            </Tabs>
                        </SheetContent>
                    </Sheet>
                </div>
            )}

            {/* ============ DESKTOP LAYOUT (>= lg) ============ */}
            {isDesktop && ( // Use isDesktop to conditionally render desktop layout
                <div className="h-[calc(100vh-64px)] w-full bg-background p-1 box-border overflow-hidden">
                    {/* Main Grid Layout (3 columns) */}
                    <div className="grid grid-cols-12 grid-rows-6 gap-1 h-full">

                        {/* --- LEFT COLUMN: Order Book --- */}
                        <Card className="col-span-2 row-span-6 rounded-none border-border overflow-hidden flex flex-col">
                            <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase">Order Book</div>
                            <div className="flex-1 overflow-hidden relative">
                                <OrderBook />
                            </div>
                        </Card>

                        {/* --- CENTER COLUMN: Token Info, Chart Tabs & Recent Trades --- */}
                        <div className="col-span-7 row-span-6 flex flex-col gap-1">

                            {/* Top: Chart Tabs & Token Info */}
                            <Card className="flex-[4] rounded-none border-border overflow-hidden flex flex-col">
                                {/* Chart, Info, Trading Data Tabs */}
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
                                        Token Information will go here.
                                    </TabsContent>
                                    <TabsContent value="trading-data" className="flex-1 overflow-hidden mt-0 p-4 text-muted-foreground">
                                        Trading Data will go here.
                                    </TabsContent>
                                </Tabs>
                                {/* Token Info Placeholder */}
                                <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase flex justify-between items-center">
                                    <span>Token Info: {displaySymbol}</span>
                                </div>
                            </Card>

                            {/* Bottom: Recent Trades */}
                            <Card className="flex-[1] rounded-none border-border overflow-hidden flex flex-col min-h-0">
                                <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase">Recent Trades</div>
                                <div className="flex-1 overflow-y-auto">
                                    <RecentTrades />
                                </div>
                            </Card>
                        </div>

                        {/* --- RIGHT COLUMN: Order Form & Order History --- */}
                        <div className="col-span-3 row-span-6 flex flex-col gap-1">

                            {/* Top: Order Form */}
                            <Card className="rounded-none border-border overflow-hidden flex flex-col min-h-0">
                                <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase">Order Form</div>
                                <div className="flex-1 overflow-y-auto">
                                    <OrderForm symbol={displaySymbol} />
                                </div>
                            </Card>

                            {/* Bottom: Order History */}
                            <Card className="flex-[1] rounded-none border-border overflow-hidden flex flex-col min-h-0">
                                <Tabs defaultValue="order-history" className="flex-1 flex flex-col">
                                    <TabsList className="grid w-full grid-cols-1 rounded-none bg-transparent border-b border-border p-0 h-10">
                                        <TabsTrigger value="order-history" className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary">
                                            Order History
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="order-history" className="flex-1 overflow-hidden mt-0">
                                        <OrderHistory />
                                    </TabsContent>
                                </Tabs>
                            </Card>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
};
