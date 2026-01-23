import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSuccess = () => {
        navigate('/account'); // Navigate to the account page after successful registration
    };

    return (
        <div className="flex flex-grow items-center justify-center py-12">
            <AuthLayout
                title="Create Account"
                subtitle="Join Mongol CEX and start trading today."
                helperText="By creating an account, you agree to our Terms of Service and Privacy Policy."
            >
                <RegisterForm onSuccess={handleSuccess} />
                <div className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-primary-600 hover:underline"
                    >
                        Log In
                    </button>
                </div>
            </AuthLayout>
        </div>
    );
};
