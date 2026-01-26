import { ASSET_PRECISION, DEFAULT_ASSET_PRECISION } from "@/constants/assetConfig";

/**
 * Retrieves the decimal precision for a given asset symbol.
 * Defaults to 2 if the asset is not found in ASSET_PRECISION.
 * @param assetSymbol The symbol of the asset (e.g., "BTC", "USDT").
 * @returns The decimal precision for the asset.
 */
export function getAssetPrecision(assetSymbol: string): number {
    return ASSET_PRECISION[assetSymbol.toUpperCase()] ?? DEFAULT_ASSET_PRECISION;
}

/**
 * Formats a numeric value to a specified decimal precision,
 * handling rounding and optional padding with zeros.
 * @param value The number to format.
 * @param precision The number of decimal places to format to.
 * @param padZeros Whether to pad with trailing zeros to match the precision.
 * @returns The formatted number as a string.
 */
export function formatWithPrecision(
    value: number | string,
    precision: number,
    padZeros: boolean = true
): string {
    if (value === null || value === undefined || isNaN(Number(value))) {
        return "";
    }

    const num = Number(value);

    // Round to the specified precision
    const multiplier = Math.pow(10, precision);
    const rounded = Math.round(num * multiplier) / multiplier;

    // Format with toFixed to handle padding
    let formatted = rounded.toFixed(precision);

    // If padZeros is false, remove trailing zeros if they are beyond the actual value
    if (!padZeros) {
        formatted = formatted.replace(/\.?0+$/, "");
    }

    return formatted;
}

/**
 * Custom hook to provide asset precision and formatting utilities for a given asset.
 * @param assetSymbol The symbol of the asset.
 * @returns An object containing the precision and a memoized format function.
 */
import React from "react";

export function useAssetPrecision(assetSymbol: string) {
    const precision = React.useMemo(() => getAssetPrecision(assetSymbol), [assetSymbol]);

    const format = React.useCallback(
        (value: number | string, padZeros: boolean = true) =>
            formatWithPrecision(value, precision, padZeros),
        [precision]
    );

    return { precision, format };
}