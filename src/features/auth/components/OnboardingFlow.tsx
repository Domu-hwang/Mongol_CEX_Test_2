import React, { useState } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import { KycIntro } from './KycIntro';
import { KycProfileForm } from './KycProfileForm';
import { AuthLayout } from './AuthLayout';
import { Stepper } from '@/components/ui/Stepper';
import { Button } from '@/components/ui/Button';
import { KYC_POLICIES, getOnboardingSteps } from '@/constants/policy'; // Import policy constants
import { useAuth } from '../hooks/useAuth'; // Import useAuth hook

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
    const { completeKyc, isLoading } = useAuth(); // Get completeKyc and isLoading from useAuth

    const currentStepIndex = onboardingSteps.findIndex(step => currentPath.startsWith(step.id));
    const currentStepId = onboardingSteps[currentStepIndex !== -1 ? currentStepIndex : 0].id;
    const currentStepNumber = currentStepIndex !== -1 ? currentStepIndex : 0;

    const handleKycIntroStart = () => {
        navigate('profile');
    };

    const handleKycProfileSubmit = async (data: any) => {
        console.log('KYC Profile Submitted:', data);
        try {
            await completeKyc(data); // Call completeKyc from useAuth
            alert('KYC information submitted successfully!');
            navigate('/trade', { replace: true });
        } catch (error) {
            console.error('KYC submission failed:', error);
            alert('KYC information submission failed. Please try again.');
        }
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
        <div className="mx-auto flex flex-grow max-w-6xl flex-col items-center justify-center px-4 py-12"> {/* Removed min-h-screen and bg-[#0b0e11] */}
            <div className="w-full max-w-5xl space-y-12">
                <div className="px-10">
                    <Stepper steps={onboardingSteps} currentStep={currentStepNumber} />
                </div>

                <Routes>
                    <Route path="intro" element={
                        <AuthLayout
                            title="Start KYC"
                            subtitle="Begin your identity verification to gain trading privileges."
                        >
                            <KycIntro onStart={handleKycIntroStart} />
                        </AuthLayout>
                    } />
                    <Route path="profile" element={
                        <AuthLayout
                            title="KYC Basic Information"
                            subtitle="Enter your personal information to proceed with identity verification."
                            sideContent={
                                <div>
                                    <p className="font-semibold">KYC Steps</p>
                                    <p className="text-sm text-slate-500">
                                        Stepper for tracking your progress.
                                    </p>
                                    {currentStepNumber > 0 && (
                                        <Button variant="outline" onClick={handleBack} className="mt-4">
                                            Previous Step
                                        </Button>
                                    )}
                                </div>
                            }
                        >
                            <KycProfileForm onSubmit={handleKycProfileSubmit} isLoading={isLoading} />
                        </AuthLayout>
                    } />
                    {/* Future routes for document upload and review */}
                    <Route path="*" element={
                        <AuthLayout title="Onboarding in Progress" subtitle="We are processing your onboarding steps.">
                            <p className="text-center text-slate-600">Please wait...</p>
                            {currentStepNumber > 0 && (
                                <div className="text-center mt-4">
                                    <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                                        Previous Step
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
