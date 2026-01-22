import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-800 text-white p-6 mt-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-xl font-bold mb-4">Mongol CEX</h3>
                    <p className="text-gray-400 text-sm">
                        Secure and reliable cryptocurrency exchange.
                    </p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/trade" className="text-gray-400 hover:text-white">Trade</Link>
                        </li>
                        {/* Wallet link removed as per feedback, will be part of a 'mypage' or profile section */}
                        <li>
                            <Link to="/login" className="text-gray-400 hover:text-white">Login</Link>
                        </li>
                        <li>
                            <Link to="/register" className="text-gray-400 hover:text-white">Register</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                    <p className="text-gray-400 text-sm">
                        Email: support@mongolcex.com
                    </p>
                    <p className="text-gray-400 text-sm">
                        Address: Ulaanbaatar, Mongolia
                    </p>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} Mongol CEX. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
