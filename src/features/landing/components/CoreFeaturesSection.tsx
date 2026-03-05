import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface Feature {
    id: number;
    titleKey: string;
    descriptionKey: string;
}

const CoreFeaturesSection: React.FC = () => {
    const { t } = useTranslation();
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const progressRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const features: Feature[] = [
        {
            id: 1,
            titleKey: 'coreFeatures.spotTrading',
            descriptionKey: 'coreFeatures.spotTradingDesc',
        },
        {
            id: 2,
            titleKey: 'coreFeatures.fastEngine',
            descriptionKey: 'coreFeatures.fastEngineDesc',
        },
        {
            id: 3,
            titleKey: 'coreFeatures.secureCustody',
            descriptionKey: 'coreFeatures.secureCustodyDesc',
        },
        {
            id: 4,
            titleKey: 'coreFeatures.transparentOps',
            descriptionKey: 'coreFeatures.transparentOpsDesc',
        },
        {
            id: 5,
            titleKey: 'coreFeatures.localizedExp',
            descriptionKey: 'coreFeatures.localizedExpDesc',
        },
    ];

    // Check if mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const section = sectionRef.current;
        const container = containerRef.current;
        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];

        if (!section || !container || cards.length === 0) return;

        // Animation values based on device
        const translateY = isMobile ? 50 : 80;
        const scaleStart = isMobile ? 0.95 : 0.92;
        const scaleChange = isMobile ? 0.05 : 0.08;

        // Set initial states for all cards - only first card visible
        cards.forEach((card, index) => {
            if (index === 0) {
                gsap.set(card, { opacity: 1, y: 0, scale: 1, zIndex: features.length });
            } else {
                gsap.set(card, { opacity: 0, y: translateY, scale: scaleStart, zIndex: features.length - index });
            }
        });

        // Calculate scroll distance based on container height + extra bottom spacing
        const getScrollDistance = () => {
            const containerHeight = container.offsetHeight;
            const multiplier = isMobile ? 0.4 : 0.5;
            const bottomSpacing = window.innerHeight * 0.5; // 50vh extra at bottom
            return containerHeight * (features.length - 1) * multiplier + bottomSpacing;
        };

        // Create main ScrollTrigger for pinning
        const scrollTrigger = ScrollTrigger.create({
            trigger: section,
            start: 'top 15%',
            end: () => `+=${getScrollDistance()}`,
            pin: container,
            pinSpacing: true,
            scrub: isMobile ? 0.3 : 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                const progress = self.progress;
                const totalCards = features.length;
                const segmentSize = 1 / totalCards;

                // Calculate which card should be active
                const rawIndex = Math.floor(progress * totalCards);
                const currentIndex = Math.min(rawIndex, totalCards - 1);
                setActiveIndex(currentIndex);

                cards.forEach((card, index) => {
                    const segmentStart = index * segmentSize;

                    // Calculate progress within this segment (0 to 1)
                    let segmentProgress = (progress - segmentStart) / segmentSize;
                    segmentProgress = Math.max(0, Math.min(1, segmentProgress));

                    if (index === currentIndex) {
                        // Current active card
                        if (index < totalCards - 1) {
                            // Fade out current card only in the last 40% of its segment
                            const fadeOutProgress = Math.max(0, (segmentProgress - 0.6) / 0.4);
                            gsap.set(card, {
                                opacity: 1 - fadeOutProgress,
                                y: -fadeOutProgress * (translateY * 0.75),
                                scale: 1 - fadeOutProgress * scaleChange,
                                zIndex: features.length - index,
                            });
                        } else {
                            // Last card stays visible
                            gsap.set(card, { opacity: 1, y: 0, scale: 1, zIndex: 1 });
                        }
                    } else if (index === currentIndex + 1) {
                        // Next card - fade in only in the last 40% of previous segment
                        const prevSegmentProgress = (progress - (index - 1) * segmentSize) / segmentSize;
                        const fadeInProgress = Math.max(0, (prevSegmentProgress - 0.6) / 0.4);
                        gsap.set(card, {
                            opacity: fadeInProgress,
                            y: translateY - fadeInProgress * translateY,
                            scale: scaleStart + fadeInProgress * scaleChange,
                            zIndex: features.length - index,
                        });
                    } else if (index < currentIndex) {
                        // Cards that have been passed - completely hidden
                        gsap.set(card, { opacity: 0, y: -translateY * 0.75, scale: scaleStart, zIndex: 0 });
                    } else {
                        // Cards that haven't been reached yet - hidden below
                        gsap.set(card, { opacity: 0, y: translateY, scale: scaleStart, zIndex: 0 });
                    }
                });
            },
        });

        // Cleanup
        return () => {
            scrollTrigger.kill();
        };
    }, [features.length, isMobile]);

    return (
        <section
            ref={sectionRef}
            className="relative bg-black"
        >
            {/* Sticky Container */}
            <div
                ref={containerRef}
                className="h-screen w-full flex flex-col overflow-hidden relative"
            >
                {/* Section Header - Fixed at top */}
                <div className="pt-8 sm:pt-10 md:pt-12 pb-1 sm:pb-2 md:pb-2 text-center px-4 sm:px-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
                        {t('coreFeatures.title')}
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        {t('coreFeatures.subtitle')}
                    </p>
                </div>

                {/* Cards Stack */}
                <div className="relative flex-1 flex items-center justify-center">
                    {features.map((feature, index) => (
                        <div
                            key={feature.id}
                            ref={(el) => (cardsRef.current[index] = el)}
                            className="absolute inset-0 flex flex-col items-center justify-start pt-[12vh] text-center px-4 sm:px-6 md:px-8"
                            style={{ willChange: 'transform, opacity' }}
                        >
                            <div className="max-w-4xl mx-auto">
                                {/* Feature Number */}
                                <div className="mb-3 sm:mb-4 md:mb-6">
                                    <span className="text-yellow-500/20 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold select-none">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Feature Title */}
                                <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 sm:mb-4 md:mb-6 leading-tight px-2 sm:px-4">
                                    {t(feature.titleKey)}
                                </h3>

                                {/* Feature Description */}
                                <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-400 max-w-xl mx-auto leading-relaxed px-2 sm:px-4">
                                    {t(feature.descriptionKey)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Progress Indicator */}
                <div
                    ref={progressRef}
                    className="absolute bottom-[25vh] sm:bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3"
                >
                    {features.map((_, index) => (
                        <button
                            key={index}
                            className={`h-1 sm:h-1.5 rounded-full transition-all duration-500 ease-out ${index === activeIndex
                                    ? 'bg-yellow-500 w-6 sm:w-8 md:w-10'
                                    : index < activeIndex
                                        ? 'bg-yellow-500/40 w-1 sm:w-1.5'
                                        : 'bg-white/20 w-1 sm:w-1.5'
                                }`}
                            aria-label={`Feature ${index + 1}`}
                        />
                    ))}
                </div>

                {/* Scroll Hint - Hidden on very small screens */}
                <div
                    className={`absolute bottom-8 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-1 sm:gap-2 transition-opacity duration-500 hidden sm:flex ${activeIndex === 0 ? 'opacity-40' : 'opacity-0'
                        }`}
                >
                    <span className="text-white/50 text-[10px] sm:text-xs tracking-[0.2em] uppercase">
                        Scroll
                    </span>
                    <div className="w-px h-4 sm:h-6 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
                </div>

                {/* Feature Counter */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-12 md:right-12 text-white/30 text-xs sm:text-sm font-medium tracking-wider">
                    <span className="text-yellow-500">{String(activeIndex + 1).padStart(2, '0')}</span>
                    <span className="mx-1 sm:mx-2">/</span>
                    <span>{String(features.length).padStart(2, '0')}</span>
                </div>
            </div>
        </section>
    );
};

export default CoreFeaturesSection;
