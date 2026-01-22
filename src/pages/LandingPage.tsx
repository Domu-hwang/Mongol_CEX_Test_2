import React from 'react';
import HeroSection from '@/features/landing/components/HeroSection';
import FeaturesSection from '@/features/landing/components/FeaturesSection';
import CTASection from '@/features/landing/components/CTASection';

const LandingPage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <FeaturesSection />
            <CTASection />
        </>
    );
};

export default LandingPage;
