# PRD: CEX Spot Trading Order System (Frontend)

| Document Information | Content |
| --- | --- |
| **Project Name** | Spot Trading Order Interface & Flow |
| **Version** | v1.0 |
| **Date Created** | 2026. 01. 26 |
| **Scope** | UX/UI and logic from Order Input (Order Form) to Order Submission and Execution Notification |

---

## 1. Overview

### 1.1 Purpose

To provide an intuitive interface that allows users to buy/sell virtual assets using various strategies (limit, market, conditional orders). Specifically, design clear UX to ensure users understand and correctly use the **Stop Order (Conditional Order)** trigger concept.

### 1.2 Supported Order Types

1. **Limit:** Specify desired price and quantity.
2. **Market:** Immediate execution at current market price.
3. **Stop-Limit:** A limit order is placed when a specific price (Trigger) is reached.
4. **Stop-Market:** A market order is placed when a specific price (Trigger) is reached.

---

## 2. User Flow (End-to-End)

Step-by-step flow from user placing an order to order completion.

### Step 1: Order Configuration

1. **Select Side:** Click [Buy (Green)] or [Sell (Red)] tab. (Theme color changes).
2. **Select Type:** Choose from [Limit / Market / Stop-Limit / Stop-Market] via dropdown or tabs.
3. **Input:** Enter price, trigger price (for Stop Orders), and quantity based on order type.
* *Helper:* Clicking percentage slider (25%, 50%...) auto-calculates and inputs values.


4. **Client Validation:** Immediate check for minimum order amount and insufficient balance.

### Step 2: Order Submission

1. **Action:** Click [Buy/Sell] button.
2. **Confirmation Popup (Optional):** For Stop Orders or Market Orders, a risk disclaimer popup is shown (can be skipped based on user settings).
3. **API Request:** Send `POST /api/v1/orders`. Button changes to loading state (Spinner).

### Step 3: Feedback & Open

1. **Response:** Receive successful API response (200 OK).
2. **UI Update:**
* Display Toast message ("Order has been submitted").
* **Available Balance** immediately deducted and updated.
* Order details added to the **[Open Orders]** tab at the bottom.
* (For Limit orders) Display 'My Order' on the chart or order book.



### Step 4: Execution Completion

1. **Event:** Receive WebSocket `orderUpdate` event (Status: `FILLED`).
2. **UI Update:**
* Display Toast message ("XXX Coin Buy Order has been filled").
* Remove the order from the [Open Orders] list.
* Add to **[Order History]** or **[Trade History]** tab.
* Final update of Wallet Balance.



---

## 3. Detailed Functional Requirements

### 3.1 Common UI Elements

* **Available Balance:** Display 'Quote Currency (e.g., USDT)' balance on the Buy tab, and 'Base Currency (e.g., BTC)' balance on the Sell tab.
* **Percent Slider:** [25% | 50% | 75% | 100%] buttons.
* Logic: Calculates `Available Balance * %` and inputs the value into the Quantity (Amount) field.
* Fee Consideration: It is good UX to calculate the maximum quantity excluding fees for buy orders.



### 3.2 Order Type Specific Input Fields (Order Form Fields)

#### A. Limit Order

*   **Price Input:** Desired trading price. (Default: Latest order book price)
*   **Amount Input:** Trading quantity.
*   **Total (Read-only/Editable):** `Price * Amount`. (Entering Total inversely calculates Amount)

#### B. Market Order

*   **Price Input:** **Disabled** (Placeholder: "Market Price" or "Best Price").
*   **Amount Input:**
*   **For Buy Orders:** It is common to receive input for the total amount to be purchased (Total USDT) because precise quantity matching can be difficult.
*   **For Sell Orders:** Input the quantity to be sold (Amount Coin).


*   *Warning:* Display "Actual execution price may differ from the estimated price due to market conditions." message below the input field.

#### C. Stop-Limit

*   **Trigger Price (Stop Price):** Monitoring price. When the market price reaches this price, the order is triggered.
*   **Limit Price:** The price at which the order will be placed on the order book. (Can be set equal to the Trigger Price or more favorably).
*   **Amount Input:** Quantity.
*   *UX Tip:* When entering Trigger Price, display a descriptive text below it.
*   Example: *"When the market price reaches **20,000 USDT**, a buy order will be executed at **19,900 USDT**."*



#### D. Stop-Market

