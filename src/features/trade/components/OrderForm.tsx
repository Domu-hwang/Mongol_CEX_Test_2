import React, { useState, useEffect, useCallback, memo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/Slider"; // Import Slider component
import { createOrderFormSchema, OrderFormValues } from "@/features/trade/schemas/orderFormSchema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"; // Import Form component
import { useOrderTotalEstimation } from "@/features/trade/hooks/useOrderTotalEstimation";
import { tradeApi } from "@/features/trade/services/tradeApi"; // Import tradeApi
import { useToast } from "@/components/ui/use-toast"; // Import useToast

const TRADING_PAIR_SYMBOL = "BTC-USDT"; // Define trading pair symbol

const OrderForm = memo(() => {
    const [isLoading, setIsLoading] = useState(false); // State for skeleton loading
    const [currentMarketPrice, setCurrentMarketPrice] = useState(0); // Actual market price
    const [userQuoteAssetBalance, setUserQuoteAssetBalance] = useState(0); // e.g., USDT
    const [userBaseAssetBalance, setUserBaseAssetBalance] = useState(0);    // e.g., BTC
    const { toast } = useToast();

    // Initialize form with resolver that includes currentMarketPrice
    const form = useForm<OrderFormValues>({
        resolver: zodResolver(createOrderFormSchema(currentMarketPrice)),
        defaultValues: {
            side: "buy",
            orderType: "limit",
            price: "", // Initialize as empty string for inputs
            amount: "",
            triggerPrice: "",
        },
        mode: "onChange", // Validate on change
    });

    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors },
        reset,
    } = form;

    const side = watch("side");
    const orderType = watch("orderType");
    const price = watch("price");
    const amount = watch("amount");
    const triggerPrice = watch("triggerPrice");

    // Fetch market data and balances
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [orderBook, balances] = await Promise.all([
                tradeApi.fetchOrderBook(TRADING_PAIR_SYMBOL),
                tradeApi.fetchBalances(),
            ]);

            setCurrentMarketPrice(orderBook.bids[0]?.price || 0); // Use the highest bid as a proxy for market price

            const usdtBalance = balances.find(b => b.asset === 'USDT');
            const btcBalance = balances.find(b => b.asset === 'BTC');

            setUserQuoteAssetBalance(usdtBalance?.available ?? 0);
            setUserBaseAssetBalance(btcBalance?.available ?? 0);

            // Update form default values if needed, e.g., initial price
            // Only set if price is empty or zero, to avoid overwriting user input
            if (!price || parseFloat(price) === 0) {
                setValue("price", orderBook.bids[0]?.price.toFixed(2) || "");
            }

        } catch (error) {
            console.error("Failed to fetch market data or balances:", error);
            toast({
                title: "Data Fetch Error",
                description: "Failed to load market data or user balances.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }, [price, setValue, toast]);

    useEffect(() => {
        fetchData();
        // Set up polling or websocket for real-time updates if needed
    }, [fetchData]);

    // Real-time Total Calculation Hook
    const total = useOrderTotalEstimation({
        orderType,
        price,
        amount,
        marketPrice: currentMarketPrice,
    });

    const handleSliderChange = (value: number[]) => {
        const percentage = value[0];
        const availableBalance = side === 'buy' ? userQuoteAssetBalance : userBaseAssetBalance;
        const calculatedAmount = (availableBalance * percentage) / 100;
        setValue("amount", calculatedAmount.toFixed(2), { shouldValidate: true });
    };

    const handlePercentageClick = (pct: number) => {
        const availableBalance = side === 'buy' ? userQuoteAssetBalance : userBaseAssetBalance;
        const calculatedAmount = (availableBalance * pct) / 100;
        setValue("amount", calculatedAmount.toFixed(2), { shouldValidate: true });
    };

    const onSubmit = async (data: OrderFormValues) => {
        setIsLoading(true);
        try {
            // Map frontend form state to backend DTO
            let type: "market" | "limit" | "stop-limit" | "stop-market";
            if (data.orderType === "limit") {
                type = "limit";
            } else if (data.orderType === "market") {
                type = "market";
            } else { // data.orderType === "stop"
                // For stop orders, determine if it's stop-limit or stop-market
                // Based on PRD, 'Stop' converts to STOP_LOSS_LIMIT or TAKE_PROFIT.
                // Assuming 'stop-limit' for now as 'price' is available.
                type = "stop-limit";
            }

            const orderPayload = {
                symbol: TRADING_PAIR_SYMBOL, // Use defined trading pair symbol
                side: data.side,
                type: type,
                amount: parseFloat(data.amount),
                price: data.price ? parseFloat(data.price) : undefined,
                triggerPrice: data.triggerPrice ? parseFloat(data.triggerPrice) : undefined,
            };

            const response = await tradeApi.placeOrder(orderPayload);
            console.log("Order submitted successfully:", response);

            toast({
                title: "Order Placed!",
                description: `Your ${response.type} ${response.side} order for ${response.amount} BTC is ${response.status}.`,
                variant: response.type.startsWith('stop') ? "default" : "success", // Use default for scheduled, success for immediate
            });
            reset(); // Reset form after successful submission
        } catch (error: any) {
            console.error("Order submission failed:", error);
            toast({
                title: "Order Failed",
                description: error.message || "There was an issue placing your order.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Update orderType in form state when tab changes
    const handleOrderTypeChange = (value: string) => {
        setValue("orderType", value as "limit" | "market" | "stop");
    };

    // Update side in form state when tab changes
    const handleSideChange = (value: string) => {
        setValue("side", value as "buy" | "sell");
    };

    return (
        <div className="relative h-full flex flex-col">
            {isLoading && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-10 animate-pulse rounded-md">
                    <span className="text-muted-foreground text-sm">Loading...</span>
                </div>
            )}

            <Tabs defaultValue="limit" className="w-full" onValueChange={handleOrderTypeChange}>
                <TabsList className="w-full grid grid-cols-3 rounded-none bg-transparent border-b border-border p-0 h-10">
                    <TabsTrigger
                        value="limit"
                        className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        Limit
                    </TabsTrigger>
                    <TabsTrigger
                        value="market"
                        className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        Market
                    </TabsTrigger>
                    <TabsTrigger
                        value="stop"
                        className="rounded-none h-full data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary"
                    >
                        Stop
                    </TabsTrigger>
                </TabsList>

                <Form {...form}> {/* Wrap the form with the shadcn Form component */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow">
                        {/* Content for Limit Order */}
                        <TabsContent value="limit" className="mt-0 p-4 flex flex-col gap-4">
                            <Tabs defaultValue="buy" className="w-full" onValueChange={handleSideChange}>
                                <TabsList className="w-full grid grid-cols-2 rounded-md bg-muted p-1">
                                    <TabsTrigger
                                        value="buy"
                                        className="rounded-md h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                                    >
                                        Buy
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="sell"
                                        className="rounded-md h-full data-[state=active]:bg-rose-600 data-[state=active]:text-white"
                                    >
                                        Sell
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="space-y-3 mt-4">
                                <FormField
                                    control={control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Price (USDT)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="text-right"
                                                    {...field}
                                                    value={field.value ?? ""} // Ensure controlled component
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage>{errors.price?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Amount (BTC)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="text-right"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage>{errors.amount?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                {/* Percent Slider */}
                                <div className="pt-2">
                                    <Slider
                                        defaultValue={[0]}
                                        max={100}
                                        step={1}
                                        onValueChange={handleSliderChange}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                                        {[0, 25, 50, 75, 100].map((pct) => (
                                            <span
                                                key={pct}
                                                className="cursor-pointer hover:text-primary transition-colors"
                                                onClick={() => handlePercentageClick(pct)}
                                            >
                                                {pct}%
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative pt-2">
                                    <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Total (USDT)</label>
                                    <div className="w-full p-2 bg-muted/20 rounded text-right text-sm font-mono border border-transparent hover:border-border transition-colors">
                                        {total === "NaN" ? "0.00" : total}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    className={`w-full font-bold text-white ${side === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                                >
                                    {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
                                </Button>
                            </div>

                            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                                <span>Avail:</span>
                                <span className="text-foreground">{userQuoteAssetBalance.toFixed(2)} USDT</span>
                            </div>
                        </TabsContent>

                        {/* Content for Market Order */}
                        <TabsContent value="market" className="mt-0 p-4 flex flex-col gap-4">
                            <Tabs defaultValue="buy" className="w-full" onValueChange={handleSideChange}>
                                <TabsList className="w-full grid grid-cols-2 rounded-md bg-muted p-1">
                                    <TabsTrigger
                                        value="buy"
                                        className="rounded-md h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                                    >
                                        Buy
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="sell"
                                        className="rounded-md h-full data-[state=active]:bg-rose-600 data-[state=active]:text-white"
                                    >
                                        Sell
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="space-y-3 mt-4">
                                <FormField
                                    control={control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Amount (BTC)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="text-right"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage>{errors.amount?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                {/* Percent Slider */}
                                <div className="pt-2">
                                    <Slider
                                        defaultValue={[0]}
                                        max={100}
                                        step={1}
                                        onValueChange={handleSliderChange}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                                        {[0, 25, 50, 75, 100].map((pct) => (
                                            <span
                                                key={pct}
                                                className="cursor-pointer hover:text-primary transition-colors"
                                                onClick={() => handlePercentageClick(pct)}
                                            >
                                                {pct}%
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative pt-2">
                                    <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Total (USDT)</label>
                                    <div className="w-full p-2 bg-muted/20 rounded text-right text-sm font-mono border border-transparent hover:border-border transition-colors">
                                        {total === "NaN" ? "0.00" : total}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    className={`w-full font-bold text-white ${side === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                                >
                                    {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
                                </Button>
                            </div>

                            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                                <span>Avail:</span>
                                <span className="text-foreground">{userQuoteAssetBalance.toFixed(2)} USDT</span>
                            </div>
                        </TabsContent>

                        {/* Content for Stop Order */}
                        <TabsContent value="stop" className="mt-0 p-4 flex flex-col gap-4">
                            <Tabs defaultValue="buy" className="w-full" onValueChange={handleSideChange}>
                                <TabsList className="w-full grid grid-cols-2 rounded-md bg-muted p-1">
                                    <TabsTrigger
                                        value="buy"
                                        className="rounded-md h-full data-[state=active]:bg-emerald-600 data-[state=active]:text-white"
                                    >
                                        Buy
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="sell"
                                        className="rounded-md h-full data-[state=active]:bg-rose-600 data-[state=active]:text-white"
                                    >
                                        Sell
                                    </TabsTrigger>
                                </TabsList>
                            </Tabs>

                            <div className="space-y-3 mt-4">
                                <FormField
                                    control={control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Price (USDT)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="text-right"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage>{errors.price?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="triggerPrice"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Trigger Price (USDT)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="text-right"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage>{errors.triggerPrice?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem className="relative">
                                            <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Amount (BTC)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="0.00"
                                                    className="text-right"
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    onChange={(e) => field.onChange(e.target.value)}
                                                />
                                            </FormControl>
                                            <FormMessage>{errors.amount?.message}</FormMessage>
                                        </FormItem>
                                    )}
                                />

                                {/* Percent Slider */}
                                <div className="pt-2">
                                    <Slider
                                        defaultValue={[0]}
                                        max={100}
                                        step={1}
                                        onValueChange={handleSliderChange}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                                        {[0, 25, 50, 75, 100].map((pct) => (
                                            <span
                                                key={pct}
                                                className="cursor-pointer hover:text-primary transition-colors"
                                                onClick={() => handlePercentageClick(pct)}
                                            >
                                                {pct}%
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative pt-2">
                                    <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Total (USDT)</label>
                                    <div className="w-full p-2 bg-muted/20 rounded text-right text-sm font-mono border border-transparent hover:border-border transition-colors">
                                        {total === "NaN" ? "0.00" : total}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4">
                                <Button
                                    type="submit"
                                    className={`w-full font-bold text-white ${side === 'buy' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}
                                >
                                    {side === 'buy' ? 'Buy BTC' : 'Sell BTC'}
                                </Button>
                            </div>

                            <div className="flex justify-between text-[10px] text-muted-foreground mt-2">
                                <span>Avail:</span>
                                <span className="text-foreground">{userQuoteAssetBalance.toFixed(2)} USDT</span>
                            </div>
                        </TabsContent>
                    </form>
                </Form>
            </Tabs>
        </div>
    );
});

export { OrderForm };