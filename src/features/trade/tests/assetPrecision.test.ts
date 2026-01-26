import { describe, it, expect } from "vitest";
import { getAssetPrecision, formatWithPrecision } from "../utils/assetPrecision";
import { ASSET_PRECISION, DEFAULT_ASSET_PRECISION } from "@/constants/assetConfig";

describe("Asset Precision Utility", () => {
    describe("getAssetPrecision", () => {
        it("should return correct precision for known assets", () => {
            expect(getAssetPrecision("BTC")).toBe(8);
            expect(getAssetPrecision("USDT")).toBe(2);
            expect(getAssetPrecision("ADA")).toBe(6);
        });

        it("should return default precision for unknown assets", () => {
            expect(getAssetPrecision("UNKNOWN")).toBe(DEFAULT_ASSET_PRECISION);
        });

        it("should be case-insensitive for asset symbols", () => {
            expect(getAssetPrecision("btc")).toBe(8);
            expect(getAssetPrecision("usdt")).toBe(2);
        });
    });

    describe("formatWithPrecision", () => {
        it("should format a number to the specified precision with padding", () => {
            expect(formatWithPrecision(123.456789, 2)).toBe("123.46");
            expect(formatWithPrecision(100, 4)).toBe("100.0000");
            expect(formatWithPrecision(0.1, 5)).toBe("0.10000");
            expect(formatWithPrecision(123.45, 8)).toBe("123.45000000");
        });

        it("should format a number to the specified precision without padding", () => {
            expect(formatWithPrecision(123.456789, 2, false)).toBe("123.46");
            expect(formatWithPrecision(100.0000, 4, false)).toBe("100");
            expect(formatWithPrecision(0.10000, 5, false)).toBe("0.1");
            expect(formatWithPrecision(123.45000000, 8, false)).toBe("123.45");
            expect(formatWithPrecision(1.23456, 3, false)).toBe("1.235");
        });

        it("should handle rounding correctly", () => {
            expect(formatWithPrecision(1.234, 2)).toBe("1.23");
            expect(formatWithPrecision(1.235, 2)).toBe("1.24");
            expect(formatWithPrecision(1.999, 2)).toBe("2.00");
        });

        it("should handle string inputs", () => {
            expect(formatWithPrecision("123.456", 2)).toBe("123.46");
            expect(formatWithPrecision("50", 3)).toBe("50.000");
        });

        it("should return empty string for null, undefined, or invalid number input", () => {
            expect(formatWithPrecision(null as any, 2)).toBe("");
            expect(formatWithPrecision(undefined as any, 2)).toBe("");
            expect(formatWithPrecision("abc", 2)).toBe("");
            expect(formatWithPrecision(NaN, 2)).toBe("");
        });
    });

    // The useAssetPrecision hook relies on React context and memoization,
    // making it generally more suitable for integration tests with React Testing Library.
    // However, its core logic is covered by the tests for getAssetPrecision and formatWithPrecision.
});