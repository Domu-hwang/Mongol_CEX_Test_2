import { useMemo } from "react";

interface UseOrderTotalEstimationProps {
    orderType: "limit" | "market" | "stop";
    price: string | number | undefined;
    amount: string | number | undefined;
    marketPrice: number; // Current market price for the trading pair
}

/**
 * Custom hook to calculate the estimated total for an order in real-time.
 * Handles different order types (Limit, Market, Stop) and provides graceful
 * handling for invalid price/amount inputs.
 * @param {UseOrderTotalEstimationProps} props The properties for total calculation.
 * @returns {string} The formatted total amount, or "0.00" if invalid.
 */
export const useOrderTotalEstimation = ({
    orderType,
    price,
    amount,
    marketPrice,
}: UseOrderTotalEstimationProps): string => {
    const total = useMemo(() => {
        const numericAmount = parseFloat(amount as string) || 0;
        let effectivePrice = 0;

        if (orderType === "market") {
            effectivePrice = marketPrice;
        } else if (orderType === "limit" || orderType === "stop") {
            effectivePrice = parseFloat(price as string) || 0;
        }

        if (numericAmount <= 0 || effectivePrice <= 0) {
            return "0.00";
        }

        const calculatedTotal = numericAmount * effectivePrice;
        return calculatedTotal.toFixed(2); // Assuming 2 decimal places for total
    }, [orderType, price, amount, marketPrice]);

    return total;
};