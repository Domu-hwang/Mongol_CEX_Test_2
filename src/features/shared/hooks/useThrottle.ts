import { useEffect, useRef, useState } from 'react';

export const useThrottle = <T,>(value: T, delay: number = 300): T => {
    const [throttledValue, setThrottledValue] = useState<T>(value);
    const lastExecuted = useRef<number>(Date.now());

    useEffect(() => {
        const handler = setTimeout(() => {
            const now = Date.now();
            if (now - lastExecuted.current >= delay) {
                setThrottledValue(value);
                lastExecuted.current = now;
            }
        }, delay - (Date.now() - lastExecuted.current));

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return throttledValue;
};
