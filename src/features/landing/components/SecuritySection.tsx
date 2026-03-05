import React from 'react';
import { Wallet, Activity, Lock, FileCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const securityPoints = [
    {
        icon: Wallet,
        titleKey: 'common.multiSignatureWalletManagement',
        descriptionKey: 'security.multiSignatureWalletManagementDesc',
    },
    {
        icon: Activity,
        titleKey: 'common.continuousMonitoringRiskControlSystems',
        descriptionKey: 'security.continuousMonitoringRiskControlSystemsDesc',
    },
    {
        icon: Lock,
        titleKey: 'common.strictInternalGovernanceProcedures',
        descriptionKey: 'security.strictInternalGovernanceProceduresDesc',
    },
    {
        icon: FileCheck,
        titleKey: 'common.amlOrientedOperationalFramework',
        descriptionKey: 'security.amlOrientedOperationalFrameworkDesc',
    },
];

const SecuritySection: React.FC = () => {
    const { t } = useTranslation();
    const { ref: headerRef, isVisible: headerVisible } = useScrollAnimation({ threshold: 0.1 });
    const { ref: cardsRef, isVisible: cardsVisible } = useScrollAnimation({ threshold: 0.1 });

    // Animation settings - elegant slide up from bottom
    const duration = 1.2;
    const easeOutExpo = 'cubic-bezier(0.16, 1, 0.3, 1)';

    const titleStyle: React.CSSProperties = {
        opacity: headerVisible ? 1 : 0,
        transform: headerVisible ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity ${duration}s ${easeOutExpo}, transform ${duration}s ${easeOutExpo}`,
    };

    const subtitleStyle: React.CSSProperties = {
        opacity: headerVisible ? 1 : 0,
        transform: headerVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity ${duration}s ${easeOutExpo} 0.15s, transform ${duration}s ${easeOutExpo} 0.15s`,
    };

    const getCardStyle = (index: number): React.CSSProperties => ({
        opacity: cardsVisible ? 1 : 0,
        transform: cardsVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity ${duration}s ${easeOutExpo} ${0.1 * index}s, transform ${duration}s ${easeOutExpo} ${0.1 * index}s`,
    });

    return (
        <section className="py-[10vh] md:py-[20vh] bg-transparent">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Section Header */}
                <div ref={headerRef} className="text-center mb-12 md:mb-16">
                    <h2
                        className="text-h2 md:text-h1 font-bold text-foreground mb-3 md:mb-4"
                        style={titleStyle}
                    >
                        {t('landingPage.builtForSecurityTitle')}
                    </h2>
                    <p
                        className="text-body md:text-h4 text-muted-foreground max-w-3xl mx-auto"
                        style={subtitleStyle}
                    >
                        {t('landingPage.builtForSecuritySubtitle')}
                    </p>
                </div>

                {/* Security Points Grid */}
                <div ref={cardsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {securityPoints.map((point, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center text-center gap-4 p-5 md:p-6 bg-transparent border border-white/10 rounded-xl hover:border-yellow-500/50 transition-all duration-300 h-full"
                            style={getCardStyle(index)}
                        >
                            {point.icon && (
                                <div className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-center flex-shrink-0">
                                    <point.icon className="w-6 h-6 text-yellow-500" />
                                </div>
                            )}
                            <h4 className="text-body md:text-h5 font-medium text-foreground flex-grow mb-2">
                                {t(point.titleKey)}
                            </h4>
                            {point.descriptionKey && (
                                <p className="text-body-sm text-muted-foreground leading-relaxed flex-grow mb-4">
                                    {t(point.descriptionKey)}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default SecuritySection;
