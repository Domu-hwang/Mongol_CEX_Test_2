import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
    return (
        <section className="py-20 bg-gray-800 text-white text-center">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold mb-4 text-text">Ready to Start Your Crypto Journey?</h2>
                <p className="text-lg text-text-dark mb-8">
                    Join Mongol CEX today and experience the future of digital asset trading.
                </p>
                <Link to="/register" className="btn-primary text-xl">
                    Sign Up Now
                </Link>
            </div>
        </section>
    );
};

export default CTASection;
