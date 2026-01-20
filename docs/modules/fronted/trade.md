# Trade Module (Frontend)

## 1. Overview

The Trade module provides the **complete trading interface** for the CEX Pilot platform, enabling users to view markets, place orders, and manage their trading activity.

**Purpose:**
- Display real-time market prices
- Show order book and recent trades
- Enable market and limit order placement
- Display order history and status
- Provide trading chart visualization

**Scope:**
- ✅ Market and limit orders
- ✅ Real-time price updates (WebSocket)
- ✅ Order book visualization
- ✅ Order history and cancellation
- ❌ Advanced order types (stop-loss, trailing stop)
- ❌ Trading bots or API
- ❌ Margin trading

---

## 2. Responsibilities

### What This Module Does
- Render trading interface with market selector
- Display real-time prices via WebSocket
- Show order book (bids and asks)
- Handle order form submissions (market/limit)
- Display user's open and historical orders
- Allow order cancellation
- Show recent market trades

### What This Module Does NOT Do
- Execute order matching (backend responsibility)
- Manage user balances (see `wallet` module)
- Handle authentication (see `auth` module)
- Provide portfolio analytics (future enhancement)

---

## 3. Structure

```
src/features/trade/
├── components/
│   ├── TradeView.tsx                 # Main trading interface
│   ├── MarketSelector.tsx            # Trading pair selector
│   ├── PriceDisplay.tsx              # Current price with change
│   ├── PriceChart.tsx                # 24h price trend chart
│   ├── OrderBook.tsx                 # Order book display
│   ├── OrderBookRow.tsx              # Single order book entry
│   ├── RecentTrades.tsx              # Recent market trades
│   ├── OrderForm.tsx                 # Universal order form
│   ├── MarketOrderForm.tsx           # Market order specific
│   ├── LimitOrderForm.tsx            # Limit order specific
│   ├── OrderTypeToggle.tsx           # Market/Limit toggle
│   ├── OrderConfirmModal.tsx         # Order confirmation
│   ├── OrderHistory.tsx              # User's order history
│   ├── OrderCard.tsx                 # Single order display
│   ├── OpenOrders.tsx                # Active open orders
│   └── __tests__/
│       ├── OrderForm.test.tsx
│       ├── OrderBook.test.tsx
│       └── TradeView.test.tsx
│
├── hooks/
│   ├── useMarkets.ts                 # Fetch available markets
│   ├── useMarketPrice.ts             # Real-time price (WebSocket)
│   ├── useOrderBook.ts               # Order book data
│   ├── usePlaceOrder.ts              # Order placement mutation
│   ├── useOrderHistory.ts            # Fetch order history
│   ├── useOpenOrders.ts              # Fetch open orders
│   ├── useCancelOrder.ts             # Cancel order mutation
│   └── useRecentTrades.ts            # Recent market trades
│
├── services/
│   ├── tradeService.ts               # Trading API calls
│   └── websocketService.ts           # WebSocket management
│
├── types/
│   └── index.ts                      # TypeScript types
│
├── contexts/
│   └── TradingContext.tsx            # Trading state (optional)
│
└── index.ts                          # Public exports
```

---

## 4. API / Interface

### Public Exports

```typescript
// index.ts
export { TradeView, OrderForm, OrderHistory } from './components';
export { usePlaceOrder, useOrderHistory, useMarketPrice } from './hooks';
export type { Order, Market, OrderBook, CreateOrderRequest } from './types';
```

### Components

#### TradeView (Main Interface)

```typescript
export function TradeView()
```

Main trading interface that combines all sub-components. No props needed - manages its own state.

**Layout (Mobile):**
```
┌─────────────────────────────┐
│  Market Selector (BTC/USDT) │
├─────────────────────────────┤
│  Price: $45,000 (+2.5%)     │
├─────────────────────────────┤
│  Mini Chart                 │
├─────────────────────────────┤
│  Order Form                 │
│  - Type: Market | Limit     │
│  - Amount input             │
│  - Buy / Sell buttons       │
├─────────────────────────────┤
│  Tabs: Order Book | History │
└─────────────────────────────┘
```

