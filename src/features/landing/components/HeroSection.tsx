import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const HeroSection: React.FC = () => {
    return (
        <section className="relative min-h-[650px] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-950 via-gray-900 to-background">
            {/* Background decorations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                {/* Beta Status Badge */}
                <Badge className="mb-6 bg-brand/10 text-yellow-400 border-brand/50 px-4 py-1">
                    Beta Test Now Live
                </Badge>

                {/* Main Copy */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                    Raising the Standard for
                    <br />
                    <span className="text-yellow-400">Digital Finance in Mongolia</span>
                </h1>

                {/* Sub Copy */}
                <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Experience a secure, regulation-friendly trading environment built with proven global standards. Be the first to access the future of crypto trading.
                </p>

                {/* CTA Button */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to="/trade">
                        <Button size="lg" className="bg-brand text-black hover:bg-brand/90 px-8 py-6 text-lg font-semibold">
                            Trade now
                        </Button>
                    </Link>
                    <a href="#features">
                        <Button variant="outline" size="lg" className="px-8 py-6 text-lg border-gray-600 text-gray-300 hover:bg-gray-800">
                            Learn More
                        </Button>
                    </a>
                </div>

                {/* Emphasis Text */}
                <p className="mt-8 text-sm text-gray-500">
                    Product-level beta testing is currently underway.
                </p>
            </div>
        </section>
    );
};

export default HeroSection;
