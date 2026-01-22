import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

interface AuthLayoutProps {
    title: string;
    subtitle: string;
    children: ReactNode;
    sideContent?: ReactNode; // Optional side content for more complex layouts
    helperText?: string; // Add helperText prop
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, subtitle, children, sideContent, helperText }) => {
    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <Card className="flex flex-col md:flex-row max-w-4xl w-full p-0 overflow-hidden bg-secondary-700 border border-secondary-600">
                <div className="md:w-1/2 p-8 flex flex-col justify-center bg-secondary-700 text-white">
                    <h1 className="text-3xl font-bold mb-2 text-primary-600">{title}</h1>
                    <p className="text-gray-300 mb-6">{subtitle}</p>
                    {helperText && <p className="text-gray-400 text-sm mt-4">{helperText}</p>} {/* Render helperText */}
                    {sideContent && <div className="mt-auto">{sideContent}</div>}
                </div>
                <div className="md:w-1/2 p-8 bg-secondary-700 text-white flex items-center justify-center">
                    <div className="w-full max-w-sm">
                        {children}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AuthLayout;
