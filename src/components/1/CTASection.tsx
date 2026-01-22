import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const CTASection: React.FC = () => {
    return (
        <section className="bg-primary-600 text-[#181a20] py-20 md:py-24 text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Start Trading on Mongol CEX Today!
                </h2>
                <p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                    Dive into the world of secure and efficient cryptocurrency trading with a simple registration process.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <Link to="/register">
                        <Button size="lg" variant="secondary">Sign Up for Free</Button>
                    </Link>
                    <Link to="/trade">
                        <Button size="lg" variant="outline" className="border-[#181a20] text-[#181a20] hover:bg-[#181a20] hover:text-primary-600">
                            View Markets
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
