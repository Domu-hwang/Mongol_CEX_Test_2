import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/globals.css';
import { AuthProvider } from './features/auth/AuthContext'; // Import AuthProvider

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider> {/* Wrap App with AuthProvider */}
                <App />
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
