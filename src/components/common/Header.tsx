import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { Navigation } from '../layout/Navigation'; // Import the Navigation component

const Header: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { hasZeroBalance, isLoading: isWalletLoading } = useWallet();

    return (
        <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md border-b border-gray-700">
            <div className="flex items-center space-x-6">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary flex items-center">
                    Mongol CEX
                </Link>

                {/* Main Navigation - now handled by the Navigation component */}
                <Navigation />
            </div>

            {/* Right-aligned auth buttons */}
            <div className="flex items-center space-x-4">

                {isAuthenticated ? (
                    <>
                        {/* Wallet Balance Display - Placeholder */}
                        <span className="text-sm text-text-dark">Balance: 12345.67 USDT</span>
                        {isAuthenticated && hasZeroBalance && !isWalletLoading && (
                            <Link to="/wallet/deposit" className="ml-4">
                                <Button variant="success">Deposit</Button>
                            </Link>
                        )}
                        <Button variant="secondary" className="bg-danger hover:bg-danger-700 text-text">Logout</Button>
                    </>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Link to="/login">
                            <Button variant="outline" className="border-secondary-500 text-text-dark hover:bg-secondary-600">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button className="btn-primary">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
