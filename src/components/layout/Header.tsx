import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-[#181a20] py-4 text-[#eaecef] border-b border-gray-800 w-full shrink-0">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <a href="/" className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-primary-600"></div>
                        <span className="text-xl font-bold tracking-tight text-white hover:text-primary-600 transition-colors">Mongol CEX</span>
                    </a>
                    <nav className="hidden lg:block">
                        <ul className="flex items-center gap-6 text-sm font-medium">
                            <li><a href="/trade" className="hover:text-primary-600 transition-colors">Markets</a></li>
                            <li><a href="/trade" className="hover:text-primary-600 transition-colors">Trade</a></li>
                        </ul>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-2">
                        <a href="/login" className="px-4 py-2 text-sm font-medium hover:text-primary-600 transition-colors">Log In</a>
                        <a href="/register" className="rounded bg-primary-600 px-4 py-2 text-sm font-bold text-[#181a20] hover:bg-primary-700 transition-colors">Register</a>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
