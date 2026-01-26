import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: ['@babel/plugin-syntax-decimal'],
            },
        }),
    ],
    resolve: {
        alias: {
            // This assumes your project root is the current working directory where vite.config.ts resides
            '@': '/src',
        },
    },
    server: {
        port: 5175,
        host: true,
        allowedHosts: [
            'semidramatically-fathomless-corene.ngrok-free.dev',
        ],
    },
});