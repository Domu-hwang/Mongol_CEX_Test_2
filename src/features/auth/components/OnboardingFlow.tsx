import React, { useState } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { KycIntro } from './KycIntro';
import { KycProfileForm } from './KycProfileForm';
import { AuthLayout } from './AuthLayout';
import { Stepper, Step } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { KYC_POLICIES, getOnboardingSteps } from '@/constants/policy'; // Import policy constants

// Redefine onboardingSteps here to remove the conflicting local definition
// const onboardingSteps = [
//     { id: 'intro', label: '시작하기' },
//     { id: 'profile', label: '기본 정보' },
//     { id: 'document', label: '문서 업로드' }, // Future step for document upload
//     { id: 'review', label: '심사 대기' }, // Future step for review
// ];

const OnboardingFlow: React.FC = () => {
    // For demo purposes, we'll hardcode a country that requires POA for the flow to demonstrate dynamic steps
    const mockResidenceCountry = 'EU'; // This would come from user input in a real app
    const policy = KYC_POLICIES[mockResidenceCountry as keyof typeof KYC_POLICIES] || KYC_POLICIES.default;
    const isPOARequired = policy.poaRequired;

    const onboardingSteps = getOnboardingSteps(isPOARequired);

    const { '*': currentPath = onboardingSteps[0].id } = useParams<{ '*': string }>();
    const navigate = useNavigate();

    const currentStepIndex = onboardingSteps.findIndex(step => currentPath.startsWith(step.id));
    const currentStepId = onboardingSteps[currentStepIndex !== -1 ? currentStepIndex : 0].id;
    const currentStepNumber = currentStepIndex !== -1 ? currentStepIndex : 0;

    const handleKycIntroStart = () => {
        navigate('profile');
    };

    const handleKycProfileSubmit = (data: any) => {
        console.log('KYC Profile Submitted:', data);
        alert('KYC 정보가 제출되었습니다!');
        // For now, redirect to Trade page after KYC profile submission
        navigate('/trade', { replace: true });
        // In a real scenario, this would lead to 'document' or 'review' steps
    };

    const handleBack = () => {
        const previousStep = onboardingSteps[currentStepNumber - 1];
        if (previousStep) {
            navigate(previousStep.id);
        } else {
            navigate('/register'); // Go back to registration if no previous onboarding step
        }
    };

    return (
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-5xl space-y-12">
                <div className="px-10">
                    <Stepper steps={onboardingSteps} currentStepId={currentStepId} />
                </div>

                <Routes>
                    <Route path="intro" element={
                        <AuthLayout
                            title="KYC 시작"
                            subtitle="본인 인증을 시작하여 거래 권한을 얻으세요."
                        >
                            <KycIntro onStart={handleKycIntroStart} />
                        </AuthLayout>
                    } />
                    <Route path="profile" element={
                        <AuthLayout
                            title="KYC 기본 정보"
                            subtitle="개인 정보를 입력하여 본인 인증을 진행합니다."
                            sideContent={
                                <div>
                                    <p className="font-semibold">KYC 단계</p>
                                    <p className="text-sm text-slate-500">
                                        Stepper 구성으로 언제든 진행 상태 확인 가능
                                    </p>
                                    {currentStepNumber > 0 && (
                                        <Button variant="outline" onClick={handleBack} className="mt-4">
                                            이전 단계로
                                        </Button>
                                    )}
                                </div>
                            }
                        >
                            <KycProfileForm onSubmit={handleKycProfileSubmit} />
                        </AuthLayout>
                    } />
                    {/* Future routes for document upload and review */}
                    <Route path="*" element={
                        <AuthLayout title="온보딩 진행 중" subtitle="현재 온보딩 단계를 처리하고 있습니다.">
                            <p className="text-center text-slate-600">잠시 기다려주세요...</p>
                            {currentStepNumber > 0 && (
                                <div className="text-center mt-4">
                                    <Button variant="outline" onClick={handleBack}>
                                        이전 단계로
                                    </Button>
                                </div>
                            )}
                        </AuthLayout>
                    } />
                </Routes>
            </div>
        </div>
    );
};

export default OnboardingFlow;