**Layout (Desktop):**
```
┌────────────────┬───────────────────┬────────────────┐
│                │                   │                │
│  Order Book    │   Price Chart     │  Order Form    │
│                │                   │                │
├────────────────┤                   ├────────────────┤
│                │                   │                │
│  Recent Trades │                   │  Open Orders   │
│                │                   │                │
└────────────────┴───────────────────┴────────────────┘
```

#### OrderForm

```typescript
interface OrderFormProps {
  market: Market;
  balance: number;
  currentPrice: number;
  onSuccess?: (order: Order) => void;
}

export function OrderForm({ market, balance, currentPrice, onSuccess }: OrderFormProps)
```

**Features:**
- Toggle between Market and Limit
- Buy/Sell tabs
- Amount input with quick percentage buttons (25%, 50%, 75%, 100%)
- Real-time total calculation
- Fee display
- Validation and error messages

#### OrderHistory

```typescript
interface OrderHistoryProps {
  filters?: OrderFilters;
  onOrderClick?: (order: Order) => void;
}

export function OrderHistory({ filters, onOrderClick }: OrderHistoryProps)
```

**Features:**
- Filter tabs: All | Open | Filled | Cancelled
- Date range selector
- Order list with status badges
- Infinite scroll pagination
- Click to view order details

### Hooks

#### useMarketPrice

```typescript
interface UseMarketPriceReturn {
  price: number | null;
  change24h: number;
  volume24h: number;
  isConnected: boolean;
}

export function useMarketPrice(symbol: string): UseMarketPriceReturn
```

Subscribes to real-time price updates via WebSocket.

**Usage:**
```typescript
function PriceDisplay() {
  const { price, change24h, isConnected } = useMarketPrice('BTC-USDT');
  
  if (!isConnected) {
    return <div>Reconnecting...</div>;
  }
  
  return (
    <div>
      <span className="text-2xl">${price?.toLocaleString()}</span>
      <span className={change24h >= 0 ? 'text-green-600' : 'text-red-600'}>
        {change24h >= 0 ? '+' : ''}{change24h.toFixed(2)}%
      </span>
    </div>
  );
}
```

#### usePlaceOrder

```typescript
interface UsePlaceOrderReturn {
  mutate: (data: CreateOrderRequest) => void;
  mutateAsync: (data: CreateOrderRequest) => Promise<Order>;
  isLoading: boolean;
  error: Error | null;
}

export function usePlaceOrder(): UsePlaceOrderReturn
```

**Usage:**
```typescript
function BuyButton() {
  const placeOrder = usePlaceOrder();
  
  const handleBuy = () => {
    placeOrder.mutate({
      symbol: 'BTC-USDT',
      side: 'buy',
      type: 'market',
      amount: 0.1,
    }, {
      onSuccess: (order) => {
        toast.success('Order placed successfully!');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };
  
  return (
    <button onClick={handleBuy} disabled={placeOrder.isLoading}>
      {placeOrder.isLoading ? 'Placing...' : 'Buy BTC'}
    </button>
  );
}
```

#### useOrderBook

```typescript
interface UseOrderBookReturn {
  bids: OrderBookEntry[];  // Buy orders (descending by price)
  asks: OrderBookEntry[];  // Sell orders (ascending by price)
  spread: number;          // Difference between best bid and ask
  isLoading: boolean;
}

export function useOrderBook(symbol: string): UseOrderBookReturn
```

---

## 5. Dependencies

### External Dependencies
- `react` - Core React
- `@tanstack/react-query` - Data fetching
- `socket.io-client` - WebSocket for real-time data
- `recharts` - Chart visualization
- `zod` - Form validation
- `react-hot-toast` - Notifications

