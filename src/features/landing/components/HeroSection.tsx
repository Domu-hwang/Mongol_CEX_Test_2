import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DawnHorizon from '@/components/three/DawnHorizon';

const HeroSection: React.FC = () => {
    return (
        <div
            className="relative min-h-[850px]"
            style={{
                width: '100vw',
                marginLeft: 'calc(-50vw + 50%)'
            }}
        >
            {/* Three.js Dawn Horizon Animation Background */}
            <div
                className="absolute inset-0"
                style={{ zIndex: 0 }}
            >
                <DawnHorizon />
            </div>

            {/* Hero Content */}
            <section className="relative min-h-[850px] flex items-center justify-center" style={{ zIndex: 1 }}>
                <div className="text-center px-4 max-w-4xl mx-auto" style={{ marginTop: '-240px' }}>
                {/* Beta Status Badge */}
                <Badge className="mb-6 bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-4 py-1 backdrop-blur-sm">
                    Beta Test Now Live
                </Badge>

                {/* Main Copy */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                    Raising the Standard for
                    <br />
                    <span className="text-yellow-400">Digital Finance in Mongolia</span>
                </h1>

                {/* Sub Copy */}
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                    Experience a secure, regulation-friendly trading environment built with proven global standards. Be the first to access the future of crypto trading.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/trade">
                        <Button variant="yellow" size="lg" className="px-8 py-6 text-lg font-semibold">
                            Trade now
                        </Button>
                    </Link>
                    <a href="#features">
                        <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-white/30 text-white hover:bg-white/10">
                            Learn More
                        </Button>
                    </a>
                </div>

                    {/* Emphasis Text */}
                    <p className="mt-8 text-sm text-gray-400">
                        Product-level beta testing is currently underway.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;
