import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input'; // Reverted to shadcn/ui Input
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import { useAuth } from '../AuthContext';
import VerificationPromptDialog from './VerificationPromptDialog'; // Import the new dialog component
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';

const registerSchema = z
    .object({
        authType: z.literal('email').or(z.literal('phone')),
        email: z.string().email('Invalid email format').optional(),
        phone: z.string().min(8, 'Invalid phone number').optional(),
        password: z
            .string()
            .min(8, 'At least 8 characters')
            .regex(/[A-Z]/, 'At least one uppercase letter')
            .regex(/[0-9]/, 'At least one number')
            .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'At least one special character'), // Restored original password regex
    })
    .superRefine((data, ctx) => {
        if (data.authType === 'email' && !data.email) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Email is required',
                path: ['email'],
            });
        }
        if (data.authType === 'phone' && !data.phone) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Phone number is required',
                path: ['phone'],
            });
        }
    });

type RegisterFormValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
    onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const { register: authRegister, isLoading } = useAuth();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            authType: 'email',
            email: undefined,
            phone: undefined,
            password: '',
        },
        mode: 'onChange',
    });

    const authType = form.watch('authType');
    const password = form.watch('password');

    const passwordRequirements = useMemo(() => {
        const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
        return [
            { label: 'Minimum 8 characters', met: password.length >= 8 },
            { label: 'At least 1 number', met: /[0-9]/.test(password) },
            { label: 'At least 1 upper case', met: /[A-Z]/.test(password) },
            { label: 'At least 1 special character', met: specialCharRegex.test(password) },
        ];
    }, [password]);

    const onSubmit = async (values: RegisterFormValues) => {
        setServerError('');
        try {
            const identifier = values.authType === 'email' ? values.email! : values.phone!;
            await authRegister(identifier, values.password);
            onSuccess?.(); // Call original onSuccess to potentially navigate to dashboard
        } catch (error: any) {
            setServerError(error.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div>
            <Tabs
                value={authType}
                onValueChange={(val) => {
                    form.setValue('authType', val as 'email' | 'phone');
                    form.clearErrors(['email', 'phone']);
                }}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email</TabsTrigger>
                    <TabsTrigger value="phone">Phone</TabsTrigger>
                </TabsList>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        {authType === 'email' ? (
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="example@cex.mn" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ) : (
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone Number</FormLabel>
                                        <FormControl>
                                            <Input type="tel" placeholder="+976 ..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Create a strong password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Requirements Checklist */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-foreground">
                            {passwordRequirements.map((req, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 transition-colors">
                                    {req.met ? (
                                        <Check size={12} className="text-success-foreground" />
                                    ) : (
                                        <div className="w-2.5 h-2.5 rounded-full border border-muted" />
                                    )}
                                    <span className={req.met ? 'text-foreground' : 'text-muted-foreground'}>
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {serverError && (
                            <p className="text-destructive text-sm text-center">{serverError}</p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading || !form.formState.isValid}
                            variant="yellow"
                            className="w-full mt-4"
                        >
                            Create Account
                        </Button>
                    </form>
                </Form>
            </Tabs>
        </div>
    );
};
