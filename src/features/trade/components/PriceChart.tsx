import { CandlestickChart } from './CandlestickChart';

interface PriceChartProps {
    symbol?: string;
}

export const PriceChart = ({ symbol = 'BTC-USD' }: PriceChartProps) => {
    return (
        <div className="w-full h-full relative bg-card/50 flex flex-col">
            {/* Candlestick Chart */}
            <div className="flex-1 relative">
                <CandlestickChart />
            </div>
        </div>
    );
};
