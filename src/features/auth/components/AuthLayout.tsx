import React, { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

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
            <Card className="flex flex-col md:flex-row max-w-4xl w-full p-0 overflow-hidden bg-card border-border shadow-2xl">
                <div className="md:w-1/2 p-8 flex flex-col justify-center bg-muted/30">
                    <h1 className="text-3xl font-bold mb-2 text-foreground">{title}</h1>
                    <p className="text-muted-foreground mb-6">{subtitle}</p>
                    {helperText && <p className="text-muted-foreground text-sm mt-4">{helperText}</p>} {/* Render helperText */}
                    {sideContent && <div className="mt-auto">{sideContent}</div>}
                </div>
                <div className="md:w-1/2 p-8 bg-card flex items-center justify-center">
                    <div className="w-full max-w-sm">
                        {children}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AuthLayout;
