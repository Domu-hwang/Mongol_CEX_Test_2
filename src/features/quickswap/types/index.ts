export interface QuickSwapAsset {
    fromAsset: string;
    toAsset: string;
    minAmount: string;
    maxAmount: string;
}

export interface QuickSwapQuote {
    quoteId: string;
    fromAsset: string;
    toAsset: string;
    fromAmount: string;
    toAmount: string;
    rate: string;
    spread: string;
    expiresAt: string;
}

export interface QuickSwapHistoryItem {
    transactionId: string;
    fromAsset: string;
    toAsset: string;
    fromAmount: string;
    toAmount: string;
    timestamp: string;
}
