import { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';

// Generate mock candlestick data
const generateCandlestickData = (count: number): CandlestickData<Time>[] => {
    const data: CandlestickData<Time>[] = [];
    let basePrice = 43500;
    const now = Math.floor(Date.now() / 1000);
    const interval = 60 * 15; // 15-minute candles

    for (let i = count; i >= 0; i--) {
        const time = (now - i * interval) as Time;
        const volatility = Math.random() * 200 + 50;
        const direction = Math.random() > 0.5 ? 1 : -1;

        const open = basePrice + (Math.random() - 0.5) * 100;
        const close = open + direction * volatility * Math.random();
        const high = Math.max(open, close) + Math.random() * 100;
        const low = Math.min(open, close) - Math.random() * 100;

        data.push({ time, open, high, low, close });
        basePrice = close;
    }

    return data;
};

// Generate mock volume data
const generateVolumeData = (candleData: CandlestickData<Time>[]) => {
    return candleData.map((candle) => ({
        time: candle.time,
        value: Math.random() * 1000000 + 500000,
        color: candle.close >= candle.open ? 'rgba(16, 185, 129, 0.5)' : 'rgba(239, 68, 68, 0.5)',
    }));
};

interface TimeframeOption {
    label: string;
    value: string;
}

const timeframes: TimeframeOption[] = [
    { label: '1m', value: '1m' },
    { label: '5m', value: '5m' },
    { label: '15m', value: '15m' },
    { label: '1H', value: '1h' },
    { label: '4H', value: '4h' },
    { label: '1D', value: '1d' },
    { label: '1W', value: '1w' },
];

interface ChartIndicator {
    label: string;
    active: boolean;
}

export const CandlestickChart = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
    const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

    const [selectedTimeframe, setSelectedTimeframe] = useState('15m');
    const [indicators, setIndicators] = useState<ChartIndicator[]>([
        { label: 'MA', active: false },
        { label: 'EMA', active: false },
        { label: 'BOLL', active: false },
        { label: 'VOL', active: true },
    ]);
    const [crosshairData, setCrosshairData] = useState<{
        time: string;
        open: number;
        high: number;
        low: number;
        close: number;
        change: number;
        changePercent: number;
    } | null>(null);

    const toggleIndicator = (label: string) => {
        setIndicators(prev =>
            prev.map(ind =>
                ind.label === label ? { ...ind, active: !ind.active } : ind
            )
        );
    };

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Create chart
        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: 'transparent' },
                textColor: '#9ca3af',
            },
            grid: {
                vertLines: { color: 'rgba(42, 46, 57, 0.5)' },
                horzLines: { color: 'rgba(42, 46, 57, 0.5)' },
            },
            crosshair: {
                mode: 1,
                vertLine: {
                    color: '#6b7280',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#374151',
                },
                horzLine: {
                    color: '#6b7280',
                    width: 1,
                    style: 2,
                    labelBackgroundColor: '#374151',
                },
            },
            rightPriceScale: {
                borderColor: 'rgba(42, 46, 57, 0.8)',
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.2,
                },
            },
            timeScale: {
                borderColor: 'rgba(42, 46, 57, 0.8)',
                timeVisible: true,
                secondsVisible: false,
            },
            handleScroll: {
                mouseWheel: true,
                pressedMouseMove: true,
                horzTouchDrag: true,
                vertTouchDrag: false,
            },
            handleScale: {
                axisPressedMouseMove: true,
                mouseWheel: true,
                pinch: true,
            },
        });

        chartRef.current = chart;

        // Add candlestick series
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderUpColor: '#10b981',
            borderDownColor: '#ef4444',
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
        });

        candlestickSeriesRef.current = candlestickSeries;

        // Add volume series
        const volumeSeries = chart.addHistogramSeries({
            priceFormat: { type: 'volume' },
            priceScaleId: 'volume',
        });

        chart.priceScale('volume').applyOptions({
            scaleMargins: {
                top: 0.85,
                bottom: 0,
            },
        });

        volumeSeriesRef.current = volumeSeries;

        // Generate and set data
        const candleData = generateCandlestickData(200);
        const volumeData = generateVolumeData(candleData);

        candlestickSeries.setData(candleData);
        volumeSeries.setData(volumeData);

        // Fit content
        chart.timeScale().fitContent();

        // Subscribe to crosshair move
        chart.subscribeCrosshairMove((param) => {
            if (param.time && param.seriesData.size > 0) {
                const candleData = param.seriesData.get(candlestickSeries) as CandlestickData<Time>;
                if (candleData) {
                    const change = candleData.close - candleData.open;
                    const changePercent = (change / candleData.open) * 100;

                    const date = new Date((param.time as number) * 1000);
                    const timeStr = date.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    });

                    setCrosshairData({
                        time: timeStr,
                        open: candleData.open,
                        high: candleData.high,
                        low: candleData.low,
                        close: candleData.close,
                        change,
                        changePercent,
                    });
                }
            } else {
                setCrosshairData(null);
            }
        });

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                    height: chartContainerRef.current.clientHeight,
                });
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(chartContainerRef.current);

        // Simulate real-time updates
        const updateInterval = setInterval(() => {
            if (candlestickSeriesRef.current) {
                const lastData = candleData[candleData.length - 1];
                const newClose = lastData.close + (Math.random() - 0.5) * 50;
                const updatedCandle: CandlestickData<Time> = {
                    time: lastData.time,
                    open: lastData.open,
                    high: Math.max(lastData.high, newClose),
                    low: Math.min(lastData.low, newClose),
                    close: newClose,
                };
                candlestickSeriesRef.current.update(updatedCandle);
                candleData[candleData.length - 1] = updatedCandle;
            }
        }, 1000);

        return () => {
            clearInterval(updateInterval);
            resizeObserver.disconnect();
            chart.remove();
        };
    }, [selectedTimeframe]);

    return (
        <div className="w-full h-full flex flex-col bg-card/50">
            {/* Chart Controls */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-border">
                {/* Timeframe Selector */}
                <div className="flex items-center gap-1">
                    {timeframes.map((tf) => (
                        <button
                            key={tf.value}
                            onClick={() => setSelectedTimeframe(tf.value)}
                            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                                selectedTimeframe === tf.value
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                        >
                            {tf.label}
                        </button>
                    ))}
                </div>

                {/* Indicators */}
                <div className="flex items-center gap-1">
                    {indicators.map((ind) => (
                        <button
                            key={ind.label}
                            onClick={() => toggleIndicator(ind.label)}
                            className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                                ind.active
                                    ? 'bg-primary/20 text-primary border border-primary/50'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                            }`}
                        >
                            {ind.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* OHLC Display */}
            {crosshairData && (
                <div className="absolute top-14 left-3 z-10 flex items-center gap-4 text-xs bg-card/90 px-2 py-1 rounded">
                    <span className="text-muted-foreground">{crosshairData.time}</span>
                    <span>
                        <span className="text-muted-foreground">O:</span>{' '}
                        <span className="text-foreground">{crosshairData.open.toFixed(2)}</span>
                    </span>
                    <span>
                        <span className="text-muted-foreground">H:</span>{' '}
                        <span className="text-foreground">{crosshairData.high.toFixed(2)}</span>
                    </span>
                    <span>
                        <span className="text-muted-foreground">L:</span>{' '}
                        <span className="text-foreground">{crosshairData.low.toFixed(2)}</span>
                    </span>
                    <span>
                        <span className="text-muted-foreground">C:</span>{' '}
                        <span className="text-foreground">{crosshairData.close.toFixed(2)}</span>
                    </span>
                    <span className={crosshairData.change >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                        {crosshairData.change >= 0 ? '+' : ''}
                        {crosshairData.change.toFixed(2)} ({crosshairData.changePercent.toFixed(2)}%)
                    </span>
                </div>
            )}

            {/* Chart Container */}
            <div ref={chartContainerRef} className="flex-1 relative" />
        </div>
    );
};
