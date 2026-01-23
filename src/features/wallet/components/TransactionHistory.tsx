import React from 'react';
import { Card } from '@/components/ui/card';

// Define interfaces for different transaction types
interface WithdrawDepositTransaction {
    id: string;
    type: 'Withdraw' | 'Deposit';
    amount: number;
    tokenSymbol: string;
    timestamp: Date;
    address: string; // To Receive/Send address
}

interface TradeTransaction {
    id: string;
    type: 'Buy' | 'Sell';
    amount: number;
    tokenSymbol: string;
    timestamp: Date;
    // For trade, address might not be directly relevant, but could be for a specific counterparty or exchange wallet
}

type Transaction = WithdrawDepositTransaction | TradeTransaction;

interface TransactionHistoryProps {
    // We might pass a list of transactions here, or fetch them internally
}

// Utility function to format time
const formatTime = (date: Date): string => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 5) {
        return `${diffDays} days ago`;
    } else {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // getMonth() is 0-indexed
        const day = date.getDate();
        return `${year}.${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}`;
    }
};

const TransactionHistory: React.FC<TransactionHistoryProps> = () => {
    // Mock data for transactions
    const mockTransactions: Transaction[] = [
        { id: 'wd1', type: 'Withdraw', amount: 0.1, tokenSymbol: 'BTC', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), address: '0xabc123def456' }, // 3 days ago
        { id: 'dp1', type: 'Deposit', amount: 2.5, tokenSymbol: 'ETH', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), address: '0xghi789jkl012' }, // 1 day ago
        { id: 'trade1', type: 'Buy', amount: 500, tokenSymbol: 'XRP', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }, // 7 days ago
        { id: 'wd2', type: 'Withdraw', amount: 10, tokenSymbol: 'LTC', timestamp: new Date('2025-12-20T10:00:00Z'), address: '0xmnopqrs34567' }, // Older transaction
        { id: 'trade2', type: 'Sell', amount: 0.05, tokenSymbol: 'BTC', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }, // 2 days ago
        { id: 'dp2', type: 'Deposit', amount: 0.8, tokenSymbol: 'BTC', timestamp: new Date('2025-11-15T14:30:00Z'), address: '0xtuvwxys89012' }, // Older transaction
    ];

    return (
        <Card className="bg-secondary-700 border border-secondary-600 p-4">
            {mockTransactions.length === 0 ? (
                <p className="text-center text-gray-500">No transaction history.</p>
            ) : (
                <div className="space-y-4">
                    {mockTransactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm">
                            <div>
                                <p className="text-base font-semibold text-gray-900 dark:text-white">
                                    {tx.type === 'Withdraw' ? 'Withdraw' :
                                        tx.type === 'Deposit' ? 'Add' :
                                            tx.type === 'Buy' ? 'Buy' : 'Sell'}{' '}
                                    {tx.amount.toFixed(tx.tokenSymbol === 'BTC' || tx.tokenSymbol === 'ETH' ? 8 : 2)}{' '}
                                    {tx.tokenSymbol}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {formatTime(tx.timestamp)}
                                    {'address' in tx && ` to/from: ${tx.address.substring(0, 6)}...${tx.address.substring(tx.address.length - 4)}`}
                                </p>
                            </div>
                            {/* You could add more details here if needed, like a status icon */}
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default TransactionHistory;
