import { useState, useEffect } from 'react';
import { MarketSelector } from './MarketSelector';
import { CandlestickChart } from './CandlestickChart';

interface MarketData {
    price: number;
    change24h: number;
    changePercent: number;
    volume24h: number;
    high24h: number;
    low24h: number;
}

export const PriceChart = () => {
    const [marketData, setMarketData] = useState<MarketData>({
        price: 43682.67,
        change24h: -70.45,
        changePercent: -0.16,
        volume24h: 836879051.44,
        high24h: 45426.45,
        low24h: 43342.16,
    });

    // Simulate real-time price updates
    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prev => {
                const priceChange = (Math.random() - 0.5) * 100;
                const newPrice = prev.price + priceChange;
                const newChange = newPrice - 43753.12; // Base price for 24h change
                const newChangePercent = (newChange / 43753.12) * 100;

                return {
                    ...prev,
                    price: parseFloat(newPrice.toFixed(2)),
                    change24h: parseFloat(newChange.toFixed(2)),
                    changePercent: parseFloat(newChangePercent.toFixed(2)),
                };
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const isPositive = marketData.changePercent >= 0;
    const priceColorClass = isPositive ? 'text-emerald-500' : 'text-red-500';

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatVolume = (value: number) => {
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return formatCurrency(value);
    };

    return (
        <div className="w-full h-full relative bg-card/50 flex flex-col">
            {/* Header Overlay */}
            <div className="w-full p-2 border-b border-border bg-card flex items-center justify-between z-10 text-xs">
                <div className="flex items-center gap-4">
                    {/* Market Pair Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-lg font-bold text-foreground cursor-pointer hover:text-primary transition-colors">
                            <span>BTC-USD</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 transition-transform group-hover:rotate-180"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {/* Dropdown content */}
                        <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-20 hidden group-hover:block">
                            <div className="w-[280px] max-h-[300px] overflow-y-auto">
                                <MarketSelector />
                            </div>
                        </div>
                    </div>

                    {/* Current Price with animation */}
                    <div className="flex items-center gap-2">
                        <span className={`text-2xl font-bold ${priceColorClass} transition-colors duration-300`}>
                            {formatCurrency(marketData.price)}
                        </span>
                        <div className={`flex items-center gap-1 ${priceColorClass}`}>
                            <span className="text-sm">
                                {isPositive ? '▲' : '▼'}
                            </span>
                            <span className="font-medium">
                                {isPositive ? '+' : ''}{marketData.changePercent.toFixed(2)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Market Stats */}
                <div className="flex items-center gap-6 text-xs">
                    <div className="flex flex-col items-end">
                        <span className="text-muted-foreground">24h Volume</span>
                        <span className="text-foreground font-medium">{formatVolume(marketData.volume24h)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-muted-foreground">24h High</span>
                        <span className="text-emerald-500 font-medium">{formatCurrency(marketData.high24h)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-muted-foreground">24h Low</span>
                        <span className="text-red-500 font-medium">{formatCurrency(marketData.low24h)}</span>
                    </div>
                </div>
            </div>

            {/* Candlestick Chart */}
            <div className="flex-1 relative">
                <CandlestickChart />
            </div>
        </div>
    );
};
