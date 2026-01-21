import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link } from 'react-router-dom';
import HeroSection from '@/features/landing/components/HeroSection';
import FeaturesSection from '@/features/landing/components/FeaturesSection';
import CTASection from '@/features/landing/components/CTASection';

const mockMarkets = [
    { pair: 'BTC/USDT', price: '$45,000.00', change: '+2.5%', volume: '1,234.56 BTC', trend: 'up' },
    { pair: 'ETH/USDT', price: '$2,350.20', change: '-1.2%', volume: '18,240 ETH', trend: 'down' },
    { pair: 'MNT/USDT', price: '$1.02', change: '+4.1%', volume: '5,420,000 MNT', trend: 'up' },
];

export const LandingPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            <HeroSection />

            <FeaturesSection />
            <CTASection />
        </main>
    );
};
