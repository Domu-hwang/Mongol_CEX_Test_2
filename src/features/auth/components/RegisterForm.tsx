import React, { FormEvent, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const registerSchema = z.object({
    email: z.string().email('Invalid email format').optional(),
    phone: z.string().min(8, 'Invalid phone number').optional(),
    password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/[A-Z]/, 'At least one uppercase letter')
        .regex(/[0-9]/, 'At least one number')
        .regex(/[^A-Za-z0-9]/, 'At least one special character'),
});

interface RegisterFormProps {
    onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
    const { register, isLoading } = useAuth();
    const navigate = useNavigate();
    const [authType, setAuthType] = useState<'email' | 'phone'>('email');
    const [formData, setFormData] = useState({ email: '', phone: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');

    // Real-time password validation logic
    const passwordRequirements = useMemo(() => {
        const p = formData.password;
        return [
            { label: 'Minimum 8 characters', met: p.length >= 8 },
            { label: 'At least 1 number', met: /[0-9]/.test(p) },
            { label: 'At least 1 upper case', met: /[A-Z]/.test(p) },
            { label: 'At least 1 special character', met: /[^A-Za-z0-9]/.test(p) },
        ];
    }, [formData.password]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setServerError(''); // Clear previous server errors

        // Prepare validation object based on authType
        const validationData = {
            password: formData.password,
            ...(authType === 'email' ? { email: formData.email } : { phone: formData.phone })
        };

        const result = registerSchema.safeParse(validationData);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                email: fieldErrors.email?.[0] || '',
                phone: fieldErrors.phone?.[0] || '',
                password: fieldErrors.password?.[0] || '',
            });
            return;
        }

        setErrors({});

        try {
            await register(
                authType === 'email' ? result.data.email! : result.data.phone!,
                result.data.password
            );
            onSuccess?.();
            navigate('/trade'); // Redirect to trade page on successful registration
        } catch (error: any) {
            setServerError(error.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="space-y-6">
            <Tabs
                value={authType}
                onValueChange={(val: string) => setAuthType(val as 'email' | 'phone')}
                className="w-full"
            >
                <TabsList className="grid w-full grid-cols-2 bg-secondary-700/50 p-1 rounded-lg border border-secondary-600">
                    <TabsTrigger
                        value="email"
                        className="text-sm py-2 data-[state=active]:bg-secondary-600 data-[state=active]:text-primary-600"
                    >
                        Email
                    </TabsTrigger>
                    <TabsTrigger
                        value="phone"
                        className="text-sm py-2 data-[state=active]:bg-secondary-600 data-[state=active]:text-primary-600"
                    >
                        Phone
                    </TabsTrigger>
                </TabsList>
                {/* RegisterForm does not use TabsContent directly, its content is below the Tabs component */}
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
                {authType === 'email' ? (
                    <Input
                        label="Email"
                        type="email"
                        placeholder="example@cex.mn"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        error={errors.email}
                        autoComplete="email"
                    />
                ) : (
                    <Input
                        label="Phone Number"
                        type="tel"
                        placeholder="+976 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        error={errors.phone}
                        autoComplete="tel"
                    />
                )}

                <Input
                    label="Password"
                    type="password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    error={errors.password}
                    autoComplete="new-password"
                />

                {/* Password Requirements Checklist */}
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    {passwordRequirements.map((req, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 transition-colors">
                            {req.met ? (
                                <Check size={12} className="text-success-600" />
                            ) : (
                                <div className="w-2.5 h-2.5 rounded-full border border-gray-600" />
                            )}
                            <span className={req.met ? 'text-gray-300' : 'text-gray-500'}>
                                {req.label}
                            </span>
                        </div>
                    ))}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-secondary-700 font-bold"
                    disabled={isLoading}
                    isLoading={isLoading}
                >
                    Create Account
                </Button>
            </form>
        </div>
    );
};
