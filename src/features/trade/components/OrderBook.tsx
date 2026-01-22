import { useState, useEffect, useCallback, useMemo } from 'react';

interface Order {
    price: number;
    amount: number;
    total: number;
}

interface OrderBookProps {
    onPriceClick?: (price: number) => void;
    onAmountClick?: (amount: number) => void;
}

// Generate realistic mock order book data
const generateOrderBookData = (midPrice: number) => {
    const asks: Order[] = [];
    const bids: Order[] = [];

    // Generate asks (sell orders) - prices above mid price
    let cumulativeAsk = 0;
    for (let i = 0; i < 15; i++) {
        const price = midPrice + (i + 1) * 0.001;
        const amount = Math.random() * 25 + 1;
        cumulativeAsk += amount * price;
        asks.push({
            price: parseFloat(price.toFixed(4)),
            amount: parseFloat(amount.toFixed(2)),
            total: parseFloat(cumulativeAsk.toFixed(2)),
        });
    }

    // Generate bids (buy orders) - prices below mid price
    let cumulativeBid = 0;
    for (let i = 0; i < 15; i++) {
        const price = midPrice - (i + 1) * 0.001;
        const amount = Math.random() * 25 + 1;
        cumulativeBid += amount * price;
        bids.push({
            price: parseFloat(price.toFixed(4)),
            amount: parseFloat(amount.toFixed(2)),
            total: parseFloat(cumulativeBid.toFixed(2)),
        });
    }

    return { asks: asks.reverse(), bids };
};

type DisplayMode = 'both' | 'bids' | 'asks';

