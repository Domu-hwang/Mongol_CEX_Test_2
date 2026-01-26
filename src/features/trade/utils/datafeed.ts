// Mock data for demonstration
const mockHistory: Record<string, any[]> = {};
const subscriptions: Record<string, NodeJS.Timeout> = {};
const generateRandomCandle = (
    open: number,
    time: number,
    period: number
) => {
    const close = open + (Math.random() * 200 - 100); // price changes +/- 100
    const high = Math.max(open, close) + Math.random() * 50;
    const low = Math.min(open, close) - Math.random() * 50;
    const volume = Math.random() * 1000;

    return {
        time: time, // lightweight-charts uses seconds, not milliseconds
        low: parseFloat(low.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        open: parseFloat(open.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: parseFloat(volume.toFixed(2)),
    };
};

const getBars = (
    symbolInfo: any,
    resolution: any,
    rangeStartDate: number,
    rangeEndDate: number,
    onResult: (bars: any[], meta: any) => void,
    onError: (error: string) => void,
    firstDataRequest: boolean
) => {
    if (mockHistory[symbolInfo.name]?.length > 0 && !firstDataRequest) {
        onResult([], { noData: true });
        return;
    }

    const bars = [];
    let currentTime = rangeStartDate;
    let lastPrice = 45000; // Start price

    while (currentTime <= rangeEndDate) {
        const candle = generateRandomCandle(lastPrice, currentTime, resolution);
        bars.push(candle);
        lastPrice = candle.close;

        // Increment time based on resolution
        if (resolution === '1') currentTime += 60; // 1 minute
        else if (resolution === '5') currentTime += 5 * 60; // 5 minutes
        else if (resolution === '60') currentTime += 60 * 60; // 1 hour
        else if (resolution === '1D') currentTime += 24 * 60 * 60; // 1 day
        else break; // Unsupported resolution
    }

    mockHistory[symbolInfo.name] = bars;
    onResult(bars, { noData: false });
};

// Datafeed implementation
export const datafeed = {
    onReady: (callback: any) => {
        console.log('[onReady]: Method called!');
        setTimeout(() =>
            callback({
                supported_resolutions: ['1', '5', '60', '1D'],
                supports_group_request: false,
                supports_marks: false,
                supports_search: true,
                supports_timescale_marks: false,
                supports_time: true,
            })
            , 0);
    },

    resolveSymbol: (
        symbolName: string,
        onSymbolResolvedCallback: (symbolInfo: any) => void,
        onResolveErrorCallback: (error: string) => void
    ) => {
        console.log('[resolveSymbol]: Method called!', symbolName);
        setTimeout(() => {
            const symbolInfo = {
                name: symbolName,
                description: '',
                type: 'crypto',
                session: '24x7',
                timezone: 'Etc/UTC',
                exchange: 'CEX',
                minmov: 1,
                pricescale: 100, // Two decimal places for USDT pairs
                has_intraday: true,
                has_no_volume: false,
                has_weekly_and_monthly: false,
                supported_resolutions: ['1', '5', '60', '1D'],
                volume_precision: 8,
                data_status: 'streaming',
            };
            onSymbolResolvedCallback(symbolInfo);
        }, 0);
    },

    getBars: (
        symbolInfo: any,
        resolution: any,
        rangeStartDate: number,
        rangeEndDate: number,
        onResult: (bars: any[], meta: any) => void,
        onError: (error: string) => void,
        firstDataRequest: boolean
    ) => {
        console.log(
            '[getBars]: Method called!',
            symbolInfo,
            resolution,
            rangeStartDate,
            rangeEndDate,
            firstDataRequest
        );
        getBars(
            symbolInfo,
            resolution,
            rangeStartDate,
            rangeEndDate,
            onResult,
            onError,
            firstDataRequest
        );
    },

    subscribeBars: (
        symbolInfo: any,
        resolution: any,
        onRealtimeCallback: (bar: any) => void,
        subscriberUID: string,
        onResetCacheNeededCallback: () => void
    ) => {
        console.log('[subscribeBars]: Method called!', subscriberUID);

        // Clear existing subscription if any
        if (subscriptions[subscriberUID]) {
            clearInterval(subscriptions[subscriberUID]);
        }

        // In a real application, you would connect to your WebSocket here
        // For now, simulate real-time updates with random data
        const intervalId = setInterval(() => {
            const history = mockHistory[symbolInfo.name];
            const lastBar = history && history.length > 0
                ? history[history.length - 1]
                : generateRandomCandle(45000, Math.floor(Date.now() / 1000) - 60, resolution);

            const newBar = generateRandomCandle(lastBar.close, Math.floor(Date.now() / 1000), resolution);
            onRealtimeCallback(newBar);

            // Update history with new bar
            if (history) {
                history.push(newBar);
            }
        }, 5000); // Update every 5 seconds

        subscriptions[subscriberUID] = intervalId;
    },

    unsubscribeBars: (subscriberUID: string) => {
        console.log('[unsubscribeBars]: Method called!', subscriberUID);
        // Clear the interval to prevent memory leaks
        if (subscriptions[subscriberUID]) {
            clearInterval(subscriptions[subscriberUID]);
            delete subscriptions[subscriberUID];
        }
    },
};