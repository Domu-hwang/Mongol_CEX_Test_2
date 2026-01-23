import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Assuming cn utility is available for class merging

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const sidebarLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Trade', href: '/trade' },
    { name: 'Quick Swap', href: '/quick-swap' },
    { name: 'Wallet', href: '/wallet' },
    { name: 'Account', href: '/account' },
    { name: 'Support', href: '/support' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const location = useLocation();

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="p-4 flex justify-between items-center border-b border-gray-700">
                <h2 className="text-xl font-bold text-yellow-500">Mongol CEX</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <nav className="mt-5">
                <ul className="space-y-2">
                    {sidebarLinks.map((link) => (
                        <li key={link.name}>
                            <Link
                                to={link.href}
                                onClick={onClose}
                                className={cn(
                                    "flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-700",
                                    location.pathname === link.href
                                        ? "bg-yellow-500 text-black"
                                        : "text-gray-300 hover:text-white"
                                )}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};
