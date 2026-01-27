import { useState, useCallback, useMemo } from 'react';
import {
    NetworkPolicy,
    getNetworksForCurrency,
    getNetworkPolicy,
    getCurrencyInfo,
    getSupportedCurrencies,
} from '@/constants/cryptoPolicy';

export type TransactionType = 'deposit' | 'withdraw';

export interface ValidationError {
    field: string;
    message: string;
}

export interface TransactionState {
    currency: string;
    network: string | null;
    amount: string;
    address: string;
    errors: ValidationError[];
    isValid: boolean;
}

interface UseTransactionOptions {
    type: TransactionType;
    availableBalance?: number;
}

export const useTransaction = ({ type, availableBalance = 0 }: UseTransactionOptions) => {
    const [currency, setCurrency] = useState<string>(getSupportedCurrencies()[0] || 'USDT');
    const [network, setNetwork] = useState<string | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [address, setAddress] = useState<string>('');

    // Get networks for current currency
    const networks = useMemo(() => getNetworksForCurrency(currency), [currency]);

    // Get current network policy
    const networkPolicy = useMemo(
        () => (network ? getNetworkPolicy(currency, network) : null),
        [currency, network]
    );

    // Get currency info
    const currencyInfo = useMemo(() => getCurrencyInfo(currency), [currency]);

    // Calculate fee
    const fee = useMemo(() => networkPolicy?.fee ?? 0, [networkPolicy]);

    // Calculate receive amount (for withdrawals)
    const receiveAmount = useMemo(() => {
        const numAmount = parseFloat(amount) || 0;
        if (type === 'withdraw' && numAmount > 0) {
            return Math.max(0, numAmount - fee);
        }
        return numAmount;
    }, [amount, fee, type]);

    // Calculate max withdrawable amount
    const maxWithdrawAmount = useMemo(() => {
        if (type === 'withdraw') {
            return Math.max(0, availableBalance - fee);
        }
        return availableBalance;
    }, [availableBalance, fee, type]);

    // Validation
    const errors = useMemo(() => {
        const validationErrors: ValidationError[] = [];
        const numAmount = parseFloat(amount) || 0;

        if (!network && networks.length > 0) {
            validationErrors.push({
                field: 'network',
                message: 'Please select a network',
            });
        }

        if (type === 'withdraw') {
            // Withdraw-specific validations
            if (amount && numAmount <= 0) {
                validationErrors.push({
                    field: 'amount',
                    message: 'Amount must be greater than 0',
                });
            }

            if (networkPolicy && numAmount > 0 && numAmount < networkPolicy.minWithdraw) {
                validationErrors.push({
                    field: 'amount',
                    message: `Minimum withdrawal is ${networkPolicy.minWithdraw} ${currency}`,
                });
            }

            if (numAmount > availableBalance) {
                validationErrors.push({
                    field: 'amount',
                    message: `Insufficient balance. Available: ${availableBalance} ${currency}`,
                });
            }

            if (networkPolicy && numAmount > 0 && fee >= numAmount) {
                validationErrors.push({
                    field: 'amount',
                    message: `Amount must be greater than fee (${fee} ${currency})`,
                });
            }

            if (!address.trim()) {
                validationErrors.push({
                    field: 'address',
                    message: 'Withdrawal address is required',
                });
            } else if (address.length < 20) {
                validationErrors.push({
                    field: 'address',
                    message: 'Please enter a valid wallet address',
                });
            }
        } else {
            // Deposit-specific validations
            if (networkPolicy && numAmount > 0 && numAmount < networkPolicy.minDeposit) {
                validationErrors.push({
                    field: 'amount',
                    message: `Minimum deposit is ${networkPolicy.minDeposit} ${currency}`,
                });
            }
        }

        return validationErrors;
    }, [amount, network, networks, networkPolicy, currency, type, availableBalance, address, fee]);

    // Check if form is valid
    const isValid = useMemo(() => {
        if (!network) return false;
        if (type === 'withdraw') {
            const numAmount = parseFloat(amount) || 0;
            return errors.length === 0 && numAmount > 0 && address.trim().length > 0;
        }
        return errors.length === 0;
    }, [errors, network, type, amount, address]);

    // Get error for specific field
    const getFieldError = useCallback(
        (field: string): string | undefined => {
            return errors.find((e) => e.field === field)?.message;
        },
        [errors]
    );

    // Handle currency change
    const handleCurrencyChange = useCallback((newCurrency: string) => {
        setCurrency(newCurrency);
        setNetwork(null); // Reset network when currency changes
        setAmount('');
    }, []);

    // Handle network change
    const handleNetworkChange = useCallback((newNetwork: string) => {
        setNetwork(newNetwork);
    }, []);

    // Handle amount change
    const handleAmountChange = useCallback((newAmount: string) => {
        // Only allow valid numeric input
        const sanitized = newAmount.replace(/[^0-9.]/g, '');
        // Prevent multiple decimal points
        const parts = sanitized.split('.');
        if (parts.length > 2) return;
        setAmount(sanitized);
    }, []);

    // Handle max button click
    const handleMaxClick = useCallback(() => {
        if (type === 'withdraw' && availableBalance > 0) {
            const precision = currencyInfo?.precision ?? 8;
            // Set max amount (total available - fee, or just total if fee is larger)
            const maxAmount = Math.max(0, availableBalance);
            setAmount(maxAmount.toFixed(precision));
        }
    }, [type, availableBalance, currencyInfo]);

    // Handle address change
    const handleAddressChange = useCallback((newAddress: string) => {
        setAddress(newAddress);
    }, []);

    // Reset form
    const reset = useCallback(() => {
        setNetwork(null);
        setAmount('');
        setAddress('');
    }, []);

    return {
        // State
        currency,
        network,
        amount,
        address,
        errors,
        isValid,

        // Computed values
        networks,
        networkPolicy,
        currencyInfo,
        fee,
        receiveAmount,
        maxWithdrawAmount,

        // Handlers
        setCurrency: handleCurrencyChange,
        setNetwork: handleNetworkChange,
        setAmount: handleAmountChange,
        setAddress: handleAddressChange,
        handleMaxClick,
        getFieldError,
        reset,
    };
};
