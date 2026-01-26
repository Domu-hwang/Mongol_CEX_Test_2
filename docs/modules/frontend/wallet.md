# Wallet Module (Frontend)

## 1. Overview

The Wallet module handles **asset management and transactions** for users, including balance display, deposits, and withdrawal requests. It serves as the **Wallet Dashboard**.

**Purpose:**
- Display user's asset balances (available and locked)
- Handle deposit flow (address display for Pilot)
- Process withdrawal requests
- Show transaction history

**URL**: `/account/wallet`
**화면명**: 지갑 대시보드

**Scope:**
- ✅ Balance overview with USD valuation
- ✅ Deposit address display (simulated for Pilot)
- ✅ Withdrawal request submission
- ✅ Transaction history
- ❌ Real blockchain integration (Pilot uses simulated/admin-managed)
- ❌ Fiat on/off ramp
- ❌ Internal transfers between users

---

## 2. Responsibilities

### What This Module Does
- Fetch and display user balances (all assets)
- Show total portfolio value in USD
- Generate/display deposit addresses
- Submit withdrawal requests
- Display deposit and withdrawal history
- Show all transaction types (deposits, withdrawals, trades)

### What This Module Does NOT Do
- Execute blockchain transactions (backend responsibility)
- Approve withdrawals (see `admin` module)
- Trade execution (see `trade` module)
- KYC verification (future feature)

---

## 3. Structure

```
src/features/wallet/
├── components/
│   ├── WalletView.tsx                # Main wallet interface
│   ├── BalanceOverview.tsx           # Total portfolio value
│   ├── AssetList.tsx                 # List of all assets
│   ├── AssetCard.tsx                 # Single asset display
│   ├── DepositModal.tsx              # Deposit flow
│   ├── DepositAddressDisplay.tsx     # QR code + address
│   ├── DepositHistory.tsx            # Deposit history list
│   ├── WithdrawModal.tsx             # Withdrawal form
│   ├── WithdrawConfirmModal.tsx      # Withdrawal confirmation
│   ├── WithdrawalHistory.tsx         # Withdrawal history list
│   ├── TransactionHistory.tsx        # All transactions
│   ├── TransactionCard.tsx           # Single transaction display
│   └── __tests__/
│       ├── AssetCard.test.tsx
│       ├── WithdrawModal.test.tsx
│       └── WalletView.test.tsx
│
├── hooks/
│   ├── useBalances.ts                # Fetch user balances
│   ├── useDeposit.ts                 # Deposit management
│   ├── useWithdraw.ts                # Withdrawal mutation
│   ├── useTransactionHistory.ts      # Transaction history
│   └── usePortfolioValue.ts          # Calculate total USD value
│
├── services/
│   └── walletService.ts              # Wallet API calls
│
├── types/
│   └── index.ts                      # TypeScript types
│
└── index.ts                          # Public exports
```

---

## 4. API / Interface

### Public Exports

```typescript
// index.ts
export { WalletView, DepositModal, WithdrawModal } from './components';
export { useBalances, useWithdraw, useTransactionHistory } from './hooks';
export type { Balance, Deposit, Withdrawal, Transaction } from './types';
```

### Components

#### WalletView

```typescript
export function WalletView()
```

Main wallet interface (Dashboard) showing balances and transaction history.
**URL**: `/account/wallet`
**화면명**: 지갑 대시보드

**Layout (Mobile):**
```
┌─────────────────────────────┐
│  Total Portfolio Value      │
│  $12,345.67                 │
│  +$234.56 (+1.9%)          │
├─────────────────────────────┤
│  BTC                        │
│  Available: 0.5 BTC         │
│  Locked: 0.1 BTC           │
│  Value: $22,500             │
│  [Deposit] [Withdraw] [Trade]
├─────────────────────────────┤
│  USDT                       │
│  Available: 5,000 USDT     │
│  Locked: 0 USDT            │
│  Value: $5,000              │
│  [Deposit] [Withdraw] [Trade]
├─────────────────────────────┤
│  Tabs: All | Deposits |     │
│         Withdrawals          │
└─────────────────────────────┘
```

#### DepositModal

```typescript
interface DepositModalProps {
  asset: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ asset, isOpen, onClose }: DepositModalProps)
```

Displays deposit instructions with address and QR code.

#### WithdrawModal

```typescript
interface WithdrawModalProps {
  asset: string;
  availableBalance: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WithdrawModal({
  asset,
  availableBalance,
  isOpen,
  onClose,
  onSuccess
}: WithdrawModalProps)
```

Withdrawal form with amount and destination address input.

### Hooks

#### useBalances

