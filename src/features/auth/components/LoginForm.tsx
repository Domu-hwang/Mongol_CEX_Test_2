import React, { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'; // Import Label
import { useAuth } from '../AuthContext';

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
            {serverError && <p className="text-destructive-foreground text-sm">{serverError}</p>}

            <div className="grid gap-2">
                <Label htmlFor="identifier">Email or Phone Number</Label>
                <Input
                    id="identifier"
                    type="text"
                    placeholder="example@cex.mn or +976 ..."
                    value={formData.identifier}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, identifier: e.target.value }))}
                    autoComplete="username"
                />
                {errors.identifier && <p className="text-destructive-foreground text-sm">{errors.identifier}</p>}
            </div>

            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                    autoComplete="current-password"
                />
                {errors.password && <p className="text-destructive-foreground text-sm">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading} variant="default">
                Login
            </Button>
            <p className="text-center text-sm text-muted-foreground mt-4">
                Don't have an account? <Link to="/register" className="text-primary hover:underline">Register</Link>
            </p>
        </form>
    );
};

export default LoginForm;
