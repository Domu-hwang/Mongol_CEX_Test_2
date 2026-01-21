import React from 'react';

const Navigation: React.FC = () => {
    return (
        <nav>
            <ul className="flex space-x-4">
                <li><a href="#" className="text-white hover:text-primary">Home</a></li>
                <li><a href="#" className="text-white hover:text-primary">Trade</a></li>
                <li><a href="#" className="text-white hover:text-primary">Wallet</a></li>
                <li><a href="#" className="text-white hover:text-primary">Account</a></li>
            </ul>
        </nav>
    );
};

export default Navigation;
