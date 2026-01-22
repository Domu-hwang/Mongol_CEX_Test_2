import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import TradePage from '@/pages/TradePage';
import NotFoundPage from '@/pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import OnboardingFlow from '@/features/auth/components/OnboardingFlow'; // New onboarding flow component
import WalletPage from '@/pages/WalletPage'; // Import WalletPage
import { QuickSwapPage } from '@/pages/QuickSwapPage'; // Keep QuickSwapPage

function App() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                {/* Redirect /register to /onboarding/register to start the flow */}
                <Route path="/register" element={<Navigate to="/onboarding/register" replace />} />
                <Route path="/onboarding/*" element={<OnboardingFlow />} />
                <Route path="/trade" element={<TradePage />} />
                <Route path="/quick-swap" element={<QuickSwapPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </MainLayout>
    );
}

export default App;
