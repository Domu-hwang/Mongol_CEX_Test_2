import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/trade');
    };

    return (
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center py-12">
            <AuthLayout
                title="Log In"
                subtitle="Enter your account details to continue."
            >
                <LoginForm onSuccess={handleSuccess} />
                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-primary-600 hover:underline"
                    >
                        Register Now
                    </button>
                </div>
            </AuthLayout>
        </div>
    );
};
