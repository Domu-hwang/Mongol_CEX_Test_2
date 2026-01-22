import React, { useState } from 'react';

const mockMarkets = [
    { id: 'BTC/USDT', base: 'BTC', quote: 'USDT' },
    { id: 'ETH/USDT', base: 'ETH', quote: 'USDT' },
    { id: 'XRP/USDT', base: 'XRP', quote: 'USDT' },
];

interface MarketSelectorProps {
    onSelectMarket: (marketId: string) => void;
    currentMarket: string;
}

const MarketSelector: React.FC<MarketSelectorProps> = ({ onSelectMarket, currentMarket }) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedMarket = mockMarkets.find(market => market.id === currentMarket);

    return (
        <div className="relative w-48">
            <button
                type="button"
                className="relative w-full cursor-default rounded-md border border-border bg-card py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="flex items-center">
                    <span className="ml-3 block truncate text-foreground">
                        {selectedMarket ? selectedMarket.id : 'Select Market'}
                    </span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                    <svg
                        className="h-5 w-5 text-muted-foreground"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <ul
                    className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-lg ring-1 ring-border focus:outline-none sm:text-sm"
                    tabIndex={-1}
                    role="listbox"
                    aria-labelledby="listbox-label"
                >
                    {mockMarkets.map((market) => (
                        <li
                            key={market.id}
                            className="relative cursor-default select-none py-2 pl-3 pr-9 text-popover-foreground hover:bg-primary hover:text-primary-foreground"
                            id={`market-option-${market.id}`}
                            role="option"
                            onClick={() => {
                                onSelectMarket(market.id);
                                setIsOpen(false);
                            }}
                        >
                            <div className="flex items-center">
                                <span className="ml-3 block truncate font-normal">{market.id}</span>
                            </div>
                            {market.id === currentMarket && (
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-primary">
                                    <svg
                                        className="h-5 w-5"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MarketSelector;
