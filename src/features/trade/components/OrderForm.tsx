import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const OrderForm = () => {
    const [side, setSide] = useState<"buy" | "sell">("buy");
    const [price, setPrice] = useState("42150");
    const [amount, setAmount] = useState("");

    // Simple calculation
    const total = (parseFloat(price || "0") * parseFloat(amount || "0")).toFixed(2);

    return (
        <div className="h-full flex flex-col">
            <Tabs defaultValue="buy" className="w-full" onValueChange={(v) => setSide(v as any)}>
                <TabsList className="w-full grid grid-cols-2 rounded-none bg-transparent border-b border-border p-0 h-10">
                    <TabsTrigger
                        value="buy"
                        className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-emerald-500 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500"
                    >
                        Buy
                    </TabsTrigger>
                    <TabsTrigger
                        value="sell"
                        className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-rose-500 data-[state=active]:border-b-2 data-[state=active]:border-rose-500"
                    >
                        Sell
                    </TabsTrigger>
                </TabsList>

                <div className="p-4 flex flex-col gap-4">
                    {/* Order Type */}
                    <div className="flex gap-2 text-xs mb-2">
                        <button className="text-primary font-bold bg-muted/20 px-2 py-1 rounded">Limit</button>
                        <button className="text-muted-foreground hover:text-primary px-2 py-1">Market</button>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-3">
                        <div className="relative">
                            <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Price (USDT)</label>
                            <Input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="text-right"
                            />
                        </div>

                        <div className="relative">
                            <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Amount (BTC)</label>
                            <Input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="text-right"
                            />
                        </div>

                        {/* Percent Slider Mock */}
                        <div className="flex justify-between gap-1 mt-2">
                            {[25, 50, 75, 100].map((pct) => (
                                <button key={pct} className="bg-muted/30 text-[10px] py-1 flex-1 rounded hover:bg-muted/50 transition-colors">
                                    {pct}%
                                </button>
                            ))}
                        </div>

                        <div className="relative pt-2">
                            <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Total (USDT)</label>
                            <div className="w-full p-2 bg-muted/20 rounded text-right text-sm font-mono border border-transparent hover:border-border transition-colors">
                                {total === "NaN" ? "0.00" : total}
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4">
                        {/* Login Check: If logged in, show Buy/Sell button. Else, show Login button */}
                        <Button
                            className={`w-full font-bold text-white ${side === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                        >
                            {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
                        </Button>
                    </div>

                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                        <span>Avail:</span>
                        <span className="text-foreground">1,402.32 USDT</span>
                    </div>
                </div>
            </Tabs>
        </div>
    );
};
