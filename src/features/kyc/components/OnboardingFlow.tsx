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
    const currentStep = useOnboardingStore((state) => state.currentStep);
    const nextStep = useOnboardingStore((state) => state.nextStep);
    const prevStep = useOnboardingStore((state) => state.prevStep);
    const isPOARequired = useOnboardingStore((state) => state.isPOARequired);
    const onboardingSteps = getOnboardingSteps(isPOARequired);

    const { '*': currentPath = '' } = useParams<{ '*': string }>();

    console.log('OnboardingFlow mounted. URL Path (from useParams):', currentPath);
    console.log('OnboardingFlow mounted. Current Step (Zustand):', currentStep);
    console.log('OnboardingFlow mounted. Is POA Required:', isPOARequired);
    console.log('OnboardingFlow mounted. Onboarding Steps:', onboardingSteps.map(s => s.id));

    // The "register" step is considered pre-onboarding, so the stepper's
    // current step index needs to be adjusted relative to the actual onboarding steps.
    // Stepper starts visible from the 'otp' step, so its current step index needs adjustment.
    const stepperCurrentStep = currentPath === 'register' ? -1 : (currentPath === 'otp' ? 0 : onboardingSteps.findIndex(step => step.id === currentPath) + 1);

    useEffect(() => {
        console.log('OnboardingFlow useEffect triggered. currentPath:', currentPath, 'onboardingSteps:', onboardingSteps.map(s => s.id));
        // If user lands on base /onboarding/intro (empty currentPath after useParams) after registration,
        // redirect them to the 'otp' step.
        if (currentPath === '') {
            console.log('OnboardingFlow useEffect: Redirecting from base to OTP step.');
            navigate('otp', { replace: true });
            return;
        }

        // If it's not 'register' or 'otp', check if it's a valid onboarding step.
        const currentStepIndex = onboardingSteps.findIndex(step => step.id === currentPath);
        console.log('OnboardingFlow useEffect: currentStepIndex:', currentStepIndex);

        if (currentPath !== 'register' && currentPath !== 'otp' && currentStepIndex === -1) {
            console.log('OnboardingFlow useEffect: Unrecognized path, redirecting to first *onboarding* step:', onboardingSteps[0]?.id);
            if (onboardingSteps[0]) {
                navigate(onboardingSteps[0].id, { replace: true });
            } else {
                console.error('OnboardingFlow useEffect: No onboarding steps defined to redirect to.');
                navigate('/not-found', { replace: true }); // Fallback to a generic not found page
            }
        }
    }, [currentPath, onboardingSteps, navigate]);

    const handleNext = () => {
        console.log('handleNext called. currentPath:', currentPath, 'currentStep (Zustand):', currentStep, 'onboardingSteps:', onboardingSteps.map(s => s.id));
        let nextPath = '';

        if (currentPath === 'otp') {
            nextPath = onboardingSteps[0]?.id; // After OTP, go to the first actual onboarding step (residence)
            if (nextPath) {
                nextStep(); // Update Zustand store
            } else {
                console.error('handleNext: No first onboarding step defined after OTP.');
                nextPath = '/dashboard'; // Fallback
            }
        } else {
            const currentStepActualIndex = onboardingSteps.findIndex(step => step.id === currentPath);
            const nextStepObj = onboardingSteps[currentStepActualIndex + 1];
            if (nextStepObj) {
                nextPath = nextStepObj.id;
                nextStep(); // Update Zustand store
            } else {
                nextPath = '/dashboard'; // End of onboarding
            }
        }
        navigate(nextPath, { replace: true });
        console.log('handleNext: Navigating to next path:', nextPath);
    };

    const handleBack = () => {
        console.log('handleBack called. currentPath:', currentPath, 'currentStep (Zustand):', currentStep, 'onboardingSteps:', onboardingSteps.map(s => s.id));
        let prevPath = '';

        if (currentPath === 'otp') {
            prevPath = '/register'; // From OTP, go back to registration
            // No Zustand prevStep here as 'register' is not in onboardingSteps
            navigate(prevPath, { replace: true }); // Navigate directly
            console.log('handleBack: Navigating to previous path (register):', prevPath);
            return;
        }

        const currentStepActualIndex = onboardingSteps.findIndex(step => step.id === currentPath);
        const prevStepObj = onboardingSteps[currentStepActualIndex - 1];

        if (prevStepObj) {
            prevPath = prevStepObj.id;
            prevStep(); // Update Zustand store
        } else {
            // If at the first actual onboarding step (residence), go back to OTP
            prevPath = 'otp';
            // We need to ensure Zustand's currentStep is correctly reset for 'otp' when navigating back here
            // If currentStep is 0 (residence), going back to otp should set it to -1 effectively for stepper logic
            // For now, nextStep/prevStep modify currentStep (0 for residence -> 1 for profile etc.)
            // So if we go from residence (zustand currentStep 0) to otp, the zustand currentStep should effectively be -1 for stepper.
            // But nextStep/prevStep don't handle steps outside onboardingSteps.
            // Let's ensure prevStep() correctly decrements state without relying on it for 'otp' step.
            // It will decrement from 0 to -1, which matches stepperCurrentStep logic.
            prevStep();
        }
        navigate(prevPath, { replace: true });
        console.log('handleBack: Navigating to previous path:', prevPath);
    };

    return (
        <div className="mx-auto flex flex-grow max-w-6xl flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-5xl space-y-12">
                {/* Stepper is rendered conditionally, not on the initial 'register' step */}
                {currentPath !== 'register' && (
                    <div className="px-10">
                        <Stepper steps={onboardingSteps} currentStep={stepperCurrentStep} />
                    </div>
                )}

                <Routes>
                    {/* Explicit routes for pre-onboarding steps */}
                    <Route path="register" element={
                        <OnboardingLayout title="Create Your Account">
                            <RegisterForm onSuccess={() => navigate('otp', { replace: true })} />
                        </OnboardingLayout>
                    } />
                    <Route path="otp" element={
                        <OnboardingLayout title="Verify Your Account">
                            <OtpVerification identifier="user@example.com" onSuccess={handleNext} />
                            <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleBack}>
                                Previous Step
                            </button>
                        </OnboardingLayout>
                    } />

                    {/* Dynamic routes for actual onboarding steps (starting from 'residence') */}
                    {onboardingSteps.map((step, index) => (
                        <Route
                            key={step.id}
                            path={step.id}
                            element={
                                <OnboardingLayout title={step.label === 'Review' ? 'Review Your Application' : step.description}>
                                    {step.id === 'residence' && <ResidenceStep onSuccess={handleNext} />}
                                    {step.id === 'profile' && <ProfileStep onSuccess={handleNext} />}
                                    {step.id === 'nationality' && <DocumentUploadStep />}
                                    {step.id === 'poa' && <POAStep />}
                                    {step.id === 'review' && <StatusStep />}

                                    <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleBack}>
                                        Previous Step
                                    </button>
                                    {step.id !== 'review' && (
                                        <button className="mt-4 w-full text-sm text-muted-foreground hover:underline" onClick={handleNext}>
                                            Next Step
                                        </button>
                                    )}
                                </OnboardingLayout>
                            }
                        />
                    ))}

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
