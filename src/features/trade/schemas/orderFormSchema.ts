import { z } from "zod";

export const createOrderFormSchema = (marketPrice: number) => {
    return z.object({
        side: z.enum(["buy", "sell"], {
            required_error: "Trade side is required.",
        }),
        orderType: z.enum(["limit", "market", "stop-limit", "stop-market"], {
            required_error: "Order type is required.",
        }),
        price: z.string().optional(), // Price is optional for market orders and stop-market orders
        amount: z.string().optional(),
        total: z.string().optional(), // Total is used for market orders when input mode is 'total'
        triggerPrice: z.string().optional(), // Conditional based on orderType
        marketInputMode: z.enum(["amount", "total"]).default("amount"), // New field for market orders
    }).superRefine((data, ctx) => {
        // Validation for amount/total based on marketInputMode
        if (data.orderType === "market") {
            if (data.marketInputMode === "amount") {
                if (!data.amount || parseFloat(data.amount) <= 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Amount is required and must be positive for Market orders.",
                        path: ["amount"],
                    });
                }
            } else if (data.marketInputMode === "total") {
                if (!data.total || parseFloat(data.total) <= 0) {
                    ctx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: "Total is required and must be positive for Market orders.",
                        path: ["total"],
                    });
                }
            }
        } else {
            // Amount is required for Limit and Stop orders
            if (!data.amount || parseFloat(data.amount) <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Amount is required and must be positive.",
                    path: ["amount"],
                });
            }
        }

        // Price is required for Limit and Stop-Limit orders
        if (data.orderType === "limit" || data.orderType === "stop-limit") {
            if (!data.price || parseFloat(data.price) <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Price is required and must be positive for Limit and Stop-Limit orders.",
                    path: ["price"],
                });
            }
        }

        // Trigger price is required for Stop-Limit and Stop-Market orders
        if (data.orderType === "stop-limit" || data.orderType === "stop-market") {
            const numericTriggerPrice = parseFloat(data.triggerPrice as string) || 0;

            if (!data.triggerPrice || numericTriggerPrice <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Trigger Price is required and must be positive for Stop orders.",
                    path: ["triggerPrice"],
                });
            }

            // Conditional validation for Buy Stop Trigger Price
            if (data.side === "buy" && numericTriggerPrice <= marketPrice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "For a Buy Stop order, Trigger Price should be greater than the current market price.",
                    path: ["triggerPrice"],
                });
            }

            // Conditional validation for Sell Stop Trigger Price
            if (data.side === "sell" && numericTriggerPrice >= marketPrice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "For a Sell Stop order, Trigger Price should be less than the current market price.",
                    path: ["triggerPrice"],
                });
            }
        }
    });
};

export type OrderFormValues = z.infer<ReturnType<typeof createOrderFormSchema>>;
