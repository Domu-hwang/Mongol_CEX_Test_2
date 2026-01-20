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
        <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
            <div className="space-y-3">
                <p className="text-sm uppercase tracking-wide text-blue-600">KYC-01 안내</p>
                <h2 className="text-2xl font-bold">Compliance kickoff</h2>
                <p className="text-slate-600">
                    EU/UK/Swiss/Australia 거주자는 온보딩 중 Proof of Address(POA)가 필수입니다. 기타 국가는 추후 한도 상향 혹은 규제
                    요청 시 제출 가능합니다.
                </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="text-lg font-semibold">레지던스별 CMP 요약</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-600">
                    <li>・ EU / UK / Swiss / Australia → POA + Selfie + ID</li>
                    <li>・ 기타 국가 → Selfie + ID (POA는 한도 상향 시 요청)</li>
                    <li>・ 제재 국가(Iran, Cuba, North Korea 등) → 가입 불가</li>
                </ul>
            </div>

            <Stepper steps={steps} currentStepId="kyc-01" />

            <Button className="w-full" onClick={onStart}>
                KYC 시작하기
            </Button>
        </div>
    );
};
