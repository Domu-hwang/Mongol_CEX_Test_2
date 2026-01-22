import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from '@/pages/LandingPage';
import TradePage from '@/pages/TradePage';
import NotFoundPage from '@/pages/NotFoundPage';
import MainLayout from './layouts/MainLayout';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import WalletPage from '@/pages/WalletPage'; // Import WalletPage
import DepositPage from '@/pages/DepositPage';
import WithdrawPage from '@/pages/WithdrawPage';
import { QuickSwapPage } from '@/pages/QuickSwapPage';
import OnboardingFlow from '@/features/kyc/components/OnboardingFlow'; // Import OnboardingFlow

function App() {
    return (
        <MainLayout>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/trade" element={<TradePage />} />
                <Route path="/quick-swap" element={<QuickSwapPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/wallet/deposit" element={<DepositPage />} />
                <Route path="/wallet/withdraw" element={<WithdrawPage />} />
                <Route path="/onboarding/intro" element={<OnboardingFlow />} /> {/* Add Onboarding Flow route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </MainLayout>
    );
}

export default App;
