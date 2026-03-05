import React from 'react';
import HeroSection from '../components/HeroSection';
import VisionSection from '../components/VisionSection';
import CoreFeaturesSection from '../components/CoreFeaturesSection';
import SecuritySection from '../components/SecuritySection';
import WhySummarySection from '../components/WhySummarySection';
import RoadmapSection from '../components/RoadmapSection';
import FinalCTASection from '../components/FinalCTASection';
const LandingPage: React.FC = () => {
    return (
        <>
            {/* Hero - Main value proposition */}
            <HeroSection />

            {/* Vision - Future of digital finance */}
            <VisionSection />

            {/* Core Features - Modular grid */}
            <CoreFeaturesSection />

            {/* Security - High-priority trust section */}
            <SecuritySection />

            {/* Why Summary - Value propositions */}
            <WhySummarySection />

            {/* Strategic Roadmap - Ecosystem */}
            <RoadmapSection />

            {/* Final CTA - Conversion */}
            <FinalCTASection />
        </>
    );
};

export default LandingPage;
