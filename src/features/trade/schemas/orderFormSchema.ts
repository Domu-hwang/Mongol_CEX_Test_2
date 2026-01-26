import { z } from "zod";

export const createOrderFormSchema = (marketPrice: number) => {
    return z.object({
        side: z.enum(["buy", "sell"], {
            required_error: "Trade side is required.",
        }),
        orderType: z.enum(["limit", "market", "stop"], {
            required_error: "Order type is required.",
        }),
        price: z.string().optional(), // Price is optional for market orders
        amount: z.string().min(1, { message: "Amount is required." }),
        triggerPrice: z.string().optional(), // Conditional based on orderType
    }).superRefine((data, ctx) => {
        if (data.orderType === "limit" || data.orderType === "stop") {
            if (!data.price || parseFloat(data.price) <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Price is required and must be positive for Limit and Stop orders.",
                    path: ["price"],
                });
            }
        }

        if (data.orderType === "stop") {
            const numericPrice = parseFloat(data.price as string) || 0;
            const numericTriggerPrice = parseFloat(data.triggerPrice as string) || 0;

            if (!data.triggerPrice || numericTriggerPrice <= 0) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "Trigger Price is required and must be positive for Stop orders.",
                    path: ["triggerPrice"],
                });
            }

            // Conditional validation for Buy Stop Price
            if (data.side === "buy" && numericTriggerPrice > marketPrice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "For a Buy Stop order, Trigger Price must be less than or equal to the current market price.",
                    path: ["triggerPrice"],
                });
            }

            // Conditional validation for Sell Stop Price
            if (data.side === "sell" && numericTriggerPrice < marketPrice) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: "For a Sell Stop order, Trigger Price must be greater than or equal to the current market price.",
                    path: ["triggerPrice"],
                });
            }
        }
    });
};

export type OrderFormValues = z.infer<ReturnType<typeof createOrderFormSchema>>;
