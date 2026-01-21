import React from 'react';
import { Button } from '@/components/ui/Button';
import { Stepper, Step } from '@/components/ui/Stepper';

const steps: Step[] = [
    { id: 'kyc-01', label: 'KYC-01', description: '안내' },
    { id: 'kyc-02', label: 'KYC-02', description: '정보 입력' },
    { id: 'kyc-03', label: 'KYC-03', description: '문서 제출' },
    { id: 'kyc-04', label: 'KYC-04', description: '라이브니스' },
    { id: 'kyc-05', label: 'KYC-05', description: 'POA' },
    { id: 'kyc-06', label: 'KYC-06', description: '진행 상태' },
];

interface KycIntroProps {
    onStart?: () => void;
}

export const KycIntro: React.FC<KycIntroProps> = ({ onStart }) => {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-primary-600/10 text-primary-600 text-xs font-bold uppercase tracking-widest">
                    Step 1: Introduction
                </div>
                <h2 className="text-3xl font-bold text-white">Compliance & Security</h2>
                <p className="text-gray-400 leading-relaxed">
                    To ensure a secure trading environment and comply with international regulations, we require identity verification.
                    Depending on your residence, additional documents like Proof of Address (POA) may be required.
                </p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-[#181a20] p-6 space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <svg className="h-5 w-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verification Requirements
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                    <li className="flex items-start gap-3">
                        <span className="text-primary-600 font-bold">•</span>
                        <span><b>EU / UK / Swiss / AU:</b> Require ID + Selfie + Proof of Address (POA).</span>
                    </li>
                    <li className="flex items-start gap-3">
                        <span className="text-primary-600 font-bold">•</span>
                        <span><b>Global:</b> Require ID + Selfie. POA may be requested for higher limits.</span>
                    </li>
                    <li className="flex items-start gap-3 text-danger-600">
                        <span className="font-bold">•</span>
                        <span><b>Restricted Countries:</b> Access is prohibited for certain jurisdictions.</span>
                    </li>
                </ul>
            </div>

            <Button size="lg" className="w-full h-14 text-lg font-bold" onClick={onStart}>
                Start Verification
            </Button>
        </div>
    );
};