```typescript
interface UseBalancesReturn {
  balances: Balance[];
  totalValue: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useBalances(userId: string): UseBalancesReturn
```

**Usage:**
```typescript
function BalanceDisplay() {
  const { user } = useAuth();
  const { balances, totalValue, isLoading } = useBalances(user!.id);
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <h2>Total: ${totalValue.toLocaleString()}</h2>
      {balances.map(balance => (
        <AssetCard key={balance.asset} balance={balance} />
      ))}
    </div>
  );
}
```

#### useWithdraw

```typescript
interface UseWithdrawReturn {
  mutate: (data: WithdrawRequest) => void;
  mutateAsync: (data: WithdrawRequest) => Promise<Withdrawal>;
  isLoading: boolean;
  error: Error | null;
}

export function useWithdraw(): UseWithdrawReturn
```

---

## 5. Dependencies

### External Dependencies
- `react` - Core React
- `@tanstack/react-query` - Data fetching
- `qrcode.react` - QR code generation
- `zod` - Form validation
- `react-hot-toast` - Notifications

### Internal Dependencies
- `@/features/auth` - User authentication
- `@/core/api` - HTTP client
- `@/shared/components` - UI components

---

## 6. Data Models

### TypeScript Types

```typescript
// types/index.ts

export interface Balance {
  asset: string;           // 'BTC', 'USDT', etc.
  available: number;       // Available for trading/withdrawal
  locked: number;          // Locked in orders or pending withdrawals
  valueUSD: number;        // Current USD value
}

export interface Deposit {
  id: string;
  userId: string;
  asset: string;
  amount: number;
  address: string;
  txHash?: string;         // Transaction hash (optional for pilot)
  confirmations: number;
  requiredConfirmations: number;
  status: 'pending' | 'confirming' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  asset: string;
  amount: number;
  destinationAddress: string;
  networkFee: number;
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected';
  rejectionReason?: string;
  txHash?: string;
  createdAt: string;
  completedAt?: string;
}

export interface WithdrawRequest {
  asset: string;
  amount: number;
  destinationAddress: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'trade';
  asset: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
}
```

### API Contracts

**Get Balances:**
```typescript
GET /api/wallet/balances
Response: Balance[]
```

**Get Deposit Address:**
```typescript
GET /api/wallet/deposit/:asset
Response: { address: string, network: string }
```

**Get Deposits:**
```typescript
GET /api/wallet/deposits
Response: Deposit[]
```

**Request Withdrawal:**
```typescript
POST /api/wallet/withdraw
Request: WithdrawRequest
Response: Withdrawal
```

**Get Withdrawals:**
```typescript
GET /api/wallet/withdrawals
Response: Withdrawal[]
```

**Get Transactions:**
```typescript
GET /api/wallet/transactions
Response: Transaction[]
```

---

## 7. Implementation Examples

### WalletView Implementation

```typescript
// components/WalletView.tsx
import { useState } from 'react';
import { useAuth } from '@/features/auth';
import { useBalances } from '../hooks/useBalances';
import { BalanceOverview } from './BalanceOverview';
import { AssetList } from './AssetList';
import { TransactionHistory } from './TransactionHistory';
import { DepositModal } from './DepositModal';
import { WithdrawModal } from './WithdrawModal';

export function WalletView() {
  const { user } = useAuth();
  const { balances, totalValue, isLoading } = useBalances(user!.id);
  
  const [depositModal, setDepositModal] = useState<{
    isOpen: boolean;
    asset: string;
  }>({ isOpen: false, asset: '' });
  
  const [withdrawModal, setWithdrawModal] = useState<{
    isOpen: boolean;
    asset: string;
    balance: number;
  }>({ isOpen: false, asset: '', balance: 0 });

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {/* Portfolio overview */}
      <BalanceOverview totalValue={totalValue} balances={balances} />

      {/* Asset list */}
      <AssetList
        balances={balances}
        onDeposit={(asset) => setDepositModal({ isOpen: true, asset })}
        onWithdraw={(asset, balance) =>
          setWithdrawModal({ isOpen: true, asset, balance })
        }
      />

      {/* Transaction history */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Transaction History</h2>
        <TransactionHistory />
      </div>

      {/* Modals */}
      <DepositModal
        asset={depositModal.asset}
        isOpen={depositModal.isOpen}
        onClose={() => setDepositModal({ isOpen: false, asset: '' })}
      />

      <WithdrawModal
        asset={withdrawModal.asset}
        availableBalance={withdrawModal.balance}
        isOpen={withdrawModal.isOpen}
        onClose={() => setWithdrawModal({ isOpen: false, asset: '', balance: 0 })}
      />
    </div>
  );
}
```

### DepositModal Implementation

