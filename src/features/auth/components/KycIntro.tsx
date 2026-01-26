import React from 'react';
import { Button } from '@/components/ui/Button'; // Updated import casing
import { Card, CardContent } from '@/components/ui/Card'; // Import Card and CardContent
import { ShieldAlert, FileText, CheckCircle } from 'lucide-react';

interface KycIntroProps {
    onStart: () => void;
}

export const KycIntro: React.FC<KycIntroProps> = ({ onStart }) => {
    return (
        <Card className="max-w-xl mx-auto text-center">
            <CardContent className="space-y-6 p-8">
                <ShieldAlert className="w-16 h-16 text-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-foreground mb-4">KYC Verification Required</h2>
                <p className="text-muted-foreground">
                    Complete the identity verification process to increase your trading and withdrawal limits.
                    This ensures a secure trading environment and compliance with regulations.
                </p>
                <div className="space-y-4 text-left">
                    <div className="flex items-start space-x-3">
                        <ShieldAlert className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-semibold text-foreground">Enhanced Security</p>
                            <p className="text-sm text-muted-foreground">Protect your account and assets from unauthorized access.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <FileText className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-semibold text-foreground">Regulatory Compliance</p>
                            <p className="text-sm text-muted-foreground">Comply with Anti-Money Laundering (AML) and Counter-Terrorist Financing (CFT) regulations.</p>
                        </div>
                    </div>
                    <div className="flex items-start space-x-3">
                        <CheckCircle className="text-primary flex-shrink-0 mt-1" size={20} />
                        <div>
                            <p className="font-semibold text-foreground">Access All Services</p>
                            <p className="text-sm text-muted-foreground">Gain access to all trading features and withdrawal services after KYC completion.</p>
                        </div>
                    </div>
                </div>
                <Button className="w-full" onClick={onStart} variant="yellow">
                    Start Verification
                </Button>
            </CardContent>
        </Card>
    );
};

export default KycIntro;
