import React from "react";
import { ChevronDown, TrendingDown, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenInfoProps {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangeAmount?: number;
  volume24h: number;
  volume24hQuote?: number;
  high24h: number;
  low24h: number;
  networks?: string;
  tokenTags?: string[];
  onSymbolClick?: () => void;
  variant?: "default" | "compact";
}

export const TokenInfo = ({
  symbol,
  price,
  priceChange,
  priceChangeAmount,
  volume24h,
  volume24hQuote,
  high24h,
  low24h,
  networks = "BTC (5)",
  tokenTags = ["POW", "Payments", "Vol", "Hot", "Price Protection"],
  onSymbolClick,
  variant = "default",
}: TokenInfoProps) => {
  const isPositive = priceChange >= 0;
  const isCompact = variant === "compact";
  const baseSymbol = symbol.split("-")[0] || symbol;
  const quoteSymbol = symbol.split("-")[1] || "USDT";

  const formatNumber = (value: number, decimals: number = 2) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const getTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      POW: "bg-[#F0B90B] text-black",
      Payments: "bg-[#1E88E5] text-white",
      Vol: "bg-[#8B5CF6] text-white",
      Hot: "bg-[#F23645] text-white",
      "Price Protection": "bg-[#00C853] text-white",
    };
    return colors[tag] || "bg-[#2B3139] text-[#C1C7D0]";
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

  const actualPriceChange = priceChangeAmount ?? (price * priceChange / 100);
  const actualVolQuote = volume24hQuote ?? (volume24h * price);

  return (
    <div className="flex items-center w-full h-[56px] bg-[#0B0E11] py-2 px-4 gap-6">
      {/* Favorite Star */}
      <button
        className="text-[#4F5867] hover:text-[#F0B90B] transition-colors flex-shrink-0"
        aria-label="Toggle favorite"
      >
        <Star className="w-4 h-4" />
      </button>

      {/* Token Icon and Symbol */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-full overflow-hidden bg-[#F7931A] flex items-center justify-center">
          <img
            src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=026"
            alt={`${baseSymbol} logo`}
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex flex-col">
          <span className="font-sans text-sm font-semibold text-[#EAECEF]">
            {baseSymbol}/{quoteSymbol}
          </span>
          <button
            onClick={onSymbolClick}
            className="font-sans text-[11px] text-[#707A8A] hover:text-[#F0B90B] transition-colors text-left"
          >
            Bitcoin Price <ChevronDown className="w-3 h-3 inline" />
          </button>
        </div>
      </div>

      {/* Current Price */}
      <div className="flex flex-col flex-shrink-0">
        <span
          className={cn(
            "font-sans text-xl font-semibold",
            isPositive ? "text-[#0ECB81]" : "text-[#F6465D]"
          )}
        >
          {formatNumber(price, 2)}
        </span>
        <span className="font-sans text-[11px] text-[#707A8A]">
          ${formatNumber(price, 2)}
        </span>
      </div>

      {/* 24h Chg */}
      <div className="flex flex-col flex-shrink-0">
        <span className="font-sans text-[11px] text-[#707A8A]">24h Chg</span>
        <span className={cn(
          "font-sans text-xs",
          isPositive ? "text-[#0ECB81]" : "text-[#F6465D]"
        )}>
          {formatNumber(actualPriceChange, 2)} {isPositive ? "+" : ""}{priceChange.toFixed(2)}%
        </span>
      </div>

      {/* 24h High */}
      <div className="flex flex-col flex-shrink-0">
        <span className="font-sans text-[11px] text-[#707A8A]">24h High</span>
        <span className="font-sans text-xs text-[#EAECEF]">{formatNumber(high24h, 2)}</span>
      </div>

      {/* 24h Low */}
      <div className="flex flex-col flex-shrink-0">
        <span className="font-sans text-[11px] text-[#707A8A]">24h Low</span>
        <span className="font-sans text-xs text-[#EAECEF]">{formatNumber(low24h, 2)}</span>
      </div>

      {/* 24h Vol (Base) */}
      <div className="flex flex-col flex-shrink-0">
        <span className="font-sans text-[11px] text-[#707A8A]">24h Vol({baseSymbol})</span>
        <span className="font-sans text-xs text-[#EAECEF]">{formatVolume(volume24h)}</span>
      </div>

      {/* 24h Vol (Quote) */}
      <div className="flex flex-col flex-shrink-0">
        <span className="font-sans text-[11px] text-[#707A8A]">24h Vol({quoteSymbol})</span>
        <span className="font-sans text-xs text-[#EAECEF]">{formatVolume(actualVolQuote)}</span>
      </div>

      {/* Networks */}
      <div className="flex flex-col flex-shrink-0">
        <span className="font-sans text-[11px] text-[#707A8A]">Networks</span>
        <span className="font-sans text-xs text-[#EAECEF]">{networks}</span>
      </div>

      {/* Token Tags */}
      <div className="flex flex-col flex-shrink-0">
        <span className="font-sans text-[11px] text-[#707A8A]">Token Tags</span>
        <div className="flex items-center gap-1 flex-wrap">
          {tokenTags.map((tag, index) => (
            <span
              key={index}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-medium",
                getTagColor(tag)
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;