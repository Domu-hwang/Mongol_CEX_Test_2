import React from 'react';

interface Market {
    symbol: string;
    baseAsset: string;
    quoteAsset: string;
}

interface MarketSelectorProps {
    markets: Market[];
    selected: string;
    onChange: (symbol: string) => void;
}

const MarketSelector: React.FC<MarketSelectorProps> = ({ markets, selected, onChange }) => {
    return (
        <div className="flex items-center space-x-2">
            <label htmlFor="market-select" className="text-sm font-medium text-gray-400">
                Market:
            </label>
            <div className="relative">
                <select
                    id="market-select"
                    value={selected}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none rounded-lg border border-secondary-500 bg-secondary-700 px-4 py-1.5 pr-10 text-sm font-bold text-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 transition-all cursor-pointer hover:bg-secondary-600"
                >
                    {markets.map((market) => (
                        <option key={market.symbol} value={market.symbol} className="bg-secondary-700 text-[#eaecef]">
                            {market.symbol}
                        </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-primary-600">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default MarketSelector;
