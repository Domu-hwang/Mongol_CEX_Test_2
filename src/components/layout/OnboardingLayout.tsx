import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'; // Assuming Card is in ui
import { Stepper } from '../ui/Stepper'; // Assuming Stepper is in ui
import { useOnboardingStore } from '../../store/useOnboardingStore';
import { getOnboardingSteps, REGULATED_COUNTRIES } from '../../constants/policy';

interface OnboardingLayoutProps {
    children: React.ReactNode;
    title: string;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({ children, title }) => {
    const { currentStep, residenceCountry } = useOnboardingStore();
    const isPOARequired = residenceCountry ? REGULATED_COUNTRIES.includes(residenceCountry) : false;
    const steps = getOnboardingSteps(isPOARequired);

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
            {/* Stepper is now above the card, not inside it */}
            <div className="w-full max-w-[480px] mb-8">
                <Stepper currentStep={currentStep} steps={steps} />
            </div>
            <Card className="w-full max-w-[480px]">
                <CardHeader className="text-center">
                    {/* Replace with actual logo or company name */}
                    <div className="mb-4 text-2xl font-bold">Mongol CEX</div>
                    <CardTitle className="text-3xl font-bold">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                    {children}
                </CardContent>
            </Card>
        </div>
    );
};

export default OnboardingLayout;
