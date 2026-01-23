import React from 'react';
import { Cpu, UserCheck, Activity, Settings } from 'lucide-react';

const features = [
    {
        icon: Cpu,
        title: 'Core Engine',
        description: 'High-performance trading engine with fully integrated order matching, execution, and balance management.',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
    },
    {
        icon: UserCheck,
        title: 'Account & Security',
        description: 'Secure user account management and authentication systems to protect your assets.',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
    },
    {
        icon: Activity,
        title: '24/7 Monitoring',
        description: 'Round-the-clock log monitoring and incident response for uninterrupted service.',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
    },
    {
        icon: Settings,
        title: 'Admin Console',
        description: 'Comprehensive admin dashboard for transparent and efficient operations management.',
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
    },
];

const FeaturesSection: React.FC = () => {
    return (
        <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Uncompromising Fundamentals
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        A powerful trading engine built on solid foundations
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-yellow-500/30 transition-all"
                        >
                            <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                            </div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
