export interface P2POrder {
    id: string;
    advertisementId: string;
    buyerId: string;
    sellerId: string;
    asset: string; // e.g., "USDT"
    fiatCurrency: string; // e.g., "MNT"
    fiatAmount: number;
    cryptoAmount: number;
    price: number;
    status: 'Pending' | 'Paid' | 'Completed' | 'Dispute' | 'Cancelled';
    paymentMethod: string; // e.g., "Khan Bank"
    createdAt: string; // ISO date string
    paidAt?: string; // ISO date string
    completedAt?: string; // ISO date string
    disputeRaisedAt?: string; // ISO date string
    cancellationReason?: string;
}

export interface P2PAd {
    id: string;
    merchantId: string;
    type: 'BUY' | 'SELL'; // Buy or Sell ad
    asset: string; // e.g., "USDT"
    fiatCurrency: string; // e.g., "MNT"
    price: number;
    minLimit: number; // Minimum trade amount in fiat
    maxLimit: number; // Maximum trade amount in fiat
    availableAmount: number; // Available crypto amount for trade
    totalAmount: number; // Initial total crypto amount
    paymentMethods: string[]; // e.g., ["Khan Bank", "TDB"]
    terms: string; // Additional terms by merchant
    status: 'Active' | 'Inactive';
    priceType: 'Fixed' | 'Floating'; // Fixed price or floating based on market
    floatingRate?: number; // If floating, the rate above/below market price
    createdAt: string;
    updatedAt: string;
}

export interface MerchantInfo {
    id: string;
    userId: string;
    nickname: string;
    kycLevel: string; // e.g., "Level 2"
    isVerified: boolean;
    completedOrders: number;
    completionRate: number; // e.g., 0.98 for 98%
    averageReleaseTime: number; // in seconds
    collateralAmount: number; // USDT amount
    collateralCurrency: string; // e.g., "USDT"
    applicationStatus: 'Pending' | 'Approved' | 'Rejected';
    appliedAt: string;
    approvedAt?: string;
}