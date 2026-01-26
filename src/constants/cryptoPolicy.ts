export interface NetworkPolicy {
    network: string;
    fee: number;
    minDeposit: number;
    minWithdraw: number;
    depositAddress: string;
    description: string;
    warnings: string[];
}

export interface CryptoPolicy {
    [key: string]: {
        supportedNetworks: NetworkPolicy[];
    };
}

export const CRYPTO_POLICIES: CryptoPolicy = {
    USDT: {
        supportedNetworks: [
            {
                network: 'ERC20',
                fee: 5,
                minDeposit: 10,
                minWithdraw: 20,
                depositAddress: '0x1234567890abcdef1234567890abcdef12345678',
                description: 'ERC20 network for USDT. Ensure your wallet supports ERC20.',
                warnings: ["Don't send NFT to this address. It may result in permanent loss.", "Minimum deposit is 10 USDT."],
            },
            {
                network: 'TRC20',
                fee: 1,
                minDeposit: 5,
                minWithdraw: 10,
                depositAddress: 'T1234567890abcdef1234567890abcdef12345678',
                description: 'TRC20 network for USDT. Ensure your wallet supports TRC20.',
                warnings: ["Don't send NFT to this address. It may result in permanent loss.", "Minimum deposit is 5 USDT."],
            },
            {
                network: 'BEP20',
                fee: 0.5,
                minDeposit: 5,
                minWithdraw: 10,
                depositAddress: '0xabcde12345fghij67890klmno12345pqrst67890',
                description: 'BEP20 (BSC) network for USDT. Ensure your wallet supports BEP20.',
                warnings: ["Don't send NFT to this address. It may result in permanent loss.", "Minimum deposit is 5 USDT."],
            },
        ],
    },
    BTC: {
        supportedNetworks: [
            {
                network: 'Bitcoin',
                fee: 0.0005,
                minDeposit: 0.0001,
                minWithdraw: 0.0002,
                depositAddress: 'bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
                description: 'Bitcoin network. Send only BTC to this address.',
                warnings: ["Don't send any other cryptocurrency to this address.", "Minimum deposit is 0.0001 BTC."],
            },
        ],
    },
    ETH: {
        supportedNetworks: [
            {
                network: 'ERC20',
                fee: 0.005,
                minDeposit: 0.01,
                minWithdraw: 0.02,
                depositAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
                description: 'Ethereum ERC20 network. Send only ETH to this address.',
                warnings: ["Don't send any other cryptocurrency to this address.", "Minimum deposit is 0.01 ETH."],
            },
        ],
    },
};