import React from 'react';
import HeroSection from '../components/HeroSection';
import WhySection from '../components/WhySection';
import FeaturesSection from '../components/FeaturesSection';
import PilotProgramSection from '../components/PilotProgramSection';
import RoadmapSection from '../components/RoadmapSection';
import PartnershipSection from '../components/PartnershipSection';
import FloatingFeedback from '../components/FloatingFeedback';

const LandingPage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <WhySection />
            <FeaturesSection />
            <PilotProgramSection />
            <RoadmapSection />
            <PartnershipSection />
            <FloatingFeedback />
        </>
    );
};

export default LandingPage;
