import React from 'react';
import FadeInSection from '@/components/animations/FadeInSection';
import { useTranslation } from 'react-i18next';

const WhySummarySection: React.FC = () => {
    const { t } = useTranslation();

    const valuePropositions = [
        { labelKey: 'whySummary.mongoliaFocused', descriptionKey: 'whySummary.mongoliaFocusedDesc' },
        { labelKey: 'whySummary.infrastructureFirst', descriptionKey: 'whySummary.infrastructureFirstDesc' },
        { labelKey: 'whySummary.complianceReady', descriptionKey: 'whySummary.complianceReadyDesc' },
        { labelKey: 'whySummary.securityCentric', descriptionKey: 'whySummary.securityCentricDesc' },
        { labelKey: 'whySummary.userDriven', descriptionKey: 'whySummary.userDrivenDesc' },
    ];

    return (
        <section className="py-[10vh] md:py-[20vh] bg-transparent">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <FadeInSection>
                        <div className="text-center mb-8 md:mb-12">
                            <h2 className="text-h2 md:text-h1 font-bold text-foreground mb-3 md:mb-4">
                                {t('whySummary.title')}
                            </h2>
                            <p className="text-body-sm md:text-body text-muted-foreground">
                                {t('whySummary.subtitle')}
                            </p>
                        </div>
                    </FadeInSection>

                    {/* Detailed List */}
                    <FadeInSection delay={0.2}>
                        <div className="bg-transparent border border-border rounded-lg md:rounded-xl p-5 md:p-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                {valuePropositions.map((prop, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2 flex-shrink-0"></div>
                                        <div>
                                            <h4 className="text-body md:text-h5 font-semibold text-foreground mb-1">
                                                {t(prop.labelKey)}
                                            </h4>
                                            <p className="text-caption md:text-body-sm text-muted-foreground">
                                                {t(prop.descriptionKey)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        </section>
    );
};

export default WhySummarySection;
