import { Card } from "@/components/ui/card";
import { OrderBook } from "./OrderBook";
import { PriceChart } from "./PriceChart";
import { OrderForm } from "./OrderForm";
import { RecentTrades } from "./RecentTrades";
import { OrderHistory } from "./OrderHistory";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useParams } from 'react-router-dom';

export const TradeView = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const displaySymbol = symbol ? `${symbol}-USD` : 'BTC-USD';

    return (
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

                    {/* Top: Token Info & Chart Tabs */}
                    <Card className="flex-[4] rounded-none border-border overflow-hidden flex flex-col">
                        {/* Token Info Placeholder */}
                        <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase flex justify-between items-center">
                            <span>Token Info: {displaySymbol}</span>
                        </div>
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
                            <OrderForm />
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
    );
};
