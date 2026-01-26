import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { UserPlus, Wallet, MessageSquare, Gift, AlertCircle } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        step: '01',
        title: 'Create Account',
        description: 'Quick sign-up with email or mobile verification',
    },
    {
        icon: Wallet,
        step: '02',
        title: 'Experience Trading',
        description: 'Test with simulation funds or limited real deposits',
    },
    {
        icon: MessageSquare,
        step: '03',
        title: 'Share Feedback',
        description: 'Submit feedback after using core trading features',
    },
];

const PilotProgramSection: React.FC = () => {
    return (
        <section id="pilot-guide" className="py-20 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Early Access: Pilot Testers Wanted
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Be among the first to shape the future of crypto trading in Mongolia
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
                    {steps.map((item, index) => (
                        <div key={index} className="text-center">
                            <div className="relative inline-block mb-4">
                                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto">
                                    <item.icon className="w-8 h-8 text-yellow-500" />
                                </div>
                                <span className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                                    {item.step}
                                </span>
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-yellow-500/5 to-yellow-500/10 border border-yellow-500/20 rounded-xl p-8 max-w-3xl mx-auto mb-8">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Gift className="w-5 h-5 text-yellow-500" />
                        </div>
                        <div>
                            <h4 className="text-lg font-semibold text-foreground mb-2">
                                Participant Benefits
                            </h4>
                            <p className="text-muted-foreground">
                                Early bird rewards and fee discounts will be offered at official launch.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Warning Notice */}
                <div className="bg-muted/50 border border-border rounded-xl p-6 max-w-3xl mx-auto mb-8">
                    <div className="flex items-start gap-4">
                        <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                            Some features and access may be limited during the pilot phase for risk management purposes.
                        </p>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link to="/register">
                        <Button variant="yellow" size="lg" className="px-8">
                            Apply as Pilot Tester
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default PilotProgramSection;
