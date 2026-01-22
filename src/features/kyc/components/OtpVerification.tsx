import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@/components/ui/input-otp';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '../../auth/hooks/useAuth';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
import { useOnboardingStore } from '../store/useOnboardingStore';

const otpSchema = z.object({
    otp: z.string().min(6, 'OTP must be 6 digits.').max(6, 'OTP must be 6 digits.'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpVerificationProps {
    // This could receive a destination for redirection, or an identifier for OTP verification
    identifier?: string; // e.g., email or phone number
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ identifier }) => {
    const navigate = useNavigate();
    const { verifyOtp, sendOtp, isLoading } = useAuth();
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [serverError, setServerError] = useState('');
    const { nextStep } = useOnboardingStore();

    const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
    });

    useEffect(() => {
        // Use 'any' or 'number' for timer to bypass NodeJS namespace error in browser context
        let timer: any;
        if (isResendDisabled && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0) {
            setIsResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown, isResendDisabled]);

    const handleResend = async () => {
        setServerError('');
        try {
            await sendOtp(identifier || '');
            setCountdown(60);
            setIsResendDisabled(true);
            form.setValue('otp', '');
        } catch (error: any) {
            setServerError(error.message || 'Failed to resend OTP. Please try again.');
        }
    };

    const onSubmit = async (values: OtpFormValues) => {
        setServerError('');
        try {
            await verifyOtp(identifier || '', values.otp);
            nextStep(); // Move to the next onboarding step (ResidenceStep)
        } catch (error: any) {
            setServerError(error.message || 'OTP verification failed. Please try again.');
        }
    };

    return (
        <OnboardingLayout title="Verify Your Account">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <CardHeader className="text-center">
                        <CardTitle>Enter OTP</CardTitle>
                        <CardDescription>
                            We have sent a 6-digit code to your {identifier ? identifier.includes('@') ? 'email' : 'phone number' : 'registered account'}.
                        </CardDescription>
                        {serverError && (
                            <p className="text-destructive text-sm mt-2">{serverError}</p>
                        )}
                    </CardHeader>
                    <div className="flex justify-center">
                        <FormField
                            control={form.control}
                            name="otp"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="sr-only">One-Time Password</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field} >
                                            <InputOTPGroup>
                                                <InputOTPSlot />
                                                <InputOTPSlot />
                                                <InputOTPSlot />
                                            </InputOTPGroup>
                                            <InputOTPSeparator />
                                            <InputOTPGroup>
                                                <InputOTPSlot />
                                                <InputOTPSlot />
                                                <InputOTPSlot />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="text-center text-sm">
                        {isResendDisabled ? (
                            <p className="text-muted-foreground">Resend code in {countdown}s</p>
                        ) : (
                            <Button variant="link" onClick={handleResend} disabled={isLoading}>
                                Resend Code
                            </Button>
                        )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading || !form.formState.isValid}>
                        Verify
                    </Button>
                </form>
            </Form>
        </OnboardingLayout>
    );
};
