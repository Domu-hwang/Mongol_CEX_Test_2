import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button'; // Assuming Button component is in src/components/ui

const HeroSection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="relative overflow-hidden bg-[#0b0e11] text-[#eaecef]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(252,213,53,0.1),transparent_50%)]"></div>
            <div className="container mx-auto px-4 py-24 md:py-40 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white">
                        Buy, Trade, and Hold <br />
                        <span className="text-primary-600">Crypto in Mongolia</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        The most trusted and secure cryptocurrency exchange in the region. Verified by global compliance standards.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
                        <Button
                            size="lg"
                            className="h-14 px-10 text-lg"
                            onClick={() => navigate('/register')}
                        >
                            Get Started
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="h-14 px-10 text-lg border-gray-700 text-gray-300 hover:text-white"
                            onClick={() => navigate('/login')}
                        >
                            Log In
                        </Button>
                    </div>
                    <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-gray-500 text-sm font-medium uppercase tracking-widest">
                        <div className="space-y-1">
                            <p className="text-white text-2xl font-bold">$1.2B+</p>
                            <p>24h Volume</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-2xl font-bold">250K+</p>
                            <p>Users</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-2xl font-bold">0.1%</p>
                            <p>Low Fees</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-white text-2xl font-bold">24/7</p>
                            <p>Support</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
