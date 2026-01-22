import React from 'react';
import { Link } from 'react-router-dom';

interface NavLinksProps {
    onLinkClick?: () => void; // Optional handler for when a link is clicked (e.g., to close a mobile menu)
}

const NavLinks: React.FC<NavLinksProps> = ({ onLinkClick }) => {
    // Updated navigation items based on user feedback
    const navItems = [
        { to: "/trade", label: "Trade" }, // Main Trade page
        { to: "/quick-swap", label: "Quick Swap" },
        { to: "/my-assets", label: "My assets" }, // Renamed from Portfolio
    ];

    return (
        <div className="flex space-x-6"> {/* Horizontal layout for top navigation */}
            {navItems.map((item) => (
                <Link
                    key={item.to}
                    to={item.to}
                    className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                    onClick={onLinkClick}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    );
};

export const Navigation: React.FC = () => {
    return (
        <nav className="flex items-center space-x-6">
            <NavLinks />
        </nav>
    );
};

export default NavLinks; // Export NavLinks as default for direct use if preferred