*   **Trigger Price (Stop Price):** Monitoring price.
*   **Market Price:** **Disabled** (Placeholder: "Market").
*   **Amount Input:** Quantity (or total amount).
*   *UX Tip:* *"When the market price reaches **20,000 USDT**, it will be bought immediately at **Market Price**."*

---

## 4. Data Logic & Validation

### 4.1 Client-side Validation

Checks to perform before sending the API request upon clicking the order button. If an error occurs, display red text below the Input Field instead of a Toast message.

1.  **Required Value Check:** Are Price, Quantity (or Total amount), and Trigger Price (for Stop orders) entered?
2.  **Minimum Order Amount:** Is `Price * Amount` above the exchange's minimum standard (e.g., 5 USDT)?
3.  **Balance Exceeded:** Is the entered Total (estimated including fees) greater than the Available Balance?
4.  **Price Range:** Is the price unreasonably high or low compared to the current market price? (Fat-finger prevention warning popup).
*   Example: If current price is 100 KRW, and a sell order is placed at 10 KRW, show "This is 90% lower than the current price. Do you wish to proceed?"



### 4.2 State Management

*   **Trigger Condition:**
*   Stop orders, once sent to the API, are stored in a separate 'Stop Order Queue' on the server.
*   Therefore, **Normal Orders** and **Stop Orders** should be separated by tabs or distinguished with a tag (Badge) in the [Open Orders] tab.
*   Status Values: `NEW` (Pending) `TRIGGERED` (Triggered) `FILLED` (Filled).



---

## 5. Exception Handling

| Situation | UI Behavior | Example User Message |
| --- | --- | --- |
| **API Timeout** | Loading spinner stops after 5 seconds, button becomes active | "Server response is delayed. Please try again shortly." |
| **Insufficient Liquidity for Market Order** | Order rejected (if FOK set) | "Market liquidity is insufficient to fill the order." |
| **Stop Order Trigger Failure** | Failure reason sent to Notification Center | "Conditional order (ID:123) failed to execute due to insufficient balance." |
| **Rapid Price Fluctuation** | Slippage warning modal for market orders | "The estimated execution price differs by more than 5% from the time of input. Do you wish to continue?" |

---

## 6. Development Notes (For Developers)

*   **Decimal Precision:** The decimal places for Price and Quantity vary for each coin. The `step` attribute of Input fields should be dynamically controlled by referring to the API's `symbol_info`. (e.g., BTC has 2 decimal places, XRP has 4 decimal places, etc.).
*   **WebSocket Topic:**
*   Order Execution Updates: `user_data_stream` (Execution Report).
*   Stop Order Status Changes: A separate event may be required (e.g., `stop_order_update`).


