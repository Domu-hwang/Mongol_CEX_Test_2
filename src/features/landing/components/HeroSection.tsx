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
                {/* Status Badge */}
                <Badge className="mb-6 bg-yellow-500/20 text-yellow-400 border-yellow-500/50 px-4 py-1 backdrop-blur-sm">
                    Mongolia's Premier Digital Asset Exchange
                </Badge>

                {/* Main Copy */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white drop-shadow-lg">
                    Trade Crypto with
                    <br />
                    <span className="text-yellow-400">Speed, Security & Trust</span>
                </h1>

                {/* Sub Copy */}
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                    Buy, sell, and trade Bitcoin, Ethereum, and 50+ digital assets with industry-leading security. Low fees, instant deposits, and 24/7 support.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/register">
                        <Button variant="yellow" size="lg" className="px-8 py-6 text-lg font-semibold">
                            Get Started Free
                        </Button>
                    </Link>
                    <Link to="/trade">
                        <Button size="lg" className="px-8 py-6 text-lg bg-white text-black hover:bg-white/90 font-semibold">
                            View Markets
                        </Button>
                    </Link>
                </div>

                    {/* Trust Indicators */}
                    <p className="mt-8 text-sm text-gray-400">
                        Trusted by 10,000+ traders  |  $50M+ daily volume  |  Bank-grade security
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;
