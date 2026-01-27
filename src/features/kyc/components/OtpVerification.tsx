import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthContext';

const otpSchema = z.object({
    otp: z.string().min(6, 'OTP must be 6 digits.').max(6, 'OTP must be 6 digits.'),
});

type OtpFormValues = z.infer<typeof otpSchema>;

interface OtpVerificationProps {
    identifier?: string;
    onSuccess?: () => void;
}

export const OtpVerification: React.FC<OtpVerificationProps> = ({ identifier, onSuccess }) => {
    const navigate = useNavigate();
    const { verifyOtp, sendOtp, isLoading } = useAuth();
    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [serverError, setServerError] = useState('');

    const form = useForm<OtpFormValues>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            otp: '',
        },
    });

    useEffect(() => {
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
            onSuccess?.();
        } catch (error: any) {
            setServerError(error.message || 'OTP verification failed. Please try again.');
        }
    };

    const maskedIdentifier = identifier
        ? identifier.replace(/(.{2})(.*)(@.*)/, '$1***$3')
        : 'your email';

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Sent Notice */}
                <div className="flex items-center justify-center gap-3 p-4 bg-muted/50 rounded-lg border border-border">
                    <div className="w-10 h-10 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-medium text-foreground">Verification code sent</p>
                        <p className="text-xs text-muted-foreground">Check {maskedIdentifier}</p>
                    </div>
                </div>

                {serverError && (
                    <Alert variant="destructive">
                        <AlertDescription>{serverError}</AlertDescription>
                    </Alert>
                )}

                <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-foreground">Verification Code</FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    maxLength={6}
                                    placeholder="Enter 6-digit code"
                                    className="text-center text-lg tracking-widest font-mono"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="text-center text-sm">
                    {isResendDisabled ? (
                        <p className="text-muted-foreground">
                            Didn't receive the code? Resend in <span className="font-medium text-foreground">{countdown}s</span>
                        </p>
                    ) : (
                        <Button variant="link" onClick={handleResend} disabled={isLoading} className="p-0 h-auto">
                            Resend verification code
                        </Button>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full font-medium"
                    disabled={isLoading || !form.formState.isValid}
                    variant="yellow"
                >
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Button>

                {/* Security Notice */}
                <div className="flex items-start gap-2 p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-muted-foreground">
                        This verification protects your account from unauthorized access. Never share this code with anyone.
                    </p>
                </div>
            </form>
        </Form>
    );
};
