import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const HeroSection: React.FC = () => {
    return (
        <section className="bg-gray-900 text-white py-20 md:py-32">
            <div className="container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
                    Mongol CEX: Mongolia's <span className="text-primary-500">Leading</span> Cryptocurrency Exchange
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
                    Trade Bitcoin, Ethereum, and various other cryptocurrencies on a safe, fast, and reliable platform.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/register">
                        <Button size="lg">Get Started Now</Button>
                    </Link>
                    <Link to="/trade">
                        <Button variant="outline" size="lg">Start Trading</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