### Internal Dependencies
- `@/features/auth` - User authentication (via `useAuth`)
- `@/features/wallet` - Balance information (via `useBalances`)
- `@/core/websocket` - WebSocket client
- `@/core/api` - HTTP client
- `@/shared/components` - UI components (Button, Input, Modal)

---

## 6. Data Models

### TypeScript Types

```typescript
// types/index.ts

export interface Market {
  id: string;
  symbol: string;          // 'BTC-USDT'
  baseAsset: string;       // 'BTC'
  quoteAsset: string;      // 'USDT'
  currentPrice: number;
  change24h: number;       // Percentage
  volume24h: number;
  high24h: number;
  low24h: number;
  status: 'active' | 'inactive';
}

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';
export type OrderStatus = 'open' | 'partially_filled' | 'filled' | 'cancelled';

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price?: number;          // Null for market orders
  amount: number;
  filledAmount: number;
  averagePrice: number;
  fee: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  symbol: string;
  side: OrderSide;
  type: OrderType;
  amount: number;
  price?: number;          // Required for limit orders
}

export interface OrderBook {
  symbol: string;
  bids: OrderBookEntry[];  // Buy orders
  asks: OrderBookEntry[];  // Sell orders
  timestamp: string;
}

export interface OrderBookEntry {
  price: number;
  amount: number;
  total: number;           // Cumulative
}

export interface Trade {
  id: string;
  symbol: string;
  price: number;
  amount: number;
  side: OrderSide;
  timestamp: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  startDate?: string;
  endDate?: string;
  symbol?: string;
}
```

### API Contracts

**Get Markets:**
```typescript
GET /api/markets
Response: Market[]
```

**Get Market Details:**
```typescript
GET /api/markets/:symbol
Response: Market
```

**Get Order Book:**
```typescript
GET /api/markets/:symbol/orderbook
Response: OrderBook
```

**Place Order:**
```typescript
POST /api/orders
Request: CreateOrderRequest
Response: Order
```

**Get Order History:**
```typescript
GET /api/orders?status=filled&symbol=BTC-USDT&limit=20&offset=0
Response: { orders: Order[], total: number }
```

**Cancel Order:**
```typescript
DELETE /api/orders/:id
Response: { message: 'Order cancelled' }
```

**WebSocket Events:**
```typescript
// Subscribe to price updates
socket.on('market.price.BTC-USDT', (data: {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: string;
}))

// Subscribe to order book updates
socket.on('market.orderbook.BTC-USDT', (data: OrderBook))

// Subscribe to trades
socket.on('market.trades.BTC-USDT', (data: Trade))

// User's order updates
socket.on('user.order.updated', (data: Order))
```

---

## 7. Implementation Examples

### TradeView Implementation