```typescript
// components/DepositModal.tsx
import { useQuery } from '@tanstack/react-query';
import { QRCodeSVG } from 'qrcode.react';
import { Modal } from '@/shared/components/Modal';
import { Button } from '@/shared/components/Button';
import { walletService } from '../services/walletService';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface DepositModalProps {
  asset: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ asset, isOpen, onClose }: DepositModalProps) {
  const [copied, setCopied] = useState(false);

  const { data: depositInfo } = useQuery({
    queryKey: ['depositAddress', asset],
    queryFn: () => walletService.getDepositAddress(asset),
    enabled: isOpen && !!asset,
  });

  const handleCopy = () => {
    if (depositInfo?.address) {
      navigator.clipboard.writeText(depositInfo.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!depositInfo) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Deposit ${asset}`}>
      <div className="space-y-6">
        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-sm text-yellow-800">
            <strong>Important:</strong> Send only {asset} to this address.
            Sending other coins may result in permanent loss.
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
            <QRCodeSVG value={depositInfo.address} size={200} />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Deposit Address
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={depositInfo.address}
              readOnly
              className="flex-1 px-4 py-2 border rounded bg-gray-50 text-sm font-mono"
            />
            <Button
              variant="secondary"
              onClick={handleCopy}
              className="px-4"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </Button>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Minimum deposit: 0.001 {asset}</p>
          <p>• Confirmations required: 3</p>
          <p>• Estimated arrival time: ~30 minutes</p>
        </div>

        {/* Pilot notice */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-800">
            <strong>Pilot Mode:</strong> For testing purposes, deposits may be
            manually credited by administrators. Contact support for assistance.
          </p>
        </div>

        {/* Close button */}
        <Button variant="primary" onClick={onClose} className="w-full">
          Done
        </Button>
      </div>
    </Modal>
  );
}
```

### WithdrawModal Implementation

```typescript
// components/WithdrawModal.tsx
import { useState } from 'react';
import { z } from 'zod';
import { Modal } from '@/shared/components/Modal';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { useWithdraw } from '../hooks/useWithdraw';
import { toast } from 'react-hot-toast';

const withdrawSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  destinationAddress: z.string().min(20, 'Invalid address'),
});

