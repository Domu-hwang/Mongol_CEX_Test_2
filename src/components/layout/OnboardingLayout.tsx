import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'; // Assuming Card is in ui

interface OnboardingLayoutProps {
    children: React.ReactNode;
    title: string;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children, title }) => {
    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-[480px]">
                <CardHeader className="text-center">
                    {/* Replace with actual logo or company name */}
                    <div className="mb-4 text-2xl font-bold">Mongol CEX</div>
                    <CardTitle className="text-3xl font-bold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
};

export default OnboardingLayout;
