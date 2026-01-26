// @ts-nocheck
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clock, CheckCircle2, XCircle, FileText, Mail, Shield, ArrowRight } from 'lucide-react';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '../store/useOnboardingStore';

export const StatusStep: React.FC = () => {
    const { kycStatus, resetOnboarding } = useOnboardingStore();
    const navigate = useNavigate();
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);

    const mockRejectionReason = "Your documents were blurry and unreadable. Please re-upload clearer images.";

    const getStatusDisplay = () => {
        switch (kycStatus) {
            case 'pending':
                return {
                    title: 'Under Review',
                    description: 'Your application is being reviewed by our compliance team. This usually takes 1-2 business days.',
                    badgeVariant: 'default',
                    icon: <Clock className="h-12 w-12 text-yellow-500" />,
                    bgColor: 'bg-yellow-500/10',
                    borderColor: 'border-yellow-500/30',
                };
            case 'rejected':
                return {
                    title: 'Verification Failed',
                    description: mockRejectionReason,
                    badgeVariant: 'destructive',
                    icon: <XCircle className="h-12 w-12 text-destructive" />,
                    bgColor: 'bg-destructive/10',
                    borderColor: 'border-destructive/30',
                };
            case 'approved':
                return {
                    title: 'Verified',
                    description: 'Congratulations! Your identity has been verified. You now have full access to all features.',
                    badgeVariant: 'secondary',
                    icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
                    bgColor: 'bg-green-500/10',
                    borderColor: 'border-green-500/30',
                };
            case 'none':
            default:
                return {
                    title: 'Not Started',
                    description: 'Begin your identity verification to unlock all platform features.',
                    badgeVariant: 'default',
                    icon: <FileText className="h-12 w-12 text-muted-foreground" />,
                    bgColor: 'bg-muted',
                    borderColor: 'border-border',
                };
        }
    };

    const status = getStatusDisplay();
    const canSubmit = acceptedTerms && acceptedPrivacy;

    const handleResubmit = () => {
        resetOnboarding();
        navigate('/onboarding/register');
    };

    const handleGoToDashboard = () => {
        navigate('/trade');
    };

    const handleSubmitApplication = () => {
        // In a real app, this would submit the application
        navigate('/account');
    };

    return (
        <OnboardingLayout
            title="Review & Submit"
            description="Please review and accept the terms before submitting."
            showSecurityBadge={false}
        >
            <div className="space-y-6">
                {/* Status Card */}
                <div className={`p-6 rounded-xl border ${status.borderColor} ${status.bgColor} text-center`}>
                    <div className="flex justify-center mb-4">
                        {status.icon}
                    </div>
                    <Badge variant={status.badgeVariant as BadgeProps["variant"]} className="mb-3">
                        {status.title}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{status.description}</p>
                </div>

                {/* Terms Acceptance (only show if not yet submitted) */}
                {kycStatus === 'none' && (
                    <>
                        <div className="space-y-3">
                            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                                <Checkbox
                                    id="terms"
                                    checked={acceptedTerms}
                                    onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                                />
                                <label htmlFor="terms" className="text-sm text-foreground cursor-pointer leading-tight">
                                    I agree to the{' '}
                                    <a href="/legal" className="text-yellow-500 hover:underline">Terms of Service</a>{' '}
                                    and confirm that all information provided is accurate.
                                </label>
                            </div>

                            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                                <Checkbox
                                    id="privacy"
                                    checked={acceptedPrivacy}
                                    onCheckedChange={(checked) => setAcceptedPrivacy(checked === true)}
                                />
                                <label htmlFor="privacy" className="text-sm text-foreground cursor-pointer leading-tight">
                                    I consent to the processing of my personal data as described in the{' '}
                                    <a href="/legal" className="text-yellow-500 hover:underline">Privacy Policy</a>.
                                </label>
                            </div>
                        </div>

                        <Button
                            onClick={handleSubmitApplication}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                            disabled={!canSubmit}
                        >
                            Submit Application
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </>
                )}

                {/* Actions based on status */}
                {kycStatus === 'pending' && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                            <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                            <p className="text-xs text-muted-foreground">
                                We'll send you an email notification once your verification is complete.
                            </p>
                        </div>
                        <Button
                            onClick={handleGoToDashboard}
                            variant="outline"
                            className="w-full"
                        >
                            Continue to Dashboard
                        </Button>
                    </div>
                )}

                {kycStatus === 'rejected' && (
                    <div className="space-y-4">
                        <Alert variant="destructive">
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Action Required</AlertTitle>
                            <AlertDescription>
                                Please review the feedback above and resubmit your application with the corrected documents.
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={handleResubmit}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                        >
                            Resubmit Application
                        </Button>
                    </div>
                )}

                {kycStatus === 'approved' && (
                    <Button
                        onClick={handleGoToDashboard}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
                    >
                        Start Trading
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                )}

                {/* Security Notice */}
                <div className="flex items-start gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <Shield className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        Your data is encrypted and stored securely. We never share your personal information with third parties except as required by law.
                    </p>
                </div>
            </div>
        </OnboardingLayout>
    );
};
