import React, { FormEvent, useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const loginSchema = z.object({
    email: z.string().email('이메일 형식이 올바르지 않습니다'),
    password: z.string().min(1, '비밀번호를 입력하세요'),
});

interface LoginFormProps {
    onSubmit?: (payload: { email: string; password: string }) => Promise<void> | void;
    onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, onSuccess }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors({
                email: fieldErrors.email?.[0] || '',
                password: fieldErrors.password?.[0] || '',
            });
            return;
        }

        setErrors({});
        setIsSubmitting(true);

        try {
            await onSubmit?.(result.data);
            onSuccess?.();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Email"
                type="email"
                placeholder="user@cex.mn"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                error={errors.email}
                autoComplete="email"
            />

            <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                error={errors.password}
                autoComplete="current-password"
            />

            <Button type="submit" className="w-full" disabled={isSubmitting} isLoading={isSubmitting}>
                로그인
            </Button>
        </form>
    );
};
