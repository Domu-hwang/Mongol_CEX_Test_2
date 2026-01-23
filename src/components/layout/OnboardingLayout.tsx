import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Shield, Lock } from 'lucide-react';

interface OnboardingLayoutProps {
    children: React.ReactNode;
    title: string;
    description?: string;
    showSecurityBadge?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
    children,
    title,
    description,
    showSecurityBadge = true
}) => {
    return (
        <div className="flex flex-col items-center min-h-screen bg-background p-4 pt-8">
            <Card className="w-full max-w-[520px] border-border shadow-lg">
                <CardHeader className="text-center pb-4">
                    {/* Logo and Branding */}
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                            <span className="text-black font-bold text-xl">M</span>
                        </div>
                        <span className="text-xl font-bold text-foreground">Mongol CEX</span>
                    </div>

                    <CardTitle className="text-2xl font-bold text-foreground">{title}</CardTitle>
                    {description && (
                        <CardDescription className="text-muted-foreground mt-2">
                            {description}
                        </CardDescription>
                    )}
                </CardHeader>

                <CardContent className="px-6 pb-6">
                    {children}
                </CardContent>

                {/* Security Badge */}
                {showSecurityBadge && (
                    <div className="px-6 pb-6">
                        <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Shield className="w-3.5 h-3.5 text-green-500" />
                                <span>Bank-grade Security</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Lock className="w-3.5 h-3.5 text-green-500" />
                                <span>256-bit Encryption</span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

            {/* Compliance Footer */}
            <p className="text-xs text-muted-foreground mt-6 text-center max-w-md">
                Your information is protected and processed in compliance with international data protection standards.
            </p>
        </div>
    );
};

export default OnboardingLayout;
