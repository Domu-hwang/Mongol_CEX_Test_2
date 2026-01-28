import React from "react";
import { ChevronDown, TrendingDown, TrendingUp, Star } from "lucide-react";
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
  const baseSymbol = symbol.split("-")[0] || symbol;
  const quoteSymbol = symbol.split("-")[1] || "USDT";

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
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
        <button
          onClick={onSymbolClick}
          className="flex items-center gap-1 font-semibold text-foreground hover:text-primary transition-colors"
        >
          <span className="text-sm">{symbol}</span>
          <ChevronDown className="h-3 w-3" />
        </button>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-lg font-bold",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            {formatPrice(price)}
          </span>
          <div
            className={cn(
              "flex items-center gap-0.5",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="text-xs font-medium">
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center w-full h-[56.5px] bg-[#0B0E11] rounded-lg py-1 px-3">
      {/* Left section: Favorite, Symbol, OG Price */}
      <div className="flex items-center gap-3 flex-grow">
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full border border-[#333B47] text-[#4F5867] hover:text-foreground hover:border-foreground transition-colors"
          aria-label="Toggle favorite"
        >
          <Star className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-[#333B47] overflow-hidden bg-[#0F1117] flex items-center justify-center">
            <img
              src="https://cryptologos.cc/logos/tether-usdt-logo.png?v=026"
              alt={`${baseSymbol} logo`}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-sans text-base font-semibold leading-5 text-[#EAECEF] truncate">
                {baseSymbol}/{quoteSymbol}
              </span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-[#2B3139] text-[#C1C7D0] uppercase">
                Spot
              </span>
            </div>
            <span className="font-sans text-[11px] leading-4 text-[#707A8A]">
              OG Price
            </span>
          </div>
        </div>
      </div>

      {/* Middle section: Current Price and Change */}
      <div className="flex flex-col min-w-[96px] w-[25%] flex-shrink-0">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "font-sans text-xl font-semibold leading-6",
              isPositive ? "text-success" : "text-destructive"
            )}
          >
            {price.toFixed(3)}
          </span>
          <div
            className={cn(
              "flex items-center gap-1 px-1 py-0.5 rounded",
              isPositive ? "text-success bg-success/10" : "text-destructive bg-destructive/10"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span className="text-[11px] leading-4">
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-[#EAECEF]">
          <span>$</span>
          <span>{price.toFixed(8)}</span>
        </div>
      </div>

      {/* Right section: 24h stats */}
      <div className="flex items-center gap-4 text-xs flex-nowrap flex-shrink-0 justify-end">
        <div className="flex flex-col items-end min-w-[96px]">
          <span className="text-[#707A8A]">24h Chg</span>
          <div className="flex items-center gap-2">
            <span className={cn(isPositive ? "text-success" : "text-destructive")}>
              {priceChange > 0
                ? `+${priceChange.toFixed(3)}`
                : priceChange.toFixed(3)}
            </span>
            <span className={cn(isPositive ? "text-success" : "text-destructive")}>
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end min-w-[88px]">
          <span className="text-[#707A8A]">24h High</span>
          <span className="text-[#EAECEF]">{formatPrice(high24h)}</span>
        </div>

        <div className="flex flex-col items-end min-w-[88px]">
          <span className="text-[#707A8A]">24h Low</span>
          <span className="text-[#EAECEF]">{formatPrice(low24h)}</span>
        </div>

        <div className="flex flex-col items-end min-w-[110px]">
          <span className="text-[#707A8A]">24h Vol({baseSymbol})</span>
          <span className="text-[#EAECEF]">{formatVolume(volume24h)}</span>
        </div>

        <div className="flex flex-col items-end min-w-[118px]">
          <span className="text-[#707A8A]">24h Vol({quoteSymbol})</span>
          <span className="text-[#EAECEF]">{formatVolume(volume24h)}</span>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;