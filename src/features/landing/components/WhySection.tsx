import React from 'react';
import { Shield, Scale } from 'lucide-react';

const WhySection: React.FC = () => {
    return (
        <section id="about" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Why a New Exchange?
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Addressing the gaps in Mongolia's digital asset market
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Technical Completeness */}
                    <div className="bg-card border border-border rounded-xl p-8 hover:border-yellow-500/50 transition-colors">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6">
                            <Shield className="w-6 h-6 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                            Technical Excellence
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            The Mongolian market lacks platforms with the technical maturity and operational stability to meet trading demands. We deliver a proven, product-level solution.
                        </p>
                    </div>

                    {/* Regulatory Compliance */}
                    <div className="bg-card border border-border rounded-xl p-8 hover:border-yellow-500/50 transition-colors">
                        <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center mb-6">
                            <Scale className="w-6 h-6 text-yellow-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-foreground mb-4">
                            Regulatory Compliance
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                            Built to meet the growing demand for advanced digital asset infrastructure with a regulation-friendly, stable platform.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WhySection;
