import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button'; // Assuming Button component is in src/components/ui

const CTASection: React.FC = () => {
    const navigate = useNavigate();

    return (
        <section className="bg-primary-600 text-[#181a20] py-24 text-center">
            <div className="container mx-auto px-4 max-w-4xl space-y-8">
                <h2 className="text-4xl md:text-5xl font-extrabold">Start Trading Now</h2>
                <p className="text-xl md:text-2xl font-medium opacity-80">
                    Register an account today and start trading with the most secure platform in Mongolia.
                </p>
                <div className="pt-4">
                    <Button
                        size="lg"
                        variant="secondary"
                        className="h-16 px-12 text-xl font-bold rounded-2xl bg-[#181a20] text-primary-600 hover:bg-[#1e2329]"
                        onClick={() => navigate('/register')}
                    >
                        Register Now
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
