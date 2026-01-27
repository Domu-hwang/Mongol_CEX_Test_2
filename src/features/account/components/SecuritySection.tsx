import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import PasswordChangeForm from './PasswordChangeForm';

const SecuritySection: React.FC = () => {
    // Mock 2FA status
    const is2faEnabled = false;

    const handle2FAToggle = () => {
        console.log('Toggling 2FA settings');
        // Implement 2FA setup/disable logic here
    };

    return (
        <Card className="p-6 bg-card border border-border shadow-sm">
            <CardHeader className="p-0 mb-4">
                <CardTitle className="text-xl font-semibold text-foreground">Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-0 space-y-6">
                {/* Password Change */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground">Change Password</h3>
                    <PasswordChangeForm />
                </div>

                {/* 2FA Setup */}
                <div className="space-y-4 border-t border-border pt-6">
                    <h3 className="text-lg font-medium text-foreground">Two-Factor Authentication (2FA)</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-muted-foreground">Status</Label>
                            <p className="text-sm font-semibold text-foreground">
                                {is2faEnabled ? 'Enabled' : 'Disabled'}
                            </p>
                        </div>
                        <Button variant="yellow" onClick={handle2FAToggle}>
                            {is2faEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Two-factor authentication adds an extra layer of security to your account.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};

export default SecuritySection;