export const OrderBook = ({ onPriceClick, onAmountClick }: OrderBookProps) => {
    const [midPrice, setMidPrice] = useState(0.7680);
    const [prevMidPrice, setPrevMidPrice] = useState(0.7680);
    const [orderBook, setOrderBook] = useState(() => generateOrderBookData(0.7680));
    const [displayMode, setDisplayMode] = useState<DisplayMode>('both');
    const [hoveredRow, setHoveredRow] = useState<{ side: 'ask' | 'bid'; index: number } | null>(null);
    const [precision, setPrecision] = useState(4);

    // Calculate max values for depth visualization
    const maxAskAmount = useMemo(() => Math.max(...orderBook.asks.map(o => o.amount)), [orderBook.asks]);
    const maxBidAmount = useMemo(() => Math.max(...orderBook.bids.map(o => o.amount)), [orderBook.bids]);
    const maxAmount = Math.max(maxAskAmount, maxBidAmount);

    // Calculate cumulative totals for depth
    const asksWithDepth = useMemo(() => {
        let cumulative = 0;
        return orderBook.asks.map(order => {
            cumulative += order.amount;
            return { ...order, cumulative };
        });
    }, [orderBook.asks]);

    const bidsWithDepth = useMemo(() => {
        let cumulative = 0;
        return orderBook.bids.map(order => {
            cumulative += order.amount;
            return { ...order, cumulative };
        });
    }, [orderBook.bids]);

    const maxCumulative = Math.max(
        asksWithDepth[asksWithDepth.length - 1]?.cumulative || 0,
        bidsWithDepth[bidsWithDepth.length - 1]?.cumulative || 0
    );

    // Simulate real-time updates
    useEffect(() => {
        const interval = setInterval(() => {
            setOrderBook(prev => {
                const newBook = { ...prev };

                // Randomly update some orders
                newBook.asks = prev.asks.map(order => ({
                    ...order,
                    amount: Math.max(0.1, order.amount + (Math.random() - 0.5) * 2),
                }));
                newBook.bids = prev.bids.map(order => ({
                    ...order,
                    amount: Math.max(0.1, order.amount + (Math.random() - 0.5) * 2),
                }));

                // Occasionally update mid price
                if (Math.random() > 0.7) {
                    const priceChange = (Math.random() - 0.5) * 0.002;
                    setPrevMidPrice(midPrice);
                    setMidPrice(prev => parseFloat((prev + priceChange).toFixed(4)));
                }

                return newBook;
            });
        }, 500);

        return () => clearInterval(interval);
    }, [midPrice]);

    const handlePriceClick = useCallback((price: number) => {
        onPriceClick?.(price);
    }, [onPriceClick]);

    const handleAmountClick = useCallback((amount: number) => {
        onAmountClick?.(amount);
    }, [onAmountClick]);

    const priceDirection = midPrice > prevMidPrice ? 'up' : midPrice < prevMidPrice ? 'down' : 'neutral';

    const formatPrice = (price: number) => price.toFixed(precision);
    const formatAmount = (amount: number) => amount.toFixed(2);

    const renderOrderRow = (
        order: Order & { cumulative: number },
        index: number,
        side: 'ask' | 'bid'
    ) => {
        const isHovered = hoveredRow?.side === side && hoveredRow?.index === index;
        const depthPercent = (order.cumulative / maxCumulative) * 100;
        const amountPercent = (order.amount / maxAmount) * 100;

        const bgColor = side === 'ask' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)';
        const hoverBgColor = side === 'ask' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(16, 185, 129, 0.25)';
        const textColor = side === 'ask' ? 'text-red-500' : 'text-emerald-500';

        return (
            <div
                key={`${side}-${index}`}
                className={`relative flex items-center justify-between px-2 py-1 cursor-pointer transition-all duration-150 ${
                    isHovered ? 'scale-[1.01]' : ''
                }`}
                style={{
                    background: isHovered ? hoverBgColor : 'transparent',
                }}
                onMouseEnter={() => setHoveredRow({ side, index })}
                onMouseLeave={() => setHoveredRow(null)}
            >
                {/* Depth visualization bar */}
                <div
                    className="absolute inset-y-0 transition-all duration-300"
                    style={{
                        width: `${depthPercent}%`,
                        background: bgColor,
                        left: side === 'bid' ? 0 : 'auto',
                        right: side === 'ask' ? 0 : 'auto',
                    }}
                />

                {/* Amount bar overlay */}
                <div
                    className="absolute inset-y-0 transition-all duration-200"
                    style={{
                        width: `${amountPercent}%`,
                        background: side === 'ask' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)',
                        left: side === 'bid' ? 0 : 'auto',
                        right: side === 'ask' ? 0 : 'auto',
                    }}
                />

                {/* Content */}
                <span
                    className={`relative z-10 font-mono ${textColor} hover:underline`}
                    onClick={() => handlePriceClick(order.price)}
                >
                    {formatPrice(order.price)}
                </span>
                <span
                    className="relative z-10 font-mono text-foreground hover:text-primary cursor-pointer"
                    onClick={() => handleAmountClick(order.amount)}
                >
                    {formatAmount(order.amount)}
                </span>
                <span className="relative z-10 font-mono text-muted-foreground">
                    {formatAmount(order.total)}
                </span>
            </div>
        );
    };

    return (
        <div className="h-full w-full flex flex-col text-xs select-none">
            {/* Header with controls */}
            <div className="p-2 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-1">
                    {/* Display mode toggle */}
                    <button
                        onClick={() => setDisplayMode('both')}
                        className={`p-1.5 rounded transition-colors ${
                            displayMode === 'both' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Show both"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="2" y="2" width="12" height="5" rx="1" opacity="0.5" />
                            <rect x="2" y="9" width="12" height="5" rx="1" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setDisplayMode('bids')}
                        className={`p-1.5 rounded transition-colors ${
                            displayMode === 'bids' ? 'bg-emerald-500/20 text-emerald-500' : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Bids only"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="2" y="2" width="12" height="12" rx="1" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setDisplayMode('asks')}
                        className={`p-1.5 rounded transition-colors ${
                            displayMode === 'asks' ? 'bg-red-500/20 text-red-500' : 'text-muted-foreground hover:text-foreground'
                        }`}
                        title="Asks only"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 16 16" fill="currentColor">
                            <rect x="2" y="2" width="12" height="12" rx="1" opacity="0.5" />
                        </svg>
                    </button>
                </div>

                {/* Precision selector */}
                <div className="flex items-center gap-1">
                    {[2, 3, 4].map(p => (
                        <button
                            key={p}
                            onClick={() => setPrecision(p)}
                            className={`px-1.5 py-0.5 rounded text-xs transition-colors ${
                                precision === p
                                    ? 'bg-primary/20 text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            {p}
                        </button>
                    ))}
                </div>
            </div>

            {/* Column headers */}
            <div className="px-2 py-1.5 border-b border-border text-muted-foreground flex justify-between bg-muted/30">
                <span>Price (USDT)</span>
                <span>Amount</span>
                <span>Total</span>
            </div>

            {/* Order book content */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Asks section */}
                {displayMode !== 'bids' && (
                    <div className={`overflow-y-auto ${displayMode === 'asks' ? 'flex-1' : 'flex-1'}`}>
                        <div className="flex flex-col-reverse">
                            {asksWithDepth.slice(displayMode === 'asks' ? 0 : -10).map((order, index) =>
                                renderOrderRow(order, index, 'ask')
                            )}
                        </div>
                    </div>
                )}

                {/* Mid-market price */}
                {displayMode === 'both' && (
                    <div
                        className={`py-2 px-3 text-center font-bold text-lg border-y border-border transition-colors duration-300 ${
                            priceDirection === 'up'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : priceDirection === 'down'
                                ? 'bg-red-500/10 text-red-500'
                                : 'bg-muted/20 text-foreground'
                        }`}
                    >
                        <div className="flex items-center justify-center gap-2">
                            <span className="font-mono">{midPrice.toFixed(4)}</span>
                            {priceDirection !== 'neutral' && (
                                <span className="text-sm">
                                    {priceDirection === 'up' ? '▲' : '▼'}
                                </span>
                            )}
                            <span className="text-xs text-muted-foreground">
                                ≈ ${(midPrice * 1).toFixed(4)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Bids section */}
                {displayMode !== 'asks' && (
                    <div className={`overflow-y-auto ${displayMode === 'bids' ? 'flex-1' : 'flex-1'}`}>
                        <div className="flex flex-col">
                            {bidsWithDepth.slice(0, displayMode === 'bids' ? undefined : 10).map((order, index) =>
                                renderOrderRow(order, index, 'bid')
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Footer with spread info */}
            <div className="px-2 py-1.5 border-t border-border text-muted-foreground flex justify-between bg-muted/30 text-xs">
                <span>Spread</span>
                <span className="font-mono">
                    {((orderBook.asks[orderBook.asks.length - 1]?.price || 0) - (orderBook.bids[0]?.price || 0)).toFixed(4)} (
                    {(
                        (((orderBook.asks[orderBook.asks.length - 1]?.price || 0) - (orderBook.bids[0]?.price || 0)) /
                            midPrice) *
                        100
                    ).toFixed(2)}
                    %)
                </span>
            </div>
        </div>
    );
};
