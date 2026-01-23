import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SettingsSection: React.FC = () => {
    const [notifications, setNotifications] = useState(true);
    const [currency, setCurrency] = useState('USD');
    const [language, setLanguage] = useState('en');

    return (
        <Card className="bg-background border-none shadow-none">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl font-semibold">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="px-0 space-y-6">

                {/* Preferences */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">Preferences</h3>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Currency</Label>
                            <p className="text-sm text-muted-foreground">
                                Select your preferred display currency.
                            </p>
                        </div>
                        <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="USD">USD ($)</SelectItem>
                                <SelectItem value="EUR">EUR (€)</SelectItem>
                                <SelectItem value="MNT">MNT (₮)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Language</Label>
                            <p className="text-sm text-muted-foreground">
                                Select your preferred language.
                            </p>
                        </div>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="mn">Mongolian</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Notifications */}
                <div className="space-y-4 pt-4 border-t border-border">
                    <h3 className="text-lg font-medium">Notifications</h3>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive emails about account activity and updates.
                            </p>
                        </div>
                        <Switch
                            checked={notifications}
                            onCheckedChange={setNotifications}
                        />
                    </div>
                </div>

            </CardContent>
        </Card>
    );
};

export default SettingsSection;
