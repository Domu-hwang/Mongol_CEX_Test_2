import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fff9e6',
                    DEFAULT: '#fcd535',
                    600: '#fcd535', // Binance Yellow
                    700: '#e1bc1e',
                },
                secondary: {
                    500: '#474d57',
                    600: '#1e2329',
                    700: '#181a20',
                },
                success: { 600: '#0ecb81', 700: '#0ba368' }, // Binance Green
                danger: { 600: '#f6465d', 700: '#cf3a4c' }, // Binance Red
            },
            screens: {
                // Mobile-first breakpoints from docs
                'sm': '640px',   // Default Tailwind
                'md': '768px',   // Tablet breakpoint
                'lg': '1024px',  // Desktop breakpoint
            },
        },
    },
    plugins: [],
};

export default config;