```typescript
// components/TradeView.tsx
import { useState } from 'react';
import { useMarkets } from '../hooks/useMarkets';
import { useMarketPrice } from '../hooks/useMarketPrice';
import { useAuth } from '@/features/auth';
import { useBalances } from '@/features/wallet';
import { MarketSelector } from './MarketSelector';
import { PriceDisplay } from './PriceDisplay';
import { PriceChart } from './PriceChart';
import { OrderBook } from './OrderBook';
import { OrderForm } from './OrderForm';
import { OrderHistory } from './OrderHistory';
import { RecentTrades } from './RecentTrades';

export function TradeView() {
  const { user } = useAuth();
  const { data: markets } = useMarkets();
  const [selectedSymbol, setSelectedSymbol] = useState('BTC-USDT');
  
  const { price, change24h, isConnected } = useMarketPrice(selectedSymbol);
  const { data: balances } = useBalances(user?.id);
  
  const selectedMarket = markets?.find(m => m.symbol === selectedSymbol);
  const quoteBalance = balances?.find(b => b.asset === selectedMarket?.quoteAsset)?.available || 0;

  // Mobile layout
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen">
        {/* Market selector */}
        <div className="p-4 border-b">
          <MarketSelector
            markets={markets || []}
            selected={selectedSymbol}
            onChange={setSelectedSymbol}
          />
        </div>

        {/* Price display */}
        <div className="p-4 border-b">
          <PriceDisplay
            price={price}
            change24h={change24h}
            isConnected={isConnected}
          />
        </div>

        {/* Chart */}
        <div className="p-4 border-b" style={{ height: '200px' }}>
          <PriceChart symbol={selectedSymbol} />
        </div>

        {/* Order form */}
        <div className="p-4 border-b">
          <OrderForm
            market={selectedMarket!}
            balance={quoteBalance}
            currentPrice={price || 0}
          />
        </div>

        {/* Tabs: Order Book | Order History */}
        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="orderbook">
            <TabsList className="w-full">
              <TabsTrigger value="orderbook">Order Book</TabsTrigger>
              <TabsTrigger value="history">My Orders</TabsTrigger>
            </TabsList>
            <TabsContent value="orderbook">
              <OrderBook symbol={selectedSymbol} />
            </TabsContent>
            <TabsContent value="history">
              <OrderHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="grid grid-cols-3 gap-4 h-screen p-4">
      {/* Left column: Order Book + Recent Trades */}
      <div className="flex flex-col space-y-4">
        <div className="flex-1 overflow-hidden">
          <OrderBook symbol={selectedSymbol} />
        </div>
        <div className="h-64 overflow-hidden">
          <RecentTrades symbol={selectedSymbol} />
        </div>
      </div>

      {/* Middle column: Chart */}
      <div className="flex flex-col space-y-4">
        <MarketSelector
          markets={markets || []}
          selected={selectedSymbol}
          onChange={setSelectedSymbol}
        />
        <PriceDisplay
          price={price}
          change24h={change24h}
          isConnected={isConnected}
        />
        <div className="flex-1">
          <PriceChart symbol={selectedSymbol} />
        </div>
      </div>

      {/* Right column: Order Form + Open Orders */}
      <div className="flex flex-col space-y-4">
        <OrderForm
          market={selectedMarket!}
          balance={quoteBalance}
          currentPrice={price || 0}
        />
        <div className="flex-1 overflow-hidden">
          <OrderHistory filters={{ status: 'open' }} />
        </div>
      </div>
    </div>
  );
}
```

### OrderForm Implementation

