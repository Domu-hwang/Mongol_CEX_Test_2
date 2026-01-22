import React from 'react';
import { ShieldCheck, Zap, Handshake, BarChart2 } from 'lucide-react';

const features = [
    {
        icon: ShieldCheck,
        title: 'Top-tier Security',
        description: 'Protect your assets with multi-signature wallets, 2FA, cold storage, and more.',
    },
    {
        icon: Zap,
        title: 'Fast Trading Engine',
        description: 'Experience a high-performance matching engine processing hundreds of thousands of transactions per second.',
    },
    {
        icon: Handshake,
        title: 'Intuitive User Experience',
        description: 'Enjoy a clean and intuitive interface that\'s easy for beginners to use.',
    },
    {
        icon: BarChart2,
        title: 'Diverse Trading Products',
        description: 'Access a wide range of trading opportunities from major cryptocurrencies to various altcoins.',
    },
];

const FeaturesSection: React.FC = () => {
    return (
        <section className="py-20 md:py-32 bg-gray-800 text-white">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-12">
                    Why Choose <span className="text-primary-500">Mongol CEX</span>?
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex flex-col items-center p-6 bg-gray-700 rounded-lg shadow-lg">
                            <feature.icon size={48} className="text-primary-500 mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-300 text-center">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
