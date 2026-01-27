import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';
import './styles/trade.css';
import { AuthProvider } from './features/auth/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from './components/ui/toaster';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <AuthProvider>
                    <App />
                    <Toaster />
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
);
