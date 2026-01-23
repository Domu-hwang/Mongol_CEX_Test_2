import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

const phases = [
    {
        phase: 'Phase 1',
        title: 'Pilot Deployment',
        description: 'Core feature validation (Product-level)',
        status: 'current',
    },
    {
        phase: 'Phase 2',
        title: 'Local Validation',
        description: 'Data collection & KPI measurement',
        status: 'upcoming',
    },
    {
        phase: 'Phase 3',
        title: 'Performance Review',
        description: 'Official contract signing',
        status: 'upcoming',
    },
    {
        phase: 'Phase 4',
        title: 'Full-Scale Launch',
        description: 'Service expansion',
        status: 'upcoming',
    },
];

const RoadmapSection: React.FC = () => {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Project Roadmap
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        From pilot to full-scale service
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5"></div>

                        {phases.map((item, index) => (
                            <div key={index} className={`relative flex items-start gap-8 mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                {/* Content */}
                                <div className={`flex-1 ml-12 md:ml-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                                    <div className={`inline-block bg-card border rounded-xl p-6 ${item.status === 'current' ? 'border-yellow-500 shadow-lg shadow-yellow-500/10' : 'border-border'}`}>
                                        <span className={`text-xs font-semibold ${item.status === 'current' ? 'text-yellow-500' : 'text-muted-foreground'}`}>
                                            {item.phase} {item.status === 'current' && '(Current)'}
                                        </span>
                                        <h3 className="text-lg font-semibold text-foreground mt-1 mb-2">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Timeline dot */}
                                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-background border-2 border-border">
                                    {item.status === 'current' ? (
                                        <CheckCircle className="w-5 h-5 text-yellow-500" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-muted-foreground" />
                                    )}
                                </div>

                                {/* Spacer for alternating layout */}
                                <div className="hidden md:block flex-1"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoadmapSection;
