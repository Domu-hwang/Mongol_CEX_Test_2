import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { useProfile, useUpdateProfile } from '../hooks/useProfile';

interface ProfileSectionProps {
    user: {
        id: string;
        email: string;
        role: 'user' | 'admin';
        status: 'pending' | 'active' | 'suspended';
        createdAt: string;
        lastLogin?: string;
    } | null; // Allow user to be null
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ user }) => {
    const { user: fetchedUser, isLoading, error } = useProfile();
    const { mutateAsync: updateProfile, isLoading: isUpdating } = useUpdateProfile();

    const [email, setEmail] = useState(user?.email || '');

    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (email === user?.email) {
            // No change, maybe show a message or do nothing
            console.log("Email is the same, no update needed.");
            return;
        }
        try {
            await updateProfile({ email });
            console.log('Profile updated successfully');
            // Optionally, refresh user context or show a success toast
        } catch (err) {
            console.error('Failed to update profile:', err);
            // Error handling already in hook, maybe show an error toast
        }
    };

    if (isLoading) return <p>Loading profile...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;
    if (!user && !fetchedUser) return <p>No user data available.</p>;

    const displayUser = user || fetchedUser;

    return (
        <Card className="p-6 bg-gray-100 dark:bg-gray-800 border-none shadow-sm">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-semibold">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-4">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full"
                            placeholder="your.email@example.com"
                        />
                    </div>
                    <div>
                        <Label className="text-gray-700 dark:text-gray-300">User ID</Label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{displayUser?.id}</p>
                    </div>
                    <div>
                        <Label className="text-gray-700 dark:text-gray-300">Account Status</Label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white capitalize">{displayUser?.status}</p>
                    </div>
                    <div>
                        <Label className="text-gray-700 dark:text-gray-300">Member Since</Label>
                        <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {displayUser?.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                    </div>
                    <Button type="submit" disabled={isUpdating} variant="default">
                        {isUpdating ? 'Saving...' : 'Update Profile'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileSection;
