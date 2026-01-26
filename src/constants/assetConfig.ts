export const ASSET_PRECISION: Record<string, number> = {
    BTC: 8,
    ETH: 8,
    USDT: 2,
    BNB: 8,
    XRP: 6,
    ADA: 6,
    SOL: 6,
    DOGE: 8,
    DOT: 6,
    LTC: 8,
    // Add more assets and their precisions as needed
};

export const DEFAULT_ASSET_PRECISION = 2; // Default to 2 decimal places for fiat-like assets