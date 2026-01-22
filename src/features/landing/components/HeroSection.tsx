import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
    return (
        <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-black">
            <div className="absolute inset-0 z-0 opacity-30">
                {/* Background image or gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gray-900 via-black to-primary opacity-70"></div>
                <div className="absolute inset-0" style={{ backgroundImage: "url('/placeholder-background.svg')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
            </div>
            <div className="relative z-10 text-center px-4">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-4 text-text">
                    Discover the transformative power of <span className="text-primary">cryptocurrencies</span>
                </h1>
                <p className="text-lg md:text-xl text-text-dark mb-8 max-w-2xl mx-auto">
                    From Bitcoin to emerging altcoins, learn about the benefits, security features, and the potential for high returns that digital currencies offer.
                </p>
                <div className="flex justify-center space-x-4">
                    <Link to="/learn-more">
                        <Button variant="secondary" className="text-foreground">
                            Learn More
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="default" className="text-black">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
