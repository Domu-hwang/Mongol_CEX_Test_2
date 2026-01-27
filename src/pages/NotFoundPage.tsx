import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-900 text-white">
            <main className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <h1 className="text-6xl font-extrabold text-primary-600 mb-4">404</h1>
                <h2 className="text-3xl font-bold mb-4">Page Not Found</h2>
                <p className="text-lg text-gray-400 mb-8">
                    The page you requested could not be found. Please check the address or return to the main page using the link below.
                </p>
                <Link to="/">
                    <Button size="lg">Return to Main</Button>
                </Link>
            </main>
        </div>
    );
};

export default NotFoundPage;
