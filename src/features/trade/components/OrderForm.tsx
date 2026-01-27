import React, { useState, useEffect, useCallback, memo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { createOrderFormSchema, OrderFormValues } from "@/features/trade/schemas/orderFormSchema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useOrderTotalEstimation } from "@/features/trade/hooks/useOrderTotalEstimation";
import { tradeApi } from "@/features/trade/services/tradeApi";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { TradeActionButton } from "./shared/TradeActionButton";

interface OrderFormProps {
    symbol?: string;
}

const OrderForm = memo(({ symbol = "BTC-USDT" }: OrderFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentMarketPrice, setCurrentMarketPrice] = useState(0);
    const [userQuoteAssetBalance, setUserQuoteAssetBalance] = useState(0);
    const [userBaseAssetBalance, setUserBaseAssetBalance] = useState(0);
    const { toast } = useToast();

    const form = useForm<OrderFormValues>({
        resolver: zodResolver(createOrderFormSchema(currentMarketPrice)),
        defaultValues: {
            side: "buy",
            orderType: "limit",
            price: "",
            amount: "",
            triggerPrice: "",
        },
        mode: "onChange",
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

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [orderBook, balances] = await Promise.all([
                tradeApi.fetchOrderBook(symbol),
                tradeApi.fetchBalances(),
            ]);

            setCurrentMarketPrice(orderBook.bids[0]?.price || 0);

            const quoteSymbol = symbol.split('-')[1] || 'USDT';
            const baseSymbol = symbol.split('-')[0] || 'BTC';

            const quoteBalance = balances.find(b => b.asset === quoteSymbol);
            const baseBalance = balances.find(b => b.asset === baseSymbol);

            setUserQuoteAssetBalance(quoteBalance?.available ?? 0);
            setUserBaseAssetBalance(baseBalance?.available ?? 0);

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
    }, [symbol, price, setValue, toast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

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
            let type: "market" | "limit" | "stop-limit" | "stop-market";
            if (data.orderType === "limit") {
                type = "limit";
            } else if (data.orderType === "market") {
                type = "market";
            } else {
                type = "stop-limit";
            }

            const orderPayload = {
                symbol: symbol,
                side: data.side,
                type: type,
                amount: parseFloat(data.amount),
                price: data.price ? parseFloat(data.price) : undefined,
                triggerPrice: data.triggerPrice ? parseFloat(data.triggerPrice) : undefined,
            };

            const response = await tradeApi.placeOrder(orderPayload);

            toast({
                title: "Order Placed!",
                description: `Your ${response.type} ${response.side} order for ${response.amount} ${symbol.split('-')[0]} is ${response.status}.`,
            });
            reset();
        } catch (error: any) {
            toast({
                title: "Order Failed",
                description: error.message || "There was an issue placing your order.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleOrderTypeChange = (value: string) => {
        setValue("orderType", value as "limit" | "market" | "stop");
    };

    const handleSideChange = (value: string) => {
        setValue("side", value as "buy" | "sell");
    };

    const renderSkeleton = () => (
        <div className="p-4 space-y-4">
            <div className="flex gap-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
            </div>
            <div className="space-y-4 pt-4">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="pt-2">
                    <Skeleton className="h-6 w-full" />
                </div>
                <Skeleton className="h-12 w-full mt-4" />
            </div>
        </div>
    );

    return (
        <div className="relative h-full flex flex-col">
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

                {isLoading ? renderSkeleton() : (
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow">
                            <div className="mt-0 p-4 flex flex-col gap-4">
                                <Tabs value={side} className="w-full" onValueChange={handleSideChange}>
                                    <TabsList className="w-full grid grid-cols-2 rounded-md bg-muted p-1">
                                        <TabsTrigger
                                            value="buy"
                                            className="rounded-md h-full data-[state=active]:bg-success data-[state=active]:text-white transition-all"
                                        >
                                            Buy
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="sell"
                                            className="rounded-md h-full data-[state=active]:bg-destructive data-[state=active]:text-white transition-all"
                                        >
                                            Sell
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <div className="space-y-3 mt-2">
                                    {(orderType === "limit" || orderType === "stop") && (
                                        <FormField
                                            control={control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem className="relative">
                                                    <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Price ({symbol.split('-')[1]})</FormLabel>
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
                                                    <FormMessage className="text-[10px]">{errors.price?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {orderType === "market" && (
                                        <div className="relative">
                                            <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Price</label>
                                            <div className="w-full p-2 bg-muted/50 rounded text-right text-sm text-muted-foreground border border-transparent">
                                                Market Price
                                            </div>
                                        </div>
                                    )}

                                    {orderType === "stop" && (
                                        <FormField
                                            control={control}
                                            name="triggerPrice"
                                            render={({ field }) => (
                                                <FormItem className="relative">
                                                    <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Trigger Price ({symbol.split('-')[1]})</FormLabel>
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
                                                    <FormMessage className="text-[10px]">{errors.triggerPrice?.message}</FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    <FormField
                                        control={control}
                                        name="amount"
                                        render={({ field }) => (
                                            <FormItem className="relative">
                                                <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Amount ({symbol.split('-')[0]})</FormLabel>
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
                                                <FormMessage className="text-[10px]">{errors.amount?.message}</FormMessage>
                                            </FormItem>
                                        )}
                                    />

                                    <div className="pt-2">
                                        <Slider
                                            defaultValue={[0]}
                                            max={100}
                                            step={1}
                                            onValueChange={handleSliderChange}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-[10px] text-muted-foreground mt-2 px-1">
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
                                        <label className="text-[10px] text-muted-foreground uppercase mb-1 block">Total ({symbol.split('-')[1]})</label>
                                        <div className="w-full p-2 bg-muted/20 rounded text-right text-sm font-mono border border-transparent">
                                            {total === "NaN" ? "0.00" : total}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <TradeActionButton
                                        type="submit"
                                        disabled={isLoading}
                                        side={side}
                                        label={side === 'buy' ? `Buy ${symbol.split('-')[0]}` : `Sell ${symbol.split('-')[0]}`}
                                    />
                                </div>

                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Avail:</span>
                                    <span className="text-foreground tabular-nums">
                                        {side === 'buy'
                                            ? `${userQuoteAssetBalance.toFixed(2)} ${symbol.split('-')[1]}`
                                            : `${userBaseAssetBalance.toFixed(4)} ${symbol.split('-')[0]}`
                                        }
                                    </span>
                                </div>
                            </div>
                        </form>
                    </Form>
                )}
            </Tabs>
        </div>
    );
});

export { OrderForm };