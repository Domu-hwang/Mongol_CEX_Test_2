import React, { useState, memo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createOrderFormSchema, OrderFormValues } from "@/features/trade/schemas/orderFormSchema";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useOrderTotalEstimation } from "@/features/trade/hooks/useOrderTotalEstimation";
import { tradeApi } from "@/features/trade/services/tradeApi";
import { OrderType } from "@/features/trade/types";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { TradeActionButton } from "./shared/TradeActionButton";
import { cn } from "@/lib/utils";

type TabOrderType = "limit" | "market" | "stop";

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
            total: "",
            triggerPrice: "",
            marketInputMode: "amount",
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
    const totalInput = watch("total");
    const marketInputMode = watch("marketInputMode");

    const [activeTab, setActiveTab] = useState<TabOrderType>("limit");

    useEffect(() => {
        if (activeTab === "limit" || activeTab === "market") {
            setValue("orderType", activeTab as OrderType, { shouldValidate: true });
            setValue("triggerPrice", "");
            setValue("price", "");
        } else if (activeTab === "stop") {
            setValue("orderType", "stop-limit" as OrderType, { shouldValidate: true });
            setValue("price", currentMarketPrice.toFixed(2), { shouldValidate: true });
        }
    }, [activeTab, setValue, currentMarketPrice]);

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
        price: orderType === "market" && marketInputMode === "total" ? String(currentMarketPrice) : price,
        amount: orderType === "market" && marketInputMode === "total" ? (parseFloat(totalInput) / currentMarketPrice).toFixed(2) : amount,
        marketPrice: currentMarketPrice,
    });

    const handleSliderChange = (value: number[]) => {
        const percentage = value[0];
        const availableBalance = side === 'buy' ? userQuoteAssetBalance : userBaseAssetBalance;
        const calculatedValue = (availableBalance * percentage) / 100;

        if (orderType === "market" && marketInputMode === "total") {
            setValue("total", calculatedValue.toFixed(2), { shouldValidate: true });
            setValue("amount", (calculatedValue / currentMarketPrice).toFixed(2), { shouldValidate: true });
        } else {
            setValue("amount", calculatedValue.toFixed(2), { shouldValidate: true });
            setValue("total", (calculatedValue * currentMarketPrice).toFixed(2), { shouldValidate: true });
        }
    };

    const handlePercentageClick = (pct: number) => {
        const availableBalance = side === 'buy' ? userQuoteAssetBalance : userBaseAssetBalance;
        const calculatedValue = (availableBalance * pct) / 100;

        if (orderType === "market" && marketInputMode === "total") {
            setValue("total", calculatedValue.toFixed(2), { shouldValidate: true });
            setValue("amount", (calculatedValue / currentMarketPrice).toFixed(2), { shouldValidate: true });
        } else {
            setValue("amount", calculatedValue.toFixed(2), { shouldValidate: true });
            setValue("total", (calculatedValue * currentMarketPrice).toFixed(2), { shouldValidate: true });
        }
    };

    const onSubmit = async (data: OrderFormValues) => {
        setIsLoading(true);
        try {
            let actualOrderType: OrderType;
            if (activeTab === "stop") {
                actualOrderType = data.orderType;
            } else {
                actualOrderType = activeTab;
            }

            const orderPayload = {
                symbol: symbol,
                side: data.side,
                type: actualOrderType,
                amount: (actualOrderType === "market" && data.marketInputMode === "total")
                    ? parseFloat(data.total as string) / currentMarketPrice
                    : parseFloat(data.amount as string),
                price: data.price ? parseFloat(data.price) : undefined,
                triggerPrice: data.triggerPrice ? parseFloat(data.triggerPrice) : undefined,
                limitPrice: (actualOrderType === "stop-limit" && data.price) ? parseFloat(data.price) : undefined,
            };

            if (actualOrderType === "stop-limit") {
                delete (orderPayload as any).price;
            }

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

    const handleOrderTypeChange = (tabValue: string) => {
        setActiveTab(tabValue as TabOrderType);
        if (tabValue === "limit") {
            setValue("orderType", "limit", { shouldValidate: true });
        } else if (tabValue === "market") {
            setValue("orderType", "market", { shouldValidate: true });
        } else if (tabValue === "stop") {
            setValue("orderType", "stop-limit", { shouldValidate: true });
        }
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
            <Tabs defaultValue="limit" className="w-full" value={activeTab} onValueChange={handleOrderTypeChange}>
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
                    <Form {...form as any}>
                        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-grow">
                            <div className="mt-0 p-4 flex flex-col gap-4">
                                <Tabs value={side} className="w-full" onValueChange={handleSideChange}>
                                    <TabsList className="w-full grid grid-cols-2 rounded-md bg-muted p-1 h-10">
                                        <TabsTrigger
                                            value="buy"
                                            className={cn(
                                                "rounded-md h-full transition-all font-medium",
                                                side === "buy"
                                                    ? "bg-success text-white shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Buy
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="sell"
                                            className={cn(
                                                "rounded-md h-full transition-all font-medium",
                                                side === "sell"
                                                    ? "bg-destructive text-white shadow-sm"
                                                    : "text-muted-foreground hover:text-foreground"
                                            )}
                                        >
                                            Sell
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>

                                <div className="space-y-3 mt-2">
                                    {activeTab === "stop" && (
                                        <FormField
                                            control={control}
                                            name="orderType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Stop Order Type</FormLabel>
                                                    <Select
                                                        onValueChange={(value) => {
                                                            field.onChange(value as OrderType);
                                                            setValue("price", "");
                                                            setValue("triggerPrice", "");
                                                        }}
                                                        defaultValue={field.value as string}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full text-left">
                                                                <SelectValue placeholder="Select a stop order type" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="stop-limit">Stop Limit</SelectItem>
                                                            <SelectItem value="stop-market">Stop Market</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}

                                    {(activeTab === "limit" || (activeTab === "stop" && orderType === "stop-limit")) && (
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

                                    {(orderType === "market" || (activeTab === "stop" && orderType === "stop-market")) && (
                                        <FormItem className="relative">
                                            <FormLabel className="text-[10px] text-muted-foreground uppercase mb-1 block">Price ({symbol.split('-')[1]})</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Market Price"
                                                    className="text-right"
                                                    value={currentMarketPrice.toFixed(2)}
                                                    disabled
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[10px]" />
                                        </FormItem>
                                    )}

                                    {activeTab === "stop" && (
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

                                    {activeTab === "market" ? (
                                        <FormField
                                            control={control}
                                            name="marketInputMode"
                                            render={({ field }) => (
                                                <FormItem className="relative">
                                                    <FormLabel className="w-full flex items-center text-[10px] text-muted-foreground uppercase font-bold mb-1 block">
                                                        <Select onValueChange={(value) => {
                                                            field.onChange(value);
                                                            setValue("amount", "");
                                                            setValue("total", "");
                                                        }} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="w-fit inline-flex items-center justify-start h-6 px-0 border-none bg-transparent shadow-none hover:bg-transparent data-[state=open]:bg-transparent data-[state=open]:text-primary focus:ring-0 focus:ring-offset-0">
                                                                    <div className="flex items-center gap-1 mr-5">
                                                                        <span className="text-muted-foreground">
                                                                            {field.value === "amount" ? "Amount" : "Total"}
                                                                        </span>
                                                                        <span className="text-muted-foreground font-normal">
                                                                            ({field.value === "amount" ? symbol.split('-')[0] : symbol.split('-')[1]})
                                                                        </span>
                                                                    </div>
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="amount">Amount</SelectItem>
                                                                <SelectItem value="total">Total</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </FormLabel>
                                                    <FormControl>
                                                        {field.value === "amount" ? (
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="text-right"
                                                                {...form.register("amount")}
                                                                value={amount ?? ""}
                                                                onChange={(e) => setValue("amount", e.target.value, { shouldValidate: true })}
                                                            />
                                                        ) : (
                                                            <Input
                                                                type="number"
                                                                placeholder="0.00"
                                                                className="text-right"
                                                                {...form.register("total")}
                                                                value={totalInput ?? ""}
                                                                onChange={(e) => setValue("total", e.target.value, { shouldValidate: true })}
                                                            />
                                                        )}
                                                    </FormControl>
                                                    <FormMessage className="text-[10px]">
                                                        {field.value === "amount" ? errors.amount?.message : errors.total?.message}
                                                    </FormMessage>
                                                </FormItem>
                                            )}
                                        />
                                    ) : (
                                        <FormField
                                            control={control}
                                            name="amount"
                                            render={({ field }) => (
                                                <FormItem className="relative">
                                                    <FormLabel className="w-full flex items-center text-[10px] text-muted-foreground uppercase font-bold mb-1 block">Amount ({symbol.split('-')[0]})</FormLabel>
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
                                    )}

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
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Max Buy:</span>
                                    <span className="text-foreground tabular-nums">
                                        {side === 'buy'
                                            ? `${userQuoteAssetBalance.toFixed(2)} ${symbol.split('-')[1]}`
                                            : `${(userBaseAssetBalance * currentMarketPrice).toFixed(2)} ${symbol.split('-')[1]}`
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between text-[10px] text-muted-foreground">
                                    <span>Est. Fee:</span>
                                    <span className="text-foreground tabular-nums">
                                        {((parseFloat(total) || 0) * 0.001).toFixed(4)} {symbol.split('-')[1]}
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
