export interface NetworkPolicy {
    network: string;
    networkFullName: string;
    fee: number;
    minDeposit: number;
    minWithdraw: number;
    depositAddress: string;
    description: string;
    warnings: string[];
    confirmations: number;
    transactionTime: string;
    confirmationsPerHour: number;
    isActive: boolean;
}

export interface CryptoPolicy {
    [key: string]: {
        name: string;
        symbol: string;
        icon: string;
        precision: number;
        supportedNetworks: NetworkPolicy[];
    };
}

export const CRYPTO_POLICIES: CryptoPolicy = {
    USDT: {
        name: 'Tether',
        symbol: 'USDT',
        icon: 'https://cryptologos.cc/logos/tether-usdt-logo.png?v=026',
        precision: 2,
        supportedNetworks: [
            {
                network: 'ERC20',
                networkFullName: 'Ethereum (ERC20)',
                fee: 5,
                minDeposit: 10,
                minWithdraw: 20,
                depositAddress: '0x1234567890abcdef1234567890abcdef12345678',
                description: 'Ethereum network. Higher fees but widely supported.',
                warnings: [
                    'Send only USDT to this address.',
                    'Minimum deposit is 10 USDT.',
                    'Deposits below minimum will not be credited.',
                ],
                confirmations: 12,
                transactionTime: '5-15 minutes',
                confirmationsPerHour: 60,
                isActive: true,
            },
            {
                network: 'TRC20',
                networkFullName: 'Tron (TRC20)',
                fee: 1,
                minDeposit: 5,
                minWithdraw: 10,
                depositAddress: 'TLa2f6VPqDgRE67v1736s7bJ8Ray5wYjU7',
                description: 'Tron network. Low fees and fast transactions.',
                warnings: [
                    'Send only USDT-TRC20 to this address.',
                    'Minimum deposit is 5 USDT.',
                    'ERC20 tokens sent here will be lost.',
                ],
                confirmations: 20,
                transactionTime: '1-3 minutes',
                confirmationsPerHour: 300,
                isActive: true,
            },
            {
                network: 'BEP20',
                networkFullName: 'BNB Smart Chain (BEP20)',
                fee: 0.5,
                minDeposit: 5,
                minWithdraw: 10,
                depositAddress: '0xabcde12345fghij67890klmno12345pqrst67890',
                description: 'BSC network. Very low fees and fast confirmation.',
                warnings: [
                    'Send only USDT-BEP20 to this address.',
                    'Minimum deposit is 5 USDT.',
                    'ERC20 tokens sent here will be lost.',
                ],
                confirmations: 15,
                transactionTime: '1-5 minutes',
                confirmationsPerHour: 100,
                isActive: true,
            },
        ],
    },
    BTC: {
        name: 'Bitcoin',
        symbol: 'BTC',
        icon: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026',
        precision: 8,
        supportedNetworks: [
            {
                network: 'Bitcoin',
                networkFullName: 'Bitcoin Network',
                fee: 0.0005,
                minDeposit: 0.0001,
                minWithdraw: 0.001,
                depositAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                description: 'Native Bitcoin network. Secure and decentralized.',
                warnings: [
                    'Send only BTC to this address.',
                    'Minimum deposit is 0.0001 BTC.',
                    'Other cryptocurrencies sent here will be lost.',
                ],
                confirmations: 3,
                transactionTime: '30-60 minutes',
                confirmationsPerHour: 1,
                isActive: true,
            },
        ],
    },
    ETH: {
        name: 'Ethereum',
        symbol: 'ETH',
        icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=026',
        precision: 8,
        supportedNetworks: [
            {
                network: 'ERC20',
                networkFullName: 'Ethereum Network',
                fee: 0.005,
                minDeposit: 0.01,
                minWithdraw: 0.02,
                depositAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
                description: 'Ethereum mainnet. Send only ETH.',
                warnings: [
                    'Send only ETH to this address.',
                    'Minimum deposit is 0.01 ETH.',
                    'ERC20 tokens should use the USDT deposit option.',
                ],
                confirmations: 12,
                transactionTime: '5-15 minutes',
                confirmationsPerHour: 60,
                isActive: true,
            },
        ],
    },
    XRP: {
        name: 'Ripple',
        symbol: 'XRP',
        icon: 'https://cryptologos.cc/logos/xrp-xrp-logo.png?v=026',
        precision: 6,
        supportedNetworks: [
            {
                network: 'XRP',
                networkFullName: 'XRP Ledger',
                fee: 0.25,
                minDeposit: 10,
                minWithdraw: 20,
                depositAddress: 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh',
                description: 'XRP Ledger. Fast and low cost transactions.',
                warnings: [
                    'Send only XRP to this address.',
                    'Destination tag may be required.',
                    'Minimum deposit is 10 XRP.',
                ],
                confirmations: 1,
                transactionTime: '3-5 seconds',
                confirmationsPerHour: 1500,
                isActive: true,
            },
        ],
    },
    LTC: {
        name: 'Litecoin',
        symbol: 'LTC',
        icon: 'https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=026',
        precision: 8,
        supportedNetworks: [
            {
                network: 'Litecoin',
                networkFullName: 'Litecoin Network',
                fee: 0.001,
                minDeposit: 0.01,
                minWithdraw: 0.02,
                depositAddress: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
                description: 'Litecoin network. Fast block times.',
                warnings: [
                    'Send only LTC to this address.',
                    'Minimum deposit is 0.01 LTC.',
                    'Other cryptocurrencies sent here will be lost.',
                ],
                confirmations: 6,
                transactionTime: '15-30 minutes',
                confirmationsPerHour: 20,
                isActive: true,
            },
        ],
    },
};

// Helper functions
export const getSupportedCurrencies = (): string[] => {
    return Object.keys(CRYPTO_POLICIES);
};

export const getNetworksForCurrency = (currency: string): NetworkPolicy[] => {
    return CRYPTO_POLICIES[currency]?.supportedNetworks || [];
};

export const getNetworkPolicy = (currency: string, network: string): NetworkPolicy | undefined => {
    const networks = getNetworksForCurrency(currency);
    return networks.find((n) => n.network === network);
};

export const getCurrencyInfo = (currency: string) => {
    return CRYPTO_POLICIES[currency];
};

export const formatAmount = (amount: number, currency: string): string => {
    const precision = CRYPTO_POLICIES[currency]?.precision || 2;
    return amount.toFixed(precision);
};
