import { ChevronDown, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenInfoProps {
  symbol: string;
  price: number;
  priceChange: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  onSymbolClick?: () => void;
  variant?: "default" | "compact";
}

export const TokenInfo = ({
  symbol,
  price,
  priceChange,
  volume24h,
  high24h,
  low24h,
  onSymbolClick,
  variant = "default",
}: TokenInfoProps) => {
  const isPositive = priceChange >= 0;
  const isCompact = variant === "compact";

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  if (isCompact) {
    return (
      <div className="flex items-center justify-between w-full h-full px-3 py-2 bg-card">
        {/* Left: Symbol */}
        <button
          onClick={onSymbolClick}
          className="flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span className="text-sm">{symbol}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        {/* Right: Price and Change */}
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-lg font-bold",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {formatPrice(price)}
          </span>
          <div className={cn(
            "flex items-center gap-0.5",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">
              {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between w-full h-full px-4 bg-card">
      {/* Left side: Symbol and Price */}
      <div className="flex items-center gap-6">
        {/* Symbol with dropdown */}
        <button
          onClick={onSymbolClick}
          className="flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span className="text-base">{symbol}</span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {/* Current Price */}
        <span className={cn(
          "text-2xl font-bold",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {formatPrice(price)}
        </span>

        {/* Price Change */}
        <div className={cn(
          "flex items-center gap-1",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <span className="text-sm font-medium">
            {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Right side: 24h Stats */}
      <div className="flex items-center gap-8">
        {/* 24h Volume */}
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">24h Volume</span>
          <span className="text-sm font-medium text-foreground">
            {formatVolume(volume24h)}
          </span>
        </div>

        {/* 24h High */}
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">24h High</span>
          <span className="text-sm font-medium text-success">
            {formatPrice(high24h)}
          </span>
        </div>

        {/* 24h Low */}
        <div className="flex flex-col items-end">
          <span className="text-xs text-muted-foreground">24h Low</span>
          <span className="text-sm font-medium text-destructive">
            {formatPrice(low24h)}
          </span>
        </div>
      </div>
    </div>
  );
};