```typescript
// components/OrderForm.tsx
import { useState, useMemo } from 'react';
import { z } from 'zod';
import { usePlaceOrder } from '../hooks/usePlaceOrder';
import { Input } from '@/shared/components/Input';
import { Button } from '@/shared/components/Button';
import { toast } from 'react-hot-toast';
import type { Market, OrderSide, OrderType } from '../types';

interface OrderFormProps {
  market: Market;
  balance: number;
  currentPrice: number;
  onSuccess?: (order: Order) => void;
}

export function OrderForm({ market, balance, currentPrice, onSuccess }: OrderFormProps) {
  const [side, setSide] = useState<OrderSide>('buy');
  const [type, setType] = useState<OrderType>('market');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState(currentPrice.toString());

  const placeOrder = usePlaceOrder();

  // Calculate total cost
  const total = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const prc = type === 'market' ? currentPrice : (parseFloat(price) || 0);
    return amt * prc;
  }, [amount, price, type, currentPrice]);

  // Calculate fee (0.1%)
  const fee = total * 0.001;
  const totalWithFee = total + fee;

  // Validation
  const isValid = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return false;
    if (type === 'limit') {
      const prc = parseFloat(price);
      if (!prc || prc <= 0) return false;
    }
    if (side === 'buy' && totalWithFee > balance) return false;
    return true;
  }, [amount, price, type, side, totalWithFee, balance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    try {
      await placeOrder.mutateAsync({
        symbol: market.symbol,
        side,
        type,
        amount: parseFloat(amount),
        ...(type === 'limit' && { price: parseFloat(price) }),
      });

      toast.success(`${side === 'buy' ? 'Buy' : 'Sell'} order placed!`);
      setAmount('');
      onSuccess?.();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handlePercentageClick = (percentage: number) => {
    const availableAmount = side === 'buy'
      ? (balance * percentage) / currentPrice
      : balance * percentage;
    setAmount(availableAmount.toFixed(8));
  };

  return (
    <div className="space-y-4">
      {/* Order Type Toggle */}
      <div className="flex space-x-2">
        <button
          onClick={() => setType('market')}
          className={`flex-1 py-2 rounded ${
            type === 'market'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setType('limit')}
          className={`flex-1 py-2 rounded ${
            type === 'limit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Limit
        </button>
      </div>

      {/* Buy/Sell Tabs */}
      <div className="flex space-x-2">
        <button
          onClick={() => setSide('buy')}
          className={`flex-1 py-2 rounded ${
            side === 'buy'
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className={`flex-1 py-2 rounded ${
            side === 'sell'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Sell
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Price input (limit orders only) */}
        {type === 'limit' && (
          <div>
            <label className="block text-sm font-medium mb-1">
              Price ({market.quoteAsset})
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toString()}
            />
            <p className="text-xs text-gray-500 mt-1">
              Market: ${currentPrice.toLocaleString()}
            </p>
          </div>
        )}

        {/* Amount input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Amount ({market.baseAsset})
          </label>
          <Input
            type="number"
            step="0.00000001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
          />
          
          {/* Quick percentage buttons */}
          <div className="flex space-x-2 mt-2">
            {[0.25, 0.5, 0.75, 1.0].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handlePercentageClick(pct)}
                className="flex-1 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
              >
                {(pct * 100).toFixed(0)}%
              </button>
            ))}
          </div>
        </div>

        {/* Available balance */}
        <div className="text-sm">
          <span className="text-gray-600">Available: </span>
          <span className="font-medium">
            {balance.toFixed(8)} {side === 'buy' ? market.quoteAsset : market.baseAsset}
          </span>
        </div>

        {/* Total calculation */}
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Total:</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Fee (0.1%):</span>
            <span>${fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total with Fee:</span>
            <span>${totalWithFee.toLocaleString()}</span>
          </div>
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          variant={side === 'buy' ? 'success' : 'danger'}
          className="w-full"
          disabled={!isValid || placeOrder.isLoading}
        >
          {placeOrder.isLoading
            ? 'Placing Order...'
            : `${side === 'buy' ? 'Buy' : 'Sell'} ${market.baseAsset}`}
        </Button>

        {/* Validation errors */}
        {!isValid && amount && (
          <p className="text-sm text-red-600">
            {side === 'buy' && totalWithFee > balance
              ? 'Insufficient balance'
              : 'Invalid order parameters'}
          </p>
        )}
      </form>
    </div>
  );
}
```

### useMarketPrice Hook Implementation

```typescript
// hooks/useMarketPrice.ts
import { useState, useEffect } from 'react';
import { wsClient } from '@/core/websocket/client';

interface MarketPriceData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  timestamp: string;
}

interface UseMarketPriceReturn {
  price: number | null;
  change24h: number;
  volume24h: number;
  isConnected: boolean;
}

export function useMarketPrice(symbol: string): UseMarketPriceReturn {
  const [data, setData] = useState<MarketPriceData | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Subscribe to price updates
    const channel = `market.price.${symbol}`;
    
    wsClient.subscribe(channel, (priceData: MarketPriceData) => {
      setData(priceData);
      setIsConnected(true);
    });

    // Handle connection status
    wsClient.on('connect', () => setIsConnected(true));
    wsClient.on('disconnect', () => setIsConnected(false));

    // Cleanup
    return () => {
      wsClient.unsubscribe(channel);
    };
  }, [symbol]);

  return {
    price: data?.price || null,
    change24h: data?.change24h || 0,
    volume24h: data?.volume24h || 0,
    isConnected,
  };
}
```

### Trade Service Implementation

```typescript
// services/tradeService.ts
import { apiClient } from '@/core/api/client';
import type {
  Market,
  Order,
  OrderBook,
  CreateOrderRequest,
  OrderFilters,
  Trade,
} from '../types';

export const tradeService = {
  async getMarkets(): Promise<Market[]> {
    const response = await apiClient.get<Market[]>('/api/markets');
    return response.data;
  },

  async getMarket(symbol: string): Promise<Market> {
    const response = await apiClient.get<Market>(`/api/markets/${symbol}`);
    return response.data;
  },

  async getOrderBook(symbol: string): Promise<OrderBook> {
    const response = await apiClient.get<OrderBook>(
      `/api/markets/${symbol}/orderbook`
    );
    return response.data;
  },

  async placeOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await apiClient.post<Order>('/api/orders', data);
    return response.data;
  },

  async getOrderHistory(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.symbol) params.append('symbol', filters.symbol);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const response = await apiClient.get<{ orders: Order[] }>(
      `/api/orders?${params.toString()}`
    );
    return response.data.orders;
  },

  async cancelOrder(orderId: string): Promise<void> {
    await apiClient.delete(`/api/orders/${orderId}`);
  },

  async getRecentTrades(symbol: string, limit = 20): Promise<Trade[]> {
    const response = await apiClient.get<Trade[]>(
      `/api/markets/${symbol}/trades?limit=${limit}`
    );
    return response.data;
  },
};
```

---

## 8. Testing

### Component Tests

```typescript
// components/__tests__/OrderForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrderForm } from '../OrderForm';

const queryClient = new QueryClient();

const mockMarket = {
  id: '1',
  symbol: 'BTC-USDT',
  baseAsset: 'BTC',
  quoteAsset: 'USDT',
  currentPrice: 45000,
  change24h: 2.5,
  volume24h: 1000,
  high24h: 46000,
  low24h: 44000,
  status: 'active',
};

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('OrderForm', () => {
  it('should show insufficient balance error', () => {
    render(
      <OrderForm
        market={mockMarket}
        balance={100}  // Only $100
        currentPrice={45000}
      />,
      { wrapper: Wrapper }
    );

    // Try to buy 1 BTC (costs $45,000)
    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '1' } });

    expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
  });

  it('should calculate total correctly with fees', () => {
    render(
      <OrderForm
        market={mockMarket}
        balance={50000}
        currentPrice={45000}
      />,
      { wrapper: Wrapper }
    );

    const amountInput = screen.getByPlaceholderText('0.00');
    fireEvent.change(amountInput, { target: { value: '0.1' } });

    // 0.1 BTC * $45,000 = $4,500
    // Fee: $4,500 * 0.001 = $4.5
    // Total: $4,504.5
    expect(screen.getByText(/\$4,500/)).toBeInTheDocument();
    expect(screen.getByText(/\$4\.50/)).toBeInTheDocument();
  });

  it('should switch between market and limit order types', () => {
    render(
      <OrderForm
        market={mockMarket}
        balance={50000}
        currentPrice={45000}
      />,
      { wrapper: Wrapper }
    );

    const limitButton = screen.getByText('Limit');
    fireEvent.click(limitButton);

    // Price input should appear for limit orders
    expect(screen.getByLabelText(/price/i)).toBeInTheDocument();
  });
});
```

---

## 9. Real-Time Updates

### WebSocket Integration

```typescript
// hooks/useOrderBook.ts
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { wsClient } from '@/core/websocket/client';
import { tradeService } from '../services/tradeService';
import type { OrderBook } from '../types';

export function useOrderBook(symbol: string) {
  const [orderBook, setOrderBook] = useState<OrderBook | null>(null);

  // Initial fetch
  const { data: initialData, isLoading } = useQuery({
    queryKey: ['orderbook', symbol],
    queryFn: () => tradeService.getOrderBook(symbol),
  });

  useEffect(() => {
    if (initialData) {
      setOrderBook(initialData);
    }
  }, [initialData]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = `market.orderbook.${symbol}`;
    
    wsClient.subscribe(channel, (data: OrderBook) => {
      setOrderBook(data);
    });

    return () => {
      wsClient.unsubscribe(channel);
    };
  }, [symbol]);

  return {
    bids: orderBook?.bids || [],
    asks: orderBook?.asks || [],
    spread: orderBook ? orderBook.asks[0]?.price - orderBook.bids[0]?.price : 0,
    isLoading,
  };
}
```

---

## 10. Performance Optimization

### Memoization for Order Book

```typescript
// components/OrderBook.tsx
import { memo } from 'react';
import { useOrderBook } from '../hooks/useOrderBook';

export const OrderBook = memo(({ symbol }: { symbol: string }) => {
  const { bids, asks, spread } = useOrderBook(symbol);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Order Book</div>
      
      {/* Asks (Sell orders) - red */}
      <div className="space-y-1">
        {asks.slice(0, 10).reverse().map((entry, idx) => (
          <OrderBookRow key={idx} entry={entry} type="ask" />
        ))}
      </div>

      {/* Spread */}
      <div className="text-center text-sm text-gray-500">
        Spread: ${spread.toFixed(2)}
      </div>

      {/* Bids (Buy orders) - green */}
      <div className="space-y-1">
        {bids.slice(0, 10).map((entry, idx) => (
          <OrderBookRow key={idx} entry={entry} type="bid" />
        ))}
      </div>
    </div>
  );
});

const OrderBookRow = memo(({ entry, type }: {
  entry: OrderBookEntry;
  type: 'bid' | 'ask';
}) => {
  const color = type === 'bid' ? 'bg-green-50' : 'bg-red-50';
  
  return (
    <div className={`flex justify-between text-xs p-1 ${color}`}>
      <span>${entry.price.toLocaleString()}</span>
      <span>{entry.amount.toFixed(4)}</span>
      <span>${entry.total.toLocaleString()}</span>
    </div>
  );
});
```

---

## 11. Security Considerations

### Input Validation

```typescript
// Always validate on frontend AND backend
const orderSchema = z.object({
  symbol: z.string().regex(/^[A-Z]+-[A-Z]+$/),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit']),
  amount: z.number().positive().min(0.00000001),
  price: z.number().positive().optional(),
});

// In OrderForm
const result = orderSchema.safeParse(formData);
if (!result.success) {
  // Show validation errors
  return;
}
```

### Rate Limiting (Frontend)

```typescript
// Prevent order spam
import { useThrottle } from '@/shared/hooks/useThrottle';

const throttledSubmit = useThrottle(handleSubmit, 1000); // 1 second
```

---

## 12. Future Enhancements

**Post-Pilot Features:**
- [ ] Advanced order types (stop-loss, OCO)
- [ ] Trading view advanced charts (TradingView widget)
- [ ] Depth chart visualization
- [ ] One-click trading mode
- [ ] Order book depth ladder
- [ ] Price alerts
- [ ] Trading bot API
- [ ] Portfolio performance analytics

---

## 13. Related Documents

- `../README.md` - Frontend patterns
- `wallet.md` - Balance management
- `../../ARCHITECTURE.md` - System architecture
- `../../backend/trading.md` - Trading backend service

---

## 14. Troubleshooting

**Issue: WebSocket disconnects frequently**
- Check network stability
- Implement reconnection logic with exponential backoff
- Show "Reconnecting..." indicator to user

**Issue: Order form shows stale price**
- Ensure WebSocket is connected
- Fall back to polling if WebSocket fails
- Show warning if price is stale (>5 seconds old)

**Issue: Order book not updating in real-time**
- Check WebSocket subscription
- Verify backend is broadcasting updates
- Check browser console for errors

---

**This module is the core trading interface for CEX Pilot.**
