import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
    base: '/',
    plugins: [
        react({
            babel: {
                plugins: ['@babel/plugin-syntax-decimal'],
            },
        }),
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            // This assumes your project root is the current working directory where vite.config.ts resides
            // This will be handled by vite-tsconfig-paths
            // '@': './src',
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