import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/design-system/cn';
import { layoutPatterns } from '@/design-system/spacing';
import { semanticColors } from '@/design-system/colors';
import { Button } from '@/components/ui/button';
import FadeInSection from '@/components/animations/FadeInSection';
import { useTranslation } from 'react-i18next';

const FinalCTASection: React.FC = () => {
    const { t } = useTranslation();

    return (
        <section className="relative pt-[10vh] pb-[25vh] md:pt-[20vh] md:pb-[60vh] text-center overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-bottom"
                style={{
                    backgroundImage: `url('${import.meta.env.BASE_URL}images/greg-rakozy-oMpAz-DN-9I-unsplash.jpg')`,
                    filter: 'brightness(0.4) blur(0.5px)',
                    transform: 'scale(1.02)'
                }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-transparent" style={{ height: '40%' }}></div>
            <div className="container mx-auto px-4 max-w-6xl text-center z-10 relative">
                <FadeInSection delay={0}>
                    <h2 className="text-h2 font-bold leading-tight mb-6 text-white">
                        {t('finalCta.title')}
                    </h2>
                </FadeInSection>
                <FadeInSection delay={0.1}>
                    <p className="text-body-main mb-8 max-w-2xl mx-auto text-gray-200">
                        {t('finalCta.subtitle')}
                    </p>
                </FadeInSection>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full px-5 py-[40px] sm:px-0 sm:py-0 sm:max-w-none">
                    <FadeInSection delay={0.2} className="w-full sm:w-auto">
                        <Link to="/coming-soon" className="block w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-yellow-500 text-black hover:bg-yellow-600">
                                {t('finalCta.openAccount')}
                            </Button>
                        </Link>
                    </FadeInSection>
                    <FadeInSection delay={0.3} className="w-full sm:w-auto">
                        <a href="mailto:support@ikh-myangan.com" className="block w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-white text-black hover:bg-gray-100">
                                {t('finalCta.contactUs')}
                            </Button>
                        </a>
                    </FadeInSection>
                </div>
            </div>
        </section>
    );
};

export default FinalCTASection;
