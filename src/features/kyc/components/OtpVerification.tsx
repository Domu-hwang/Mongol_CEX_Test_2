import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Use standard Input
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/features/auth/AuthContext';
import OnboardingLayout from '@/components/layout/OnboardingLayout';
const otpSchema = z.object({
    otp: z.string().min(6, 'OTP must be 6 digits.').max(6, 'OTP must be 6 digits.'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpVerificationProps {
    identifier?: string; // e.g., email or phone number
    onSuccess?: () => void; // Callback to notify parent on successful OTP verification
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ identifier, onSuccess }) => {
    const navigate = useNavigate();
    const { verifyOtp, sendOtp, isLoading } = useAuth();
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [serverError, setServerError] = useState('');
    const [otpValue, setOtpValue] = useState(''); // Local state for OTP input

    const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '', // Keep default value for validation, but manage actual input via otpValue
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
            onSuccess?.(); // Call onSuccess callback
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
                                        <Input
                                            type="text"
                                            maxLength={6}
                                            placeholder="Enter 6-digit OTP"
                                            {...field}
                                        />
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
