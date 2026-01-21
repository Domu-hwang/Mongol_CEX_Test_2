import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';
import TradePage from '@/pages/TradePage';
import NotFoundPage from '@/pages/NotFoundPage';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import OnboardingFlow from '@/features/auth/components/OnboardingFlow'; // New onboarding flow component

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-[#0b0e11]">
            <Header />
            <main className="flex-grow flex flex-col overflow-hidden">
                <Routes>
                    <Route path="/" element={<div className="container mx-auto p-4"><LandingPage /></div>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/onboarding/*" element={<OnboardingFlow />} />
                    <Route path="/trade" element={<TradePage />} />
                    <Route path="*" element={<div className="container mx-auto p-4"><NotFoundPage /></div>} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
