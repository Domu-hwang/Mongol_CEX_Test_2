import React from 'react';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, FileText, CheckCircle } from 'lucide-react';

interface KycIntroProps {
    onStart: () => void;
}

export const KycIntro: React.FC<KycIntroProps> = ({ onStart }) => {
    return (
        <div className="space-y-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900">Start Identity Verification (KYC)</h3>
            <p className="text-gray-600">
                Complete the identity verification process to increase your trading and withdrawal limits.
                This ensures a secure trading environment and compliance with regulations.
            </p>
            <div className="space-y-4 text-left">
                <div className="flex items-start space-x-3">
                    <ShieldAlert className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                        <p className="font-semibold text-gray-800">Enhanced Security</p>
                        <p className="text-sm text-gray-600">Protect your account and assets from unauthorized access.</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <FileText className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                        <p className="font-semibold text-gray-800">Regulatory Compliance</p>
                        <p className="text-sm text-gray-600">Comply with Anti-Money Laundering (AML) and Counter-Terrorist Financing (CFT) regulations.</p>
                    </div>
                </div>
                <div className="flex items-start space-x-3">
                    <CheckCircle className="text-primary-600 flex-shrink-0 mt-1" size={20} />
                    <div>
                        <p className="font-semibold text-gray-800">Access All Services</p>
                        <p className="text-sm text-gray-600">Gain access to all trading features and withdrawal services after KYC completion.</p>
                    </div>
                </div>
            </div>
            <Button className="w-full" onClick={onStart}>
                Start Verification
            </Button>
        </div>
    );
};

export default KycIntro;
