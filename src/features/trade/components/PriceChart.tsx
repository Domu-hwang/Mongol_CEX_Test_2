import React from 'react';
// For now, this will be a placeholder component.
// In a real application, this would integrate with a charting library like Recharts or TradingView.

interface PriceChartProps {
    symbol: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ symbol }) => {
    return (
        <div className="flex items-center justify-center h-full bg-slate-100 rounded-lg text-slate-500">
            {symbol} Price Chart (Placeholder)
        </div>
    );
};

export default PriceChart;
