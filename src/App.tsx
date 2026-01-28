import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

// Feature-based page imports
import LandingPage from '@/features/landing/pages/LandingPage';
import LandingPage_2 from '@/features/landing/pages/LandingPage_2';
import LandingPage_3 from '@/features/landing/pages/LandingPage_3';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import TradePage from '@/features/trade/pages/TradePage';
import { QuickSwapPage } from '@/features/quickswap/pages/QuickSwapPage';
import WalletPage from '@/features/wallet/pages/WalletPage';
import DepositPage from '@/features/wallet/pages/DepositPage';
import WithdrawPage from '@/features/wallet/pages/WithdrawPage';
import OnboardingFlow from '@/features/kyc/components/OnboardingFlow';
import AccountPage from '@/features/account/pages/AccountPage'; // Import AccountPage

// Shared pages
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
    return (
        <MainLayout>
            <Routes>
                {/* Routes that use MainLayout */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/landing-2" element={<LandingPage_2 />} />
                <Route path="/landing-3" element={<LandingPage_3 />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/trade" element={<TradePage />} />
                <Route path="/trade/:symbol" element={<TradePage />} />
                <Route path="/quick-swap" element={<QuickSwapPage />} />
                <Route path="/my-assets" element={<WalletPage />} />
                <Route path="/wallet/deposit" element={<DepositPage />} />
                <Route path="/wallet/withdraw" element={<WithdrawPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/onboarding/intro/*" element={<OnboardingFlow />} />
                <Route path="*" element={<NotFoundPage />} />
                {/* Add a route for /wallet/transfer that renders WalletPage for now */}
                <Route path="/wallet/transfer" element={<WalletPage />} />
            </Routes>
        </MainLayout>
    );
}

export default App;
