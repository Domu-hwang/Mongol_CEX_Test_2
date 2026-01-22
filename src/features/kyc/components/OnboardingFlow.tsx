import React, { useEffect } from 'react';
import { useNavigate, Routes, Route, useParams } from 'react-router-dom';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '@/features/kyc/store/useOnboardingStore';
import { getOnboardingSteps } from '@/constants/policy';
import { Stepper } from '@/components/ui/Stepper'; // Re-added Stepper import

import { RegisterForm } from '@/features/auth/components/RegisterForm'; // Assuming RegisterForm and OtpVerification remain in auth
import { OtpVerification } from './OtpVerification'; // Corrected import path, as OtpVerification is in the same directory
import { ResidenceStep } from './ResidenceStep';
import { ProfileStep } from './ProfileStep';
import { DocumentUploadStep } from './DocumentUploadStep';
import { POAStep } from './POAStep';
import { StatusStep } from './StatusStep';

const OnboardingFlow: React.FC = () => {
    const navigate = useNavigate();
    const { currentStep, nextStep, prevStep, isPOARequired } = useOnboardingStore((state) => ({
        currentStep: state.currentStep,
        nextStep: state.nextStep,
        prevStep: state.prevStep,
        isPOARequired: state.isPOARequired,
    }));
    const onboardingSteps = getOnboardingSteps(isPOARequired);

    const { '*': currentPath = '' } = useParams<{ '*': string }>();

    console.log('OnboardingFlow mounted.');
    console.log('Current Step (Zustand):', currentStep);
    console.log('Is POA Required:', isPOARequired);
    console.log('Onboarding Steps:', onboardingSteps);
    console.log('Current Path (from URL params):', currentPath);

    useEffect(() => {
        console.log('OnboardingFlow useEffect triggered.');
        const currentStepIdFromUrl = currentPath.split('/')[0];
        const stepIndex = onboardingSteps.findIndex(step => step.id === currentStepIdFromUrl);

        console.log('Current Step ID from URL:', currentStepIdFromUrl);
        console.log('Found Step Index:', stepIndex);

        if (stepIndex === -1 || currentStepIdFromUrl === '') {
            console.log('Redirecting to first step:', onboardingSteps[0].id);
            navigate(onboardingSteps[0].id, { replace: true });
        }
    }, [currentPath, onboardingSteps, navigate]);

    const handleNext = () => {
        console.log('handleNext called. Current step:', currentStep);
        nextStep();
        const nextStepObj = onboardingSteps[currentStep + 1];
        if (nextStepObj) {
            navigate(nextStepObj.id);
            console.log('Navigating to next step:', nextStepObj.id);
        } else {
            navigate('/dashboard', { replace: true });
            console.log('End of onboarding, navigating to dashboard.');
        }
    };

    const handleBack = () => {
        console.log('handleBack called. Current step:', currentStep);
        prevStep();
        const prevStepObj = onboardingSteps[currentStep - 1];
        if (prevStepObj) {
            navigate(prevStepObj.id);
            console.log('Navigating to previous step:', prevStepObj.id);
        } else {
            navigate('/register', { replace: true });
            console.log('At first step, navigating to register.');
        }
    };

    // Render individual step components directly, wrapped by OnboardingLayout
    return (
        <div className="mx-auto flex flex-grow max-w-6xl flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-5xl space-y-12">
                {/* Stepper is outside of the route elements, rendered consistently */}
                <div className="px-10">
                    <Stepper steps={onboardingSteps} currentStep={currentStep} />
                </div>

                <Routes>
                    <Route path={onboardingSteps[0].id} element={
                        <OnboardingLayout title="Create Your Account">
                            <RegisterForm onSuccess={handleNext} />
                        </OnboardingLayout>
                    } />
                    <Route path={onboardingSteps[1].id} element={
                        <OnboardingLayout title="Verify Your Account">
                            <OtpVerification identifier="user@example.com" />
                            <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleBack}>
                                Previous Step
                            </button>
                        </OnboardingLayout>
                    } />
                    <Route path={onboardingSteps[2].id} element={
                        <OnboardingLayout title="Country of Residence">
                            <ResidenceStep />
                            <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleBack}>
                                Previous Step
                            </button>
                        </OnboardingLayout>
                    } />
                    <Route path={onboardingSteps[3].id} element={
                        <OnboardingLayout title="Personal Information">
                            <ProfileStep />
                            <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleBack}>
                                Previous Step
                            </button>
                        </OnboardingLayout>
                    } />
                    <Route path={onboardingSteps[4].id} element={
                        <OnboardingLayout title="Nationality & ID Document">
                            <DocumentUploadStep />
                            <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleBack}>
                                Previous Step
                            </button>
                        </OnboardingLayout>
                    } />

                    {isPOARequired && (
                        <Route path="poa" element={
                            <OnboardingLayout title="Proof of Address">
                                <POAStep />
                                <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleBack}>
                                    Previous Step
                                </button>
                            </OnboardingLayout>
                        } />
                    )}

                    <Route path="review" element={
                        <OnboardingLayout title="Review Your Application">
                            <StatusStep />
                            <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleBack}>
                                Previous Step
                            </button>
                        </OnboardingLayout>
                    } />

                    <Route path="*" element={
                        <OnboardingLayout title="Page Not Found">
                            <p>The onboarding step you are looking for does not exist.</p>
                            <button className="w-full text-sm text-muted-foreground hover:underline" onClick={() => navigate('/')}>Go to Home</button>
                        </OnboardingLayout>
                    } />
                </Routes>
            </div>
        </div>
    );
};

export default OnboardingFlow;
