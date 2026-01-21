import React from 'react';

interface PriceDisplayProps {
    price: number | null;
    change24h: number;
    isConnected: boolean;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ price, change24h, isConnected }) => {
    const changeColorClass = change24h >= 0 ? 'text-success-600' : 'text-danger-600';
    const formattedChange = `${change24h >= 0 ? '+' : ''}${change24h.toFixed(2)}%`;

    return (
        <div className="flex items-center gap-6">
            <div>
                <p className="text-2xl font-bold text-[#eaecef] tracking-tight">${price?.toLocaleString() || 'N/A'}</p>
                <p className={`text-xs font-medium ${changeColorClass} mt-0.5`}>
                    {formattedChange}
                </p>
            </div>
            {!isConnected && (
                <span className="text-xs px-2 py-1 bg-primary-600/10 text-primary-600 rounded border border-primary-600/20 animate-pulse">
                    Reconnecting...
                </span>
            )}
        </div>
    );
};

export default PriceDisplay;
