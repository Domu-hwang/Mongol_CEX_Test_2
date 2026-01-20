import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/:tab" element={<AuthPage />} />
            <Route path="/auth/kyc-profile" element={<AuthPage />} /> {/* For direct link to KYC profile */}
            {/* TODO: Add other routes like /trade, /wallet, /admin etc. */}
            <Route path="*" element={<h1 className="text-3xl text-center p-10">404 Not Found</h1>} />
        </Routes>
    );
}

export default App;
