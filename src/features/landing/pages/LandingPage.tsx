import React from 'react';
import HeroSection from '../components/HeroSection';
import WhySection from '../components/WhySection';
import FeaturesSection from '../components/FeaturesSection';
import PilotProgramSection from '../components/PilotProgramSection';
import RoadmapSection from '../components/RoadmapSection';
import PartnershipSection from '../components/PartnershipSection';
import NewsSection from '../components/NewsSection';
import FloatingFeedback from '../components/FloatingFeedback';
import FadeInSection from '@/components/animations/FadeInSection';

const LandingPage: React.FC = () => {
    return (
        <>
            <HeroSection />
            <FadeInSection>
                <WhySection />
            </FadeInSection>
            <FadeInSection delay={0.1}>
                <FeaturesSection />
            </FadeInSection>
            <FadeInSection delay={0.1}>
                <PilotProgramSection />
            </FadeInSection>
            <FadeInSection delay={0.1}>
                <RoadmapSection />
            </FadeInSection>
            <FadeInSection delay={0.1}>
                <PartnershipSection />
            </FadeInSection>
            <FadeInSection delay={0.1}>
                <NewsSection />
            </FadeInSection>
            <FloatingFeedback />
        </>
    );
};

export default LandingPage;
