import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ProfileSection from './ProfileSection';
import SecuritySection from './SecuritySection';
import SettingsSection from './SettingsSection';
import UserAssetsSection from './UserAssetsSection';
import HistorySection from './HistorySection';
import VerificationStatusCard from './VerificationStatusCard';
import DepositOverviewCard from './DepositOverviewCard';
import TradeOverviewCard from './TradeOverviewCard';
import EstimatedBalanceSection from './EstimatedBalanceSection';
import MarketsSection from './MarketsSection';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Copy, ChevronRight, User, ShieldCheck, Settings, Wallet, ClipboardList, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { UserProfile } from '../types';
import { useAuth } from '@/features/auth/AuthContext';

const AccountView: React.FC = () => {
    const { isKycCompleted } = useAuth();
    const [activeSection, setActiveSection] = useState<'dashboard' | 'profile' | 'assets' | 'orders' | 'security' | 'settings'>('dashboard');

    // Mock user data for the profile summary
    const mockUser: UserProfile = {
        id: 'user-123',
        email: 'user@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2023-01-01T10:00:00Z',
        lastLogin: '2024-01-23T11:00:00Z',
        name: 'User-6cb43',
        uid: '1195386612',
        vipLevel: 'Regular User',
    };

    const sidebarItems = [
        { id: 'dashboard', label: 'Dashboard', icon: User },
        { id: 'profile', label: 'Account', icon: User },
        { id: 'assets', label: 'Assets', icon: Wallet },
        { id: 'orders', label: 'Orders', icon: ClipboardList },
        { id: 'security', label: 'Security', icon: ShieldCheck },
        { id: 'settings', label: 'Settings', icon: Settings },
    ] as const;

    const [currentStep, setCurrentStep] = useState(0); // 0: Verification in progress, 1: Deposit, 2: Trade

    const renderContent = () => {
        switch (activeSection) {
            case 'dashboard':
                return (
                    <>
                        {/* Need Verification Banner */}
                        {!isKycCompleted && (
                            <Card className="bg-yellow-500/10 border border-yellow-500 p-4 rounded-lg mb-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <AlertTriangle className="h-6 w-6 text-yellow-500" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-yellow-500">Need Verification</h3>
                                            <p className="text-gray-400 text-sm">Complete your identity verification to unlock all features.</p>
                                        </div>
                                    </div>
                                    <Link to="/onboarding">
                                        <Button variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                                            Verify Now
                                        </Button>
                                    </Link>
                                </div>
                            </Card>
                        )}

                        {/* User Profile Summary */}
                        <div className="bg-black p-6 rounded-lg shadow-md mb-8 flex items-center space-x-6">
                            <Avatar className="h-16 w-16 bg-yellow-500 text-black flex items-center justify-center font-bold text-xl">
                                <AvatarFallback>U</AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-1">{mockUser.name}</h2>
                                <div className="flex items-center space-x-4 text-gray-400 text-sm">
                                    <span>UID: {mockUser.uid} <Copy className="h-3 w-3 inline-block cursor-pointer" /></span>
                                    <span>VIP Level: {mockUser.vipLevel} <ChevronRight className="h-3 w-3 inline-block" /></span>
                                </div>
                            </div>
                        </div>

                        {/* Get Started Section */}
                        <Card className="bg-black p-6 rounded-lg shadow-md mb-8">
                            <h3 className="text-xl font-bold text-white mb-6">Get Started</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Step 1: Verification */}
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-4">
                                        <span className={cn(
                                            "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-medium",
                                            currentStep === 0
                                                ? "border-2 border-yellow-500 text-yellow-500"
                                                : currentStep > 0
                                                    ? "bg-yellow-500 text-black"
                                                    : "border-2 border-gray-600 text-gray-500"
                                        )}>
                                            {currentStep > 0 ? '✓' : '1'}
                                        </span>
                                        <span className="ml-3 text-sm text-gray-400">Verification</span>
                                        <div className="flex-1 h-[2px] bg-gray-700 ml-4 hidden md:block" />
                                    </div>
                                    <VerificationStatusCard />
                                </div>

                                {/* Step 2: Deposit */}
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-4">
                                        <span className={cn(
                                            "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-medium",
                                            currentStep === 1
                                                ? "border-2 border-yellow-500 text-yellow-500"
                                                : currentStep > 1
                                                    ? "bg-yellow-500 text-black"
                                                    : "border-2 border-gray-600 text-gray-500"
                                        )}>
                                            {currentStep > 1 ? '✓' : '2'}
                                        </span>
                                        <span className="ml-3 text-sm text-gray-400">Deposit</span>
                                        <div className="flex-1 h-[2px] bg-gray-700 ml-4 hidden md:block" />
                                    </div>
                                    <DepositOverviewCard />
                                </div>

                                {/* Step 3: Trade */}
                                <div className="flex flex-col">
                                    <div className="flex items-center mb-4">
                                        <span className={cn(
                                            "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-medium",
                                            currentStep === 2
                                                ? "border-2 border-yellow-500 text-yellow-500"
                                                : currentStep > 2
                                                    ? "bg-yellow-500 text-black"
                                                    : "border-2 border-gray-600 text-gray-500"
                                        )}>
                                            {currentStep > 2 ? '✓' : '3'}
                                        </span>
                                        <span className="ml-3 text-sm text-gray-400">Trade</span>
                                    </div>
                                    <TradeOverviewCard />
                                </div>
                            </div>
                        </Card>

                        {/* Estimated Balance Section */}
                        <div className="mb-8">
                            <EstimatedBalanceSection />
                        </div>

                        {/* Markets Section */}
                        <div>
                            <MarketsSection />
                        </div>
                    </>
                );
            case 'profile':
                return <ProfileSection user={mockUser} />;
            case 'assets':
                return <UserAssetsSection />;
            case 'orders':
                return <HistorySection />;
            case 'security':
                return <SecuritySection />;
            case 'settings':
                return <SettingsSection />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-1">
            {/* Sidebar */}
            <aside className="w-64 bg-black border-r border-gray-800 p-6"> {/* Changed background to black */}
                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Button
                            key={item.id}
                            variant="ghost"
                            onClick={() => setActiveSection(item.id)}
                            className={cn(
                                "justify-start gap-3 w-full",
                                activeSection === item.id
                                    ? "bg-yellow-500 text-black hover:bg-yellow-600"
                                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Button>
                    ))}
                </nav>
            </aside>

            {/* Content Area */}
            <main className="flex-1 pl-[8vh]"> {/* Added left padding for gap */}
                {renderContent()}
            </main>
        </div>
    );
};

export default AccountView;
