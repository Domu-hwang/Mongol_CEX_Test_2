import React, { FormEvent, useState } from 'react';
import { z } from 'zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const registerSchema = z.object({
    email: z.string().email('이메일 형식이 올바르지 않습니다'),
    password: z
        .string()
        .min(8, '8자 이상 입력해주세요')
        .regex(/[A-Z]/, '대문자를 최소 1개 포함해야 합니다')
        .regex(/[0-9]/, '숫자를 최소 1개 포함해야 합니다')
        .regex(/[^A-Za-z0-9]/, '특수문자를 최소 1개 포함해야 합니다'),
});

interface RegisterFormProps {
    onSubmit?: (payload: { email: string; password: string }) => Promise<void> | void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        const result = registerSchema.safeParse(formData);

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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Email"
                type="email"
                placeholder="institution@cex.mn"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                error={errors.email}
                autoComplete="email"
            />

            <Input
                label="Password"
                type="password"
                placeholder="최소 8자, 대문자/숫자/특수문자 포함"
                value={formData.password}
                onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                error={errors.password}
                autoComplete="new-password"
            />

            <Button type="submit" className="w-full" disabled={isSubmitting} isLoading={isSubmitting}>
                계정 생성
            </Button>
        </form>
    );
};