interface WithdrawModalProps {
  asset: string;
  availableBalance: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function WithdrawModal({
  asset,
  availableBalance,
  isOpen,
  onClose,
  onSuccess,
}: WithdrawModalProps) {
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const withdraw = useWithdraw();

  const networkFee = 0.0002; // Example fee
  const receiveAmount = parseFloat(amount) - networkFee;

  const isValid =
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= availableBalance &&
    address.length >= 20;

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      await withdraw.mutateAsync({
        asset,
        amount: parseFloat(amount),
        destinationAddress: address,
      });

      toast.success('Withdrawal request submitted!');
      setAmount('');
      setAddress('');
      setShowConfirm(false);
      onSuccess?.();
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <>
      {/* Main withdrawal form */}
      <Modal isOpen={isOpen && !showConfirm} onClose={onClose} title={`Withdraw ${asset}`}>
        <div className="space-y-4">
          {/* Available balance */}
          <div className="bg-gray-50 rounded p-4">
            <div className="text-sm text-gray-600">Available Balance</div>
            <div className="text-2xl font-bold">
              {availableBalance.toFixed(8)} {asset}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Withdrawal Amount
            </label>
            <Input
              type="number"
              step="0.00000001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
            <div className="flex space-x-2 mt-2">
              {[0.25, 0.5, 0.75, 1.0].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setAmount((availableBalance * pct).toFixed(8))}
                  className="flex-1 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                >
                  {(pct * 100).toFixed(0)}%
                </button>
              ))}
            </div>
          </div>

          {/* Destination address */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Destination Address
            </label>
            <Input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={`Enter ${asset} address`}
              className="font-mono text-sm"
            />
          </div>

          {/* Fee calculation */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span>{amount || '0.00'} {asset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Network Fee:</span>
              <span>{networkFee} {asset}</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>You will receive:</span>
              <span>{receiveAmount > 0 ? receiveAmount.toFixed(8) : '0.00'} {asset}</span>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-red-50 border border-red-200 rounded p-4">
            <p className="text-sm text-red-800">
              <strong>Warning:</strong> Withdrawals cannot be reversed.
              Please verify the destination address carefully.
            </p>
          </div>

          {/* Submit button */}
          <Button
            variant="primary"
            onClick={() => setShowConfirm(true)}
            disabled={!isValid}
            className="w-full"
          >
            Continue
          </Button>
        </div>
      </Modal>

      {/* Confirmation modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Withdrawal"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Please review your withdrawal details carefully:
          </p>

          <div className="bg-gray-50 rounded p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Asset:</span>
              <span className="font-medium">{asset}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">You receive:</span>
              <span className="font-medium">{receiveAmount.toFixed(8)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="text-gray-600 text-sm mb-1">To Address:</div>
              <div className="font-mono text-xs break-all">{address}</div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
            <p className="text-sm text-yellow-800">
              Withdrawals require admin approval and may take up to 24 hours
              to process.
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="secondary"
              onClick={() => setShowConfirm(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleSubmit}
              disabled={withdraw.isLoading}
              className="flex-1"
            >
              {withdraw.isLoading ? 'Submitting...' : 'Confirm Withdrawal'}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
```

### Wallet Service Implementation

```typescript
// services/walletService.ts
import { apiClient } from '@/core/api/client';
import type {
  Balance,
  Deposit,
  Withdrawal,
  WithdrawRequest,
  Transaction,
} from '../types';

export const walletService = {
  async getBalances(): Promise<Balance[]> {
    const response = await apiClient.get<Balance[]>('/api/wallet/balances');
    return response.data;
  },

  async getDepositAddress(asset: string): Promise<{ address: string; network: string }> {
    const response = await apiClient.get<{ address: string; network: string }>(
      `/api/wallet/deposit/${asset}`
    );
    return response.data;
  },

  async getDeposits(): Promise<Deposit[]> {
    const response = await apiClient.get<Deposit[]>('/api/wallet/deposits');
    return response.data;
  },

  async requestWithdrawal(data: WithdrawRequest): Promise<Withdrawal> {
    const response = await apiClient.post<Withdrawal>('/api/wallet/withdraw', data);
    return response.data;
  },

  async getWithdrawals(): Promise<Withdrawal[]> {
    const response = await apiClient.get<Withdrawal[]>('/api/wallet/withdrawals');
    return response.data;
  },

  async getTransactions(): Promise<Transaction[]> {
    const response = await apiClient.get<Transaction[]>('/api/wallet/transactions');
    return response.data;
  },
};
```

---

## 8. Testing

```typescript
// components/__tests__/WithdrawModal.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { WithdrawModal } from '../WithdrawModal';

describe('WithdrawModal', () => {
  it('should show insufficient balance error', () => {
    render(
      <WithdrawModal
        asset="BTC"
        availableBalance={0.1}
        isOpen={true}
        onClose={() => {}}
      />
    );

    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '1' } });

    const submitButton = screen.getByText('Continue');
    expect(submitButton).toBeDisabled();
  });

  it('should validate address format', () => {
    render(
      <WithdrawModal
        asset="BTC"
        availableBalance={1}
        isOpen={true}
        onClose={() => {}}
      />
    );

    const addressInput = screen.getByPlaceholderText(/Enter BTC address/i);
    fireEvent.change(addressInput, { target: { value: 'invalid' } });

    const submitButton = screen.getByText('Continue');
    expect(submitButton).toBeDisabled();
  });
});
```

---

## 9. Security Considerations

### Address Validation

```typescript
// Validate cryptocurrency addresses
const btcAddressRegex = /^(bc1|[13])[a-zA-HJ-NP-Z0-9]{25,62}$/;
const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;

function validateAddress(asset: string, address: string): boolean {
  switch (asset) {
    case 'BTC':
      return btcAddressRegex.test(address);
    case 'ETH':
    case 'USDT':
      return ethAddressRegex.test(address);
    default:
      return address.length >= 20;
  }
}
```

### Amount Validation

```typescript
// Prevent dust attacks and ensure minimum amounts
const MINIMUM_WITHDRAWALS = {
  BTC: 0.001,
  ETH: 0.01,
  USDT: 10,
};

if (amount < MINIMUM_WITHDRAWALS[asset]) {
  throw new Error(`Minimum withdrawal is ${MINIMUM_WITHDRAWALS[asset]} ${asset}`);
}
```

---

## 10. Future Enhancements

**Post-Pilot Features:**
- [ ] Real blockchain integration
- [ ] Multiple network support (BTC: mainnet/testnet)
- [ ] Automated deposit detection
- [ ] Withdrawal whitelist addresses
- [ ] 2FA for withdrawals
- [ ] Email confirmation for withdrawals
- [ ] Withdrawal limits and cooling periods
- [ ] Fiat on/off ramp
- [ ] Interest-bearing accounts

---

## 11. Related Documents

- `../README.md` - Frontend patterns
- `trade.md` - Trading module
- `../../ARCHITECTURE.md` - System architecture
- `../../backend/wallet.md` - Wallet backend service

---

**This module handles all asset management for CEX Pilot users.**
