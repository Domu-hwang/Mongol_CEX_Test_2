import React from 'react';

const FeaturesSection: React.FC = () => {
    return (
        <section className="py-20 bg-gray-900 text-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-text">Why Choose Mongol CEX?</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-secondary-700 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-text">Secure & Reliable</h3>
                        <p className="text-text-dark">
                            State-of-the-art security measures to protect your assets and personal information.
                        </p>
                    </div>
                    <div className="bg-secondary-700 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-text">Fast Transactions</h3>
                        <p className="text-text-dark">
                            Experience lightning-fast deposits, withdrawals, and trades.
                        </p>
                    </div>
                    <div className="bg-secondary-700 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-text">Low Fees</h3>
                        <p className="text-text-dark">
                            Competitive trading fees, making your crypto journey more cost-effective.
                        </p>
                    </div>
                    <div className="bg-secondary-700 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-text">24/7 Support</h3>
                        <p className="text-text-dark">
                            Our dedicated support team is always here to assist you.
                        </p>
                    </div>
                    <div className="bg-secondary-700 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-text">Wide Range of Assets</h3>
                        <p className="text-text-dark">
                            Trade a diverse selection of cryptocurrencies.
                        </p>
                    </div>
                    <div className="bg-secondary-700 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-bold mb-4 text-text">User-Friendly Interface</h3>
                        <p className="text-text-dark">
                            Intuitive design for both beginners and experienced traders.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
