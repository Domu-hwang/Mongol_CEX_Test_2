import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, CheckCircle, XCircle } from 'lucide-react'; // Icons for different statuses
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '@/store/useOnboardingStore';

export const StatusStep: React.FC = () => {
    const { kycStatus, resetOnboarding } = useOnboardingStore();
    const navigate = useNavigate();

    const mockRejectionReason = "Your documents were blurry and unreadable. Please re-upload clearer images.";

    const getStatusDisplay = () => {
        switch (kycStatus) {
            case 'pending':
                return {
                    title: 'Review In Progress',
                    description: 'Your KYC application is currently under review. We will notify you once a decision has been made.',
                    badgeVariant: 'default',
                    icon: <Terminal className="h-4 w-4" />,
                };
            case 'rejected':
                return {
                    title: 'Application Rejected',
                    description: mockRejectionReason,
                    badgeVariant: 'destructive',
                    icon: <XCircle className="h-4 w-4" />,
                };
            case 'approved':
                return {
                    title: 'Application Approved!',
                    description: 'Congratulations! Your KYC application has been approved. You now have full access to our services.',
                    badgeVariant: 'secondary',
                    icon: <CheckCircle className="h-4 w-4" />,
                };
            case 'none':
            default:
                return {
                    title: 'No Application Submitted',
                    description: 'You have not submitted a KYC application yet. Please start the onboarding process.',
                    badgeVariant: 'default',
                    icon: <Terminal className="h-4 w-4" />,
                };
        }
    };

    const status = getStatusDisplay();

    const handleResubmit = () => {
        resetOnboarding();
        navigate('/onboarding/register');
    };

    const handleGoToDashboard = () => {
        navigate('/trade');
    };

    return (
        <OnboardingLayout title="KYC Application Status">
            <div className="space-y-6 text-center">
                <Badge variant={status.badgeVariant as 'default' | 'secondary' | 'destructive' | 'outline'} className="text-sm px-4 py-2">
                    {status.title}
                </Badge>
                {kycStatus === 'rejected' && (
                    <Alert variant="destructive">
                        {status.icon}
                        <AlertTitle>{status.title}</AlertTitle>
                        <AlertDescription>{status.description}</AlertDescription>
                    </Alert>
                )}
                {kycStatus !== 'rejected' && (
                    <Alert variant={status.badgeVariant === 'destructive' ? 'default' : status.badgeVariant as 'default' | 'secondary' | 'destructive'}>
                        {status.icon}
                        <AlertTitle>{status.title}</AlertTitle>
                        <AlertDescription>{status.description}</AlertDescription>
                    </Alert>
                )}

                {kycStatus === 'rejected' && (
                    <Button onClick={handleResubmit} className="w-full">
                        Resubmit Application
                    </Button>
                )}

                {kycStatus === 'approved' && (
                    <Button onClick={handleGoToDashboard} className="w-full">
                        Go to Dashboard
                    </Button>
                )}

                {kycStatus === 'none' && (
                    <Button onClick={handleResubmit} className="w-full">
                        Start Onboarding
                    </Button>
                )}
            </div>
        </OnboardingLayout>
    );
};
