import React from 'react';
import { Globe, MapPin } from 'lucide-react';

const PartnershipSection: React.FC = () => {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                            Global Technology Meets Local Expertise
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            A partnership built on trust and capability
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-2xl p-8 md:p-12">
                        <div className="grid md:grid-cols-2 gap-8 items-center">
                            {/* Global */}
                            <div className="text-center md:text-left">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto md:mx-0 mb-4">
                                    <Globe className="w-8 h-8 text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    Global Headquarters
                                </h3>
                                <p className="text-muted-foreground">
                                    Proven technology and operational excellence
                                </p>
                            </div>

                            {/* Local */}
                            <div className="text-center md:text-left">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-xl flex items-center justify-center mx-auto md:mx-0 mb-4">
                                    <MapPin className="w-8 h-8 text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">
                                    Mongolian Partner
                                </h3>
                                <p className="text-muted-foreground">
                                    Local regulatory knowledge and operational expertise
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-border">
                            <p className="text-center text-muted-foreground leading-relaxed">
                                This project combines the technical and operational capabilities of a global headquarters with the local regulatory and operational expertise of our Mongolian partner.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PartnershipSection;