*   **Taker/Maker:** Even for Limit orders, if placed unfavorably (buy higher than market, sell lower than market), they may be executed immediately as Taker orders, incurring Taker fees (or check if a Post-only option exists).

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
import { useMediaQuery } from '@/features/shared/hooks/useMediaQuery';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Assuming these imports

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
import { Input } from '@/components/ui/input'; // Corrected import path
import { Button } from '@/components/ui/button'; // Corrected import path
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is installed
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
  const [triggerPrice, setTriggerPrice] = useState(''); // Added for Stop orders

  const placeOrder = usePlaceOrder();

  // Calculate total cost
  const total = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const prc = type === 'market' || type === 'stop-market' ? currentPrice : (parseFloat(price) || 0); // Adjusted for stop-market
    return amt * prc;
  }, [amount, price, type, currentPrice]);

  // Calculate fee (0.1%)
  const fee = total * 0.001;
  const totalWithFee = total + fee;

  // Validation
  const isValid = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return false;
    if (type === 'limit' || type === 'stop-limit') { // Adjusted for stop-limit
      const prc = parseFloat(price);
      if (!prc || prc <= 0) return false;
    }
    if (type === 'stop-limit' || type === 'stop-market') { // Check trigger price for stop orders
        const trigPrice = parseFloat(triggerPrice);
        if (!trigPrice || trigPrice <= 0) return false;
    }
    if (side === 'buy' && totalWithFee > balance) return false;
    return true;
  }, [amount, price, type, side, totalWithFee, balance, triggerPrice]); // Added triggerPrice to dependencies

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
        ...((type === 'stop-limit' || type === 'stop-market') && { triggerPrice: parseFloat(triggerPrice) }), // Added for Stop orders
        ...(type === 'stop-limit' && { limitPrice: parseFloat(price) }), // Added for Stop-Limit
      });

      toast.success(`${side === 'buy' ? 'Buy' : 'Sell'} order placed!`);
      setAmount('');
      setPrice(currentPrice.toString()); // Reset price input
      setTriggerPrice(''); // Reset trigger price
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
        <button
          onClick={() => setType('stop-limit')}
          className={`flex-1 py-2 rounded ${
            type === 'stop-limit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Stop-Limit
        </button>
        <button
          onClick={() => setType('stop-market')}
          className={`flex-1 py-2 rounded ${
            type === 'stop-market'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Stop-Market
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
        {/* Trigger Price input (Stop orders only) */}
        {(type === 'stop-limit' || type === 'stop-market') && (
            <div>
                <label className="block text-sm font-medium mb-1">
                    Trigger Price ({market.quoteAsset})
                </label>
                <Input
                    type="number"
                    step="0.01"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                    placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {type === 'stop-limit'
                        ? `Market price reaches ${triggerPrice || 'X'} ${market.quoteAsset}, then a Limit order will be placed at ${price || 'Y'} ${market.quoteAsset}.`
                        : `Market price reaches ${triggerPrice || 'X'} ${market.quoteAsset}, then a Market order will be placed.`
                    }
                </p>
            </div>
        )}

        {/* Price input (limit orders only) */}
        {(type === 'limit' || type === 'stop-limit') && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {type === 'limit' ? 'Price' : 'Limit Price'} ({market.quoteAsset})
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toString()}
              disabled={type === 'stop-market'} // Disable price input for stop-market
            />
            {type === 'limit' && (
                <p className="text-xs text-gray-500 mt-1">
                  Market: ${currentPrice.toLocaleString()}
                </p>
            )}
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
        {type === 'market' && ( // Market order warning
            <p className="text-xs text-yellow-500 mt-1">
                Execution price may differ from estimated price due to market conditions.
            </p>
        )}
        {(type === 'stop-limit' || type === 'stop-market') && ( // Stop order warning
            <p className="text-xs text-yellow-500 mt-1">
                A confirmation popup for risk disclosure will be shown for stop orders.
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
export type OrderType = 'market' | 'limit' | 'stop-limit' | 'stop-market'; // Updated
export type OrderStatus = 'new' | 'partially_filled' | 'filled' | 'cancelled' | 'triggered'; // Updated

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price?: number;          // Null for market orders
  triggerPrice?: number;   // Added for Stop orders
  limitPrice?: number;     // Added for Stop-Limit orders
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
  triggerPrice?: number;   // Added for Stop orders
  limitPrice?: number;     // Added for Stop-Limit orders
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
import { useMediaQuery } from '@/features/shared/hooks/useMediaQuery';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Assuming these imports

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
import { Input } from '@/components/ui/input'; // Corrected import path
import { Button } from '@/components/ui/button'; // Corrected import path
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is installed
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
  const [triggerPrice, setTriggerPrice] = useState(''); // Added for Stop orders

  const placeOrder = usePlaceOrder();

  // Calculate total cost
  const total = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const prc = type === 'market' || type === 'stop-market' ? currentPrice : (parseFloat(price) || 0); // Adjusted for stop-market
    return amt * prc;
  }, [amount, price, type, currentPrice]);

  // Calculate fee (0.1%)
  const fee = total * 0.001;
  const totalWithFee = total + fee;

  // Validation
  const isValid = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return false;
    if (type === 'limit' || type === 'stop-limit') { // Adjusted for stop-limit
      const prc = parseFloat(price);
      if (!prc || prc <= 0) return false;
    }
    if (type === 'stop-limit' || type === 'stop-market') { // Check trigger price for stop orders
        const trigPrice = parseFloat(triggerPrice);
        if (!trigPrice || trigPrice <= 0) return false;
    }
    if (side === 'buy' && totalWithFee > balance) return false;
    return true;
  }, [amount, price, type, side, totalWithFee, balance, triggerPrice]); // Added triggerPrice to dependencies

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
        ...((type === 'stop-limit' || type === 'stop-market') && { triggerPrice: parseFloat(triggerPrice) }), // Added for Stop orders
        ...(type === 'stop-limit' && { limitPrice: parseFloat(price) }), // Added for Stop-Limit
      });

      toast.success(`${side === 'buy' ? 'Buy' : 'Sell'} order placed!`);
      setAmount('');
      setPrice(currentPrice.toString()); // Reset price input
      setTriggerPrice(''); // Reset trigger price
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
        <button
          onClick={() => setType('stop-limit')}
          className={`flex-1 py-2 rounded ${
            type === 'stop-limit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Stop-Limit
        </button>
        <button
          onClick={() => setType('stop-market')}
          className={`flex-1 py-2 rounded ${
            type === 'stop-market'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Stop-Market
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
        {/* Trigger Price input (Stop orders only) */}
        {(type === 'stop-limit' || type === 'stop-market') && (
            <div>
                <label className="block text-sm font-medium mb-1">
                    Trigger Price ({market.quoteAsset})
                </label>
                <Input
                    type="number"
                    step="0.01"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                    placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {type === 'stop-limit'
                        ? `When market price reaches ${triggerPrice || 'X'} ${market.quoteAsset}, a Limit order will be placed at ${price || 'Y'} ${market.quoteAsset}.`
                        : `When market price reaches ${triggerPrice || 'X'} ${market.quoteAsset}, a Market order will be placed.`
                    }
                </p>
            </div>
        )}

        {/* Price input (limit orders only) */}
        {(type === 'limit' || type === 'stop-limit') && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {type === 'limit' ? 'Price' : 'Limit Price'} ({market.quoteAsset})
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toString()}
              disabled={type === 'stop-market'} // Disable price input for stop-market
            />
            {type === 'limit' && (
                <p className="text-xs text-gray-500 mt-1">
                  Market: ${currentPrice.toLocaleString()}
                </p>
            )}
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
        {type === 'market' && ( // Market order warning
            <p className="text-xs text-yellow-500 mt-1">
                Execution price may differ from estimated price due to market conditions.
            </p>
        )}
        {(type === 'stop-limit' || type === 'stop-market') && ( // Stop order warning
            <p className="text-xs text-yellow-500 mt-1">
                A confirmation popup for risk disclosure will be shown for stop orders.
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
export type OrderType = 'market' | 'limit' | 'stop-limit' | 'stop-market'; // Updated
export type OrderStatus = 'new' | 'partially_filled' | 'filled' | 'cancelled' | 'triggered'; // Updated

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price?: number;          // Null for market orders
  triggerPrice?: number;   // Added for Stop orders
  limitPrice?: number;     // Added for Stop-Limit orders
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
  triggerPrice?: number;   // Added for Stop orders
  limitPrice?: number;     // Added for Stop-Limit orders
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
import { useMediaQuery } from '@/features/shared/hooks/useMediaQuery';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Assuming these imports

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
import { Input } from '@/components/ui/input'; // Corrected import path
import { Button } from '@/components/ui/button'; // Corrected import path
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is installed
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
  const [triggerPrice, setTriggerPrice] = useState(''); // Added for Stop orders

  const placeOrder = usePlaceOrder();

  // Calculate total cost
  const total = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const prc = type === 'market' || type === 'stop-market' ? currentPrice : (parseFloat(price) || 0); // Adjusted for stop-market
    return amt * prc;
  }, [amount, price, type, currentPrice]);

  // Calculate fee (0.1%)
  const fee = total * 0.001;
  const totalWithFee = total + fee;

  // Validation
  const isValid = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return false;
    if (type === 'limit' || type === 'stop-limit') { // Adjusted for stop-limit
      const prc = parseFloat(price);
      if (!prc || prc <= 0) return false;
    }
    if (type === 'stop-limit' || type === 'stop-market') { // Check trigger price for stop orders
        const trigPrice = parseFloat(triggerPrice);
        if (!trigPrice || trigPrice <= 0) return false;
    }
    if (side === 'buy' && totalWithFee > balance) return false;
    return true;
  }, [amount, price, type, side, totalWithFee, balance, triggerPrice]); // Added triggerPrice to dependencies

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
        ...((type === 'stop-limit' || type === 'stop-market') && { triggerPrice: parseFloat(triggerPrice) }), // Added for Stop orders
        ...(type === 'stop-limit' && { limitPrice: parseFloat(price) }), // Added for Stop-Limit
      });

      toast.success(`${side === 'buy' ? 'Buy' : 'Sell'} order placed!`);
      setAmount('');
      setPrice(currentPrice.toString()); // Reset price input
      setTriggerPrice(''); // Reset trigger price
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
        <button
          onClick={() => setType('stop-limit')}
          className={`flex-1 py-2 rounded ${
            type === 'stop-limit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Stop-Limit
        </button>
        <button
          onClick={() => setType('stop-market')}
          className={`flex-1 py-2 rounded ${
            type === 'stop-market'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Stop-Market
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
        {/* Trigger Price input (Stop orders only) */}
        {(type === 'stop-limit' || type === 'stop-market') && (
            <div>
                <label className="block text-sm font-medium mb-1">
                    Trigger Price ({market.quoteAsset})
                </label>
                <Input
                    type="number"
                    step="0.01"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                    placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {type === 'stop-limit'
                        ? `When market price reaches ${triggerPrice || 'X'} ${market.quoteAsset}, a Limit order will be placed at ${price || 'Y'} ${market.quoteAsset}.`
                        : `When market price reaches ${triggerPrice || 'X'} ${market.quoteAsset}, a Market order will be placed.`
                    }
                </p>
            </div>
        )}

        {/* Price input (limit orders only) */}
        {(type === 'limit' || type === 'stop-limit') && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {type === 'limit' ? 'Price' : 'Limit Price'} ({market.quoteAsset})
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toString()}
              disabled={type === 'stop-market'} // Disable price input for stop-market
            />
            {type === 'limit' && (
                <p className="text-xs text-gray-500 mt-1">
                  Market: ${currentPrice.toLocaleString()}
                </p>
            )}
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
        {type === 'market' && ( // Market order warning
            <p className="text-xs text-yellow-500 mt-1">
                Execution price may differ from estimated price due to market conditions.
            </p>
        )}
        {(type === 'stop-limit' || type === 'stop-market') && ( // Stop order warning
            <p className="text-xs text-yellow-500 mt-1">
                A confirmation popup for risk disclosure will be shown for stop orders.
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
export type OrderType = 'market' | 'limit' | 'stop-limit' | 'stop-market'; // Updated
export type OrderStatus = 'new' | 'partially_filled' | 'filled' | 'cancelled' | 'triggered'; // Updated

export interface Order {
  id: string;
  userId: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  price?: number;          // Null for market orders
  triggerPrice?: number;   // Added for Stop orders
  limitPrice?: number;     // Added for Stop-Limit orders
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
  triggerPrice?: number;   // Added for Stop orders
  limitPrice?: number;     // Added for Stop-Limit orders
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
import { useMediaQuery } from '@/features/shared/hooks/useMediaQuery';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'; // Assuming these imports

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
import { Input } from '@/components/ui/input'; // Corrected import path
import { Button } from '@/components/ui/button'; // Corrected import path
import { toast } from 'react-hot-toast'; // Assuming react-hot-toast is installed
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
  const [triggerPrice, setTriggerPrice] = useState(''); // Added for Stop orders

  const placeOrder = usePlaceOrder();

  // Calculate total cost
  const total = useMemo(() => {
    const amt = parseFloat(amount) || 0;
    const prc = type === 'market' || type === 'stop-market' ? currentPrice : (parseFloat(price) || 0); // Adjusted for stop-market
    return amt * prc;
  }, [amount, price, type, currentPrice]);

  // Calculate fee (0.1%)
  const fee = total * 0.001;
  const totalWithFee = total + fee;

  // Validation
  const isValid = useMemo(() => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return false;
    if (type === 'limit' || type === 'stop-limit') { // Adjusted for stop-limit
      const prc = parseFloat(price);
      if (!prc || prc <= 0) return false;
    }
    if (type === 'stop-limit' || type === 'stop-market') { // Check trigger price for stop orders
        const trigPrice = parseFloat(triggerPrice);
        if (!trigPrice || trigPrice <= 0) return false;
    }
    if (side === 'buy' && totalWithFee > balance) return false;
    return true;
  }, [amount, price, type, side, totalWithFee, balance, triggerPrice]); // Added triggerPrice to dependencies

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
        ...((type === 'stop-limit' || type === 'stop-market') && { triggerPrice: parseFloat(triggerPrice) }), // Added for Stop orders
        ...(type === 'stop-limit' && { limitPrice: parseFloat(price) }), // Added for Stop-Limit
      });

      toast.success(`${side === 'buy' ? 'Buy' : 'Sell'} order placed!`);
      setAmount('');
      setPrice(currentPrice.toString()); // Reset price input
      setTriggerPrice(''); // Reset trigger price
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
        <button
          onClick={() => setType('stop-limit')}
          className={`flex-1 py-2 rounded ${
            type === 'stop-limit'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Stop-Limit
        </button>
        <button
          onClick={() => setType('stop-market')}
          className={`flex-1 py-2 rounded ${
            type === 'stop-market'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          Stop-Market
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
        {/* Trigger Price input (Stop orders only) */}
        {(type === 'stop-limit' || type === 'stop-market') && (
            <div>
                <label className="block text-sm font-medium mb-1">
                    Trigger Price ({market.quoteAsset})
                </label>
                <Input
                    type="number"
                    step="0.01"
                    value={triggerPrice}
                    onChange={(e) => setTriggerPrice(e.target.value)}
                    placeholder="0.00"
                />
                <p className="text-xs text-gray-500 mt-1">
                    {type === 'stop-limit'
                        ? `When market price reaches ${triggerPrice || 'X'} ${market.quoteAsset}, a Limit order will be placed at ${price || 'Y'} ${market.quoteAsset}.`
                        : `When market price reaches ${triggerPrice || 'X'} ${market.quoteAsset}, a Market order will be placed.`
                    }
                </p>
            </div>
        )}

        {/* Price input (limit orders only) */}
        {(type === 'limit' || type === 'stop-limit') && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {type === 'limit' ? 'Price' : 'Limit Price'} ({market.quoteAsset})
            </label>
            <Input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={currentPrice.toString()}
              disabled={type === 'stop-market'} // Disable price input for stop-market
            />
            {type === 'limit' && (
                <p className="text-xs text-gray-500 mt-1">
                  Market: ${currentPrice.toLocaleString()}
                </p>
            )}
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
        {type === 'market' && ( // Market order warning
            <p className="text-xs text-yellow-500 mt-1">
                Execution price may differ from estimated price due to market conditions.
            </p>
        )}
        {(type === 'stop-limit' || type === 'stop-market') && ( // Stop order warning
            <p className="text-xs text-yellow-500 mt-1">
                A confirmation popup for risk disclosure will be shown for stop orders.
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
import { toast } from 'react-hot-toast'; // Import toast

// Mock react-router-dom's useNavigate
const mockedUseNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedUseNavigate,
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

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
  afterEach(() => {
    jest.clearAllMocks();
  });

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

  it('should show trigger price input for stop orders', () => {
    render(
      <OrderForm
        market={mockMarket}
        balance={50000}
        currentPrice={45000}
      />,
      { wrapper: Wrapper }
    );

    const stopLimitButton = screen.getByText('Stop-Limit');
    fireEvent.click(stopLimitButton);

    expect(screen.getByLabelText(/trigger price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/limit price/i)).toBeInTheDocument(); // Limit price also for Stop-Limit
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
import type { OrderBookEntry } from '../types'; // Import OrderBookEntry

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
// Updated schema to include stop orders
const orderSchema = z.object({
  symbol: z.string().regex(/^[A-Z]+-[A-Z]+$/),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit', 'stop-limit', 'stop-market']), // Updated enum
  amount: z.number().positive().min(0.00000001),
  price: z.number().positive().optional(),
  triggerPrice: z.number().positive().optional(), // Added
  limitPrice: z.number().positive().optional(), // Added
}).refine(data => {
    // Conditional validation for limit and stop-limit orders
    if (data.type === 'limit' || data.type === 'stop-limit') {
        return data.price !== undefined && data.price > 0;
    }
    return true;
}, {
    message: "Price is required for limit and stop-limit orders",
    path: ["price"],
}).refine(data => {
    // Conditional validation for stop orders
    if (data.type === 'stop-limit' || data.type === 'stop-market') {
        return data.triggerPrice !== undefined && data.triggerPrice > 0;
    }
    return true;
}, {
    message: "Trigger price is required for stop orders",
    path: ["triggerPrice"],
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
import { useThrottle } from '@/features/shared/hooks/useThrottle'; // Corrected import path

const throttledSubmit = useThrottle(handleSubmit, 1000); // 1 second
```

---

## 12. Future Enhancements

**Post-Pilot Features:**
- [ ] Advanced order types (OCO)
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