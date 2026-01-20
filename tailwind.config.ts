import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./index.html', './src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    primary: '#2563eb',
                    secondary: '#1e293b',
                },
            },
        },
    },
    plugins: [],
};

export default config;
