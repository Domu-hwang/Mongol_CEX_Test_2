import { P2PAd, P2POrder, MerchantInfo } from '../types';

// Mock API functions for P2P features
const p2pApi = {
    // Ads
    getAds: async (type: 'BUY' | 'SELL', filters?: any): Promise<P2PAd[]> => {
        console.log('Fetching P2P ads:', type, filters);
        // Simulate API call
        return Promise.resolve([]);
    },
    createAd: async (adData: Omit<P2PAd, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<P2PAd> => {
        console.log('Creating P2P ad:', adData);
        // Simulate API call
        return Promise.resolve({
            id: 'mock-ad-123',
            status: 'Active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...adData,
        });
    },
    updateAd: async (adId: string, updates: Partial<P2PAd>): Promise<P2PAd> => {
        console.log('Updating P2P ad:', adId, updates);
        // Simulate API call
        return Promise.resolve({} as P2PAd); // Return updated ad
    },
    deleteAd: async (adId: string): Promise<void> => {
        console.log('Deleting P2P ad:', adId);
        // Simulate API call
        return Promise.resolve();
    },

    // Orders
    createOrder: async (orderData: Omit<P2POrder, 'id' | 'status' | 'createdAt'>): Promise<P2POrder> => {
        console.log('Creating P2P order:', orderData);
        // Simulate API call
        return Promise.resolve({
            id: 'mock-order-123',
            status: 'Pending',
            createdAt: new Date().toISOString(),
            ...orderData,
        });
    },
    getOrder: async (orderId: string): Promise<P2POrder> => {
        console.log('Fetching P2P order:', orderId);
        // Simulate API call
        return Promise.resolve({} as P2POrder); // Return order details
    },
    updateOrderStatus: async (orderId: string, status: P2POrder['status']): Promise<P2POrder> => {
        console.log('Updating P2P order status:', orderId, status);
        // Simulate API call
        return Promise.resolve({} as P2POrder); // Return updated order
    },

    // Merchant
    getMerchantInfo: async (userId: string): Promise<MerchantInfo> => {
        console.log('Fetching merchant info for user:', userId);
        // Simulate API call
        return Promise.resolve({} as MerchantInfo); // Return merchant info
    },
    applyForMerchant: async (applicationData: Omit<MerchantInfo, 'id' | 'isVerified' | 'completedOrders' | 'completionRate' | 'averageReleaseTime' | 'collateralAmount' | 'collateralCurrency' | 'applicationStatus' | 'appliedAt' | 'approvedAt'>): Promise<MerchantInfo> => {
        console.log('Applying for merchant:', applicationData);
        // Simulate API call
        return Promise.resolve({} as MerchantInfo); // Return new merchant application
    },

    // Escrow (Lock-up)
    lockCryptoForAd: async (adId: string, amount: number, asset: string): Promise<boolean> => {
        console.log(`Locking ${amount} ${asset} for ad ${adId}`);
        // Simulate API call
        return Promise.resolve(true); // Indicate success
    },
    releaseCryptoFromEscrow: async (orderId: string): Promise<boolean> => {
        console.log(`Releasing crypto for order ${orderId}`);
        // Simulate API call
        return Promise.resolve(true); // Indicate success
    },
    returnCryptoFromEscrow: async (orderId: string): Promise<boolean> => {
        console.log(`Returning crypto from escrow for order ${orderId}`);
        // Simulate API call
        return Promise.resolve(true); // Indicate success
    },
};

export default p2pApi;