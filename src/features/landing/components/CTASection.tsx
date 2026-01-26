import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const CTASection: React.FC = () => {
    return (
        <section className="py-20 bg-muted/50 text-center border-t border-border">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-4 text-foreground">Ready to Start Your Crypto Journey?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Join IKH MYANGAN today and experience the future of digital asset trading.
                </p>
                <Link to="/register">
                    <Button variant="yellow" size="lg" className="text-xl px-12 h-14 font-bold">
                        Sign Up Now
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default CTASection;
