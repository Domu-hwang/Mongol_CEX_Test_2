import React, { useRef, useEffect, useState } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';

interface PriceChartProps {
    market: string;
}

const PriceChart: React.FC<PriceChartProps> = ({ market }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

    const [mockData, setMockData] = useState([
        { time: '2023-01-01', open: 10, high: 10.64, low: 9.77, close: 10.29 },
        { time: '2023-01-02', open: 10.29, high: 10.65, low: 9.49, close: 9.61 },
        { time: '2023-01-03', open: 9.61, high: 10.29, low: 9.50, close: 10.04 },
        { time: '2023-01-04', open: 10.04, high: 10.39, low: 9.61, close: 9.81 },
        { time: '2023-01-05', open: 9.81, high: 10.51, low: 9.71, close: 10.21 },
        { time: '2023-01-06', open: 10.21, high: 10.74, low: 10.11, close: 10.37 },
        { time: '2023-01-07', open: 10.37, high: 11.00, low: 10.21, close: 10.84 },
        { time: '2023-01-08', open: 10.84, high: 11.23, low: 10.71, close: 10.95 },
        { time: '2023-01-09', open: 10.95, high: 11.60, low: 10.85, close: 11.45 },
        { time: '2023-01-10', open: 11.45, high: 11.66, low: 10.91, close: 11.05 },
        { time: '2023-01-11', open: 11.05, high: 11.33, low: 10.79, close: 10.99 },
        { time: '2023-01-12', open: 10.99, high: 11.45, low: 10.69, close: 11.23 },
        { time: '2023-01-13', open: 11.23, high: 11.72, low: 11.09, close: 11.50 },
        { time: '2023-01-14', open: 11.50, high: 11.75, low: 11.19, close: 11.25 },
        { time: '2023-01-15', open: 11.25, high: 11.91, low: 11.11, close: 11.83 },
        { time: '2023-01-16', open: 11.83, high: 12.00, low: 11.65, close: 11.88 },
        { time: '2023-01-17', open: 11.88, high: 12.33, low: 11.75, close: 12.20 },
        { time: '2023-01-18', open: 12.20, high: 12.44, low: 11.95, close: 12.03 },
        { time: '2023-01-19', open: 12.03, high: 12.72, low: 11.99, close: 12.53 },
        { time: '2023-01-20', open: 12.53, high: 12.87, low: 12.15, close: 12.38 },
    ]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Get CSS variable values for theming
        const styles = getComputedStyle(document.documentElement);
        const cardBg = '#181a20'; // bg-card equivalent
        const textColor = '#848e9c'; // text-muted-foreground equivalent
        const borderColor = '#2f343c'; // border-border equivalent
        const successColor = '#0ecb81'; // success color
        const destructiveColor = '#f6465d'; // destructive color

        const chart = createChart(chartContainerRef.current, {
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            layout: {
                background: { color: cardBg },
                textColor: textColor,
            },
            grid: {
                vertLines: { color: borderColor },
                horzLines: { color: borderColor },
            },
            timeScale: {
                borderColor: borderColor,
            },
            rightPriceScale: {
                borderColor: borderColor,
            },
        });
        chartRef.current = chart;

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: successColor,
            downColor: destructiveColor,
            borderVisible: false,
            wickUpColor: successColor,
            wickDownColor: destructiveColor,
        });
        candlestickSeriesRef.current = candlestickSeries;

        candlestickSeries.setData(mockData);

        const handleResize = () => {
            if (chartContainerRef.current && chartRef.current) {
                chartRef.current.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        const interval = setInterval(() => {
            setMockData((prevData) => {
                const lastData = prevData[prevData.length - 1];
                const newTime = (new Date(lastData.time).getTime() / 1000) + 24 * 60 * 60;
                const newOpen = lastData.close;
                const newHigh = newOpen + Math.random() * 0.5;
                const newLow = newOpen - Math.random() * 0.5;
                const newClose = newOpen + (Math.random() - 0.5) * 1;

                const newCandle = {
                    time: new Date(newTime * 1000).toISOString().split('T')[0],
                    open: parseFloat(newOpen.toFixed(2)),
                    high: parseFloat(newHigh.toFixed(2)),
                    low: parseFloat(newLow.toFixed(2)),
                    close: parseFloat(newClose.toFixed(2)),
                };

                candlestickSeries.update(newCandle);
                return [...prevData, newCandle];
            });
        }, 3000);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (chartRef.current) {
                chartRef.current.remove();
                chartRef.current = null;
            }
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [market]);

    return (
        <div className="bg-card rounded-lg shadow-md p-4 h-[400px] flex flex-col justify-center border border-border">
            <h3 className="text-lg font-semibold mb-2 text-foreground">{market} Price Chart</h3>
            <div ref={chartContainerRef} className="flex-grow w-full h-full" />
        </div>
    );
};

export default PriceChart;
