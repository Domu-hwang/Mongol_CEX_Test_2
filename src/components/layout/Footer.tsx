import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-secondary text-white p-4 mt-8">
            <div className="container mx-auto text-center text-sm">
                &copy; {new Date().getFullYear()} Mongol CEX. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
