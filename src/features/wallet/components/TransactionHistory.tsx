import React from 'react';
import { ArrowUpRight, ArrowDownLeft, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

type Transaction = WithdrawDepositTransaction | TradeTransaction;

interface TransactionHistoryProps {
    typeFilter?: 'Deposit' | 'Withdraw' | 'Trade'; // New prop for filtering
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
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${year}.${month < 10 ? '0' + month : month}.${day < 10 ? '0' + day : day}`;
    }
};

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ typeFilter }) => {
    // Mock data for transactions
    const mockTransactions: Transaction[] = [
        { id: 'wd1', type: 'Withdraw', amount: 0.1, tokenSymbol: 'BTC', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), address: '0xabc123def456' },
        { id: 'dp1', type: 'Deposit', amount: 2.5, tokenSymbol: 'ETH', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), address: '0xghi789jkl012' },
        { id: 'trade1', type: 'Buy', amount: 500, tokenSymbol: 'XRP', timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        { id: 'wd2', type: 'Withdraw', amount: 10, tokenSymbol: 'LTC', timestamp: new Date('2025-12-20T10:00:00Z'), address: '0xmnopqrs34567' },
        { id: 'trade2', type: 'Sell', amount: 0.05, tokenSymbol: 'BTC', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
        { id: 'dp2', type: 'Deposit', amount: 0.8, tokenSymbol: 'BTC', timestamp: new Date('2025-11-15T14:30:00Z'), address: '0xtuvwxys89012' },
    ];

    const filteredTransactions = typeFilter
        ? mockTransactions.filter(tx => tx.type === typeFilter || (typeFilter === 'Trade' && (tx.type === 'Buy' || tx.type === 'Sell')))
        : mockTransactions;

    return (
        <div
            className="flex flex-col items-start p-5 gap-2.5 w-full bg-[#0D0D0D] border border-[#6F7178] rounded-xl"
            style={{ isolation: 'isolate' }}
        >
            {filteredTransactions.length === 0 ? (
                <p className="text-center text-muted-foreground w-full py-4">No transaction history.</p>
            ) : (
                <div className="flex flex-col gap-2.5 w-full">
                    {filteredTransactions
                        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                        .map((tx) => {
                            const getIcon = () => {
                                switch (tx.type) {
                                    case 'Withdraw':
                                        return <ArrowUpRight className="h-5 w-5 text-destructive" />;
                                    case 'Deposit':
                                        return <ArrowDownLeft className="h-5 w-5 text-success" />;
                                    case 'Buy':
                                        return <TrendingUp className="h-5 w-5 text-success" />;
                                    case 'Sell':
                                        return <TrendingDown className="h-5 w-5 text-destructive" />;
                                }
                            };

                            const getIconBgColor = () => {
                                switch (tx.type) {
                                    case 'Withdraw':
                                    case 'Sell':
                                        return 'bg-destructive/10';
                                    case 'Deposit':
                                    case 'Buy':
                                        return 'bg-success/10';
                                }
                            };

                            return (
                                <div
                                    key={tx.id}
                                    className="flex items-center gap-3 py-2 border-b border-[#6F7178]/30 last:border-b-0"
                                >
                                    {/* Icon */}
                                    <div className={cn(
                                        "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                                        getIconBgColor()
                                    )}>
                                        {getIcon()}
                                    </div>

                                    {/* Transaction Info */}
                                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                                        <p className="text-sm font-medium text-foreground">
                                            {tx.type === 'Withdraw' ? 'Withdraw' :
                                                tx.type === 'Deposit' ? 'Deposit' :
                                                    tx.type === 'Buy' ? 'Buy' : 'Sell'}{' '}
                                            <span className="text-primary">
                                                {tx.amount.toFixed(tx.tokenSymbol === 'BTC' || tx.tokenSymbol === 'ETH' ? 8 : 2)}{' '}
                                                {tx.tokenSymbol}
                                            </span>
                                        </p>
                                        {'address' in tx ? (
                                            <p className="text-xs text-muted-foreground">
                                                {tx.type === 'Withdraw' ? 'To' : 'From'}: {tx.address.substring(0, 6)}...{tx.address.substring(tx.address.length - 4)}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground">
                                                to Spot wallet
                                            </p>
                                        )}
                                    </div>

                                    {/* Timestamp */}
                                    <div className="text-xs text-muted-foreground shrink-0">
                                        {formatTime(tx.timestamp)}
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
};

export default TransactionHistory;
