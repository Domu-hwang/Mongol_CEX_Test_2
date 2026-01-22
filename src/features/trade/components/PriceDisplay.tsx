import React from 'react';

interface PriceDisplayProps {
    currentPrice: number;
    priceChange24h: number;
    priceChangePercent24h: number;
    market: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
    currentPrice,
    priceChange24h,
    priceChangePercent24h,
    market,
}) => {
    const isPositive = priceChange24h >= 0;
    const changeColorClass = isPositive ? 'text-success' : 'text-destructive';
    const arrow = isPositive ? '▲' : '▼';

    return (
        <div className="flex items-center space-x-4">
            <div className="text-left">
                <p className="text-muted-foreground text-sm">{market}</p>
                <p className="text-foreground text-3xl font-bold">
                    {currentPrice.toFixed(2)}
                </p>
            </div>
            <div className={`flex flex-col ${changeColorClass}`}>
                <span className="text-lg font-semibold">
                    {arrow} {priceChange24h.toFixed(2)}
                </span>
                <span className="text-sm">
                    ({priceChangePercent24h.toFixed(2)}%)
                </span>
            </div>
        </div>
    );
};

export default PriceDisplay;
