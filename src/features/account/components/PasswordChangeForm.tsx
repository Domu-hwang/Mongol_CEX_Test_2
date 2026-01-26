import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePassword } from '../hooks/useProfile';

const PasswordChangeForm: React.FC = () => {
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const { mutateAsync: changePassword, isLoading, error } = useChangePassword();
    const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setToastMessage(null); // Clear previous messages

        if (formData.newPassword !== formData.confirmPassword) {
            setToastMessage({ type: 'error', message: 'Passwords do not match' });
            return;
        }

        try {
            await changePassword({
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });
            setToastMessage({ type: 'success', message: 'Password changed successfully' });
            setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setToastMessage({ type: 'error', message: error || 'Failed to change password' });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {toastMessage && (
                <div className={`p-3 rounded-md text-white ${toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    {toastMessage.message}
                </div>
            )}
            <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                    id="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                />
            </div>

            <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                    id="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                />
            </div>

            <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="mt-1 block w-full"
                    required
                />
            </div>

            <Button type="submit" disabled={isLoading} variant="default">
                {isLoading ? 'Changing...' : 'Change Password'}
            </Button>
        </form>
    );
};

export default PasswordChangeForm;
