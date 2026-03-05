import { cn } from '@/design-system/cn';
import { layoutPatterns } from '@/design-system/spacing';
import { Rocket, Share2, Handshake, DollarSign, Zap } from 'lucide-react';
import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const expandingTheEcosystem = [
    {
        icon: Rocket,
        titleKey: 'common.expandedTokenListings',
        subTextKey: 'expandedTokenListingsSubtext',
    },
    {
        icon: Handshake,
        titleKey: 'common.strategicPartnerships',
        subTextKey: 'strategicPartnershipsSubtext',
    },
    {
        icon: Share2,
        titleKey: 'common.institutionalServices',
        subTextKey: 'institutionalServicesSubtext',
    },
    {
        icon: DollarSign,
        titleKey: 'common.enhancedLiquidityPrograms',
        subTextKey: 'enhancedLiquidityProgramsSubtext',
    },
    {
        icon: Zap,
        titleKey: 'common.advancedTradingFeatures',
        subTextKey: 'advancedTradingFeaturesSubtext',
    },
];

const RoadmapSection: React.FC = () => {
    const { t } = useTranslation(); // Initialize useTranslation
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollElement = scrollRef.current;
        if (!scrollElement) return;

        let animationFrameId: number;
        const scrollSpeed = 0.5; // Adjust scroll speed as needed

        const scroll = () => {
            if (scrollElement.scrollLeft >= scrollElement.scrollWidth - scrollElement.clientWidth) {
                scrollElement.scrollLeft = 0;
            } else {
                scrollElement.scrollLeft += scrollSpeed;
            }
            animationFrameId = requestAnimationFrame(scroll);
        };

        animationFrameId = requestAnimationFrame(scroll);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <section className={cn(layoutPatterns.container, "py-[10vh] md:py-[20vh] bg-transparent")}>
            <div className="text-center mb-12 md:mb-16">
                <h2 className="text-h2 font-bold leading-tight mb-4 text-foreground">
                    {t('landingPage.expandingTheEcosystemTitle')}
                </h2>
                <p className="text-body-main text-muted-foreground max-w-2xl mx-auto">
                    {t('landingPage.expandingTheEcosystemSubtitle')}
                </p>
            </div>

            <div
                ref={scrollRef}
                className="flex flex-row overflow-x-hidden gap-4 md:gap-6 pb-4 h-auto py-2"
            >
                {expandingTheEcosystem.map((item, index) => (
                    <div
                        key={index}
                        className="min-w-[300px] bg-background border border-border rounded-xl p-4 md:p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all flex flex-col items-center text-center min-h-[200px]"
                    >
                        <div className={`w-10 h-10 md:w-12 md:h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-3 md:mb-4`} >
                            <item.icon className={`w-5 h-5 md:w-6 md:h-6 text-yellow-500`} />
                        </div>
                        <h3 className="text-body md:text-h5 font-semibold text-foreground mb-2">
                            {t(item.titleKey)}
                        </h3>
                        {item.subTextKey && (
                            <p className="text-sm text-muted-foreground text-center flex-grow">
                                {t(item.subTextKey)}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default RoadmapSection;