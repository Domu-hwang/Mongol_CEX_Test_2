import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { Navigation } from '../layout/Navigation'; // Import the Navigation component

const Header: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const { hasZeroBalance, isLoading: isWalletLoading } = useWallet();

    return (
        <header className="bg-background text-foreground p-4 flex justify-between items-center shadow-md border-b border-border">
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
                        <span className="text-sm text-muted-foreground">Balance: 12345.67 USDT</span>
                        {isAuthenticated && hasZeroBalance && !isWalletLoading && (
                            <Link to="/wallet/deposit" className="ml-4">
                                <Button variant="default" className="bg-success text-success-foreground hover:bg-success/90">Deposit</Button>
                            </Link>
                        )}
                        <Button variant="destructive">Logout</Button>
                    </>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Link to="/login">
                            <Button variant="outline">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="default" className="text-black">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
