import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
    identifier: z.string().min(1, 'Please enter your email or phone number.'),
    password: z.string().min(1, 'Please enter your password.'),
});

interface LoginFormProps {
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
    const { login, isLoading } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ identifier: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setServerError('');

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                identifier: fieldErrors.identifier?.[0] || '',
                password: fieldErrors.password?.[0] || '',
            });
            return;
        }

        setErrors({});

        try {
            await login(result.data.identifier, result.data.password);
            onSuccess?.();
            navigate('/trade'); // Redirect to trade page on successful login
        } catch (error: any) {
            setServerError(error.message || 'Login failed. Please check your email/phone and password.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {serverError && <p className="text-danger-600 text-sm">{serverError}</p>}
            <Input
                label="Email or Phone Number"
                type="text"
                placeholder="example@cex.mn or +976 ..."
                value={formData.identifier}
                onChange={(e) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
                error={errors.identifier}
                autoComplete="username"
            />
            <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                error={errors.password}
                autoComplete="current-password"
            />
            <Button type="submit" className="w-full mt-6" disabled={isLoading} isLoading={isLoading}>
                Login
            </Button>
            <p className="text-center text-sm text-gray-500 mt-4">
                Don't have an account? <a href="/register" className="text-primary-600 hover:underline">Register</a>
            </p>
        </form>
    );
};

export default LoginForm;
