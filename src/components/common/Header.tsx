import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/AuthContext';
import { Navigation } from '../layout/Navigation';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Globe, ChevronDown } from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type Language = 'en' | 'ko' | 'mn';

const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'mn', label: 'Монгол', flag: '🇲🇳' },
];

const Header: React.FC = () => {
    const { isAuthenticated, isKycCompleted } = useAuth();
    const [language, setLanguage] = useState<Language>('en');
    const [langOpen, setLangOpen] = useState(false);

    const currentLang = languages.find(l => l.code === language);

    return (
        <header className="bg-background text-foreground p-4 flex justify-between items-center shadow-md border-b border-border">
            <div className="flex items-center space-x-6">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary flex items-center">
                    Mongol CEX
                </Link>

                {/* Main Navigation */}
                <Navigation />
            </div>

            {/* Right-aligned buttons */}
            <div className="flex items-center space-x-4">
                {/* Language Selector */}
                <Popover open={langOpen} onOpenChange={setLangOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <Globe className="h-4 w-4" />
                            <span className="text-sm">{currentLang?.flag}</span>
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-1" align="end">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setLangOpen(false);
                                }}
                                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${language === lang.code
                                    ? 'bg-primary/10 text-primary'
                                    : 'hover:bg-muted text-foreground'
                                    }`}
                            >
                                <span>{lang.flag}</span>
                                <span>{lang.label}</span>
                            </button>
                        ))}
                    </PopoverContent>
                </Popover>

                {/* Deposit CTA - Redirects to register if not authenticated */}
                <Link to={isAuthenticated ? "/wallet/deposit" : "/register"}>
                    <Button variant="default">
                        Deposit
                    </Button>
                </Link>

                {isAuthenticated ? (
                    <Link to="/account" className="relative">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        {/* Notification badge if KYC is not completed */}
                        {!isKycCompleted && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-background bg-red-500" />
                        )}
                    </Link>
                ) : (
                    <div className="flex items-center space-x-2">
                        <Link to="/login">
                            <Button variant="outline">Log In</Button>
                        </Link>
                        <Link to="/register">
                            <Button variant="secondary" className="text-black">Sign Up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
