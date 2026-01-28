import React, { useState } from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';
import { Sidebar } from '../components/layout/Sidebar'; // Import the new Sidebar
import { useLocation } from 'react-router-dom'; // Import useLocation

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation(); // Get current location

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const hideFooter = location.pathname === '/trade' || location.pathname === '/quick-swap';

    const isFullWidthPage = location.pathname === '/' || location.pathname.startsWith('/trade');

    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <div className="flex-1 flex flex-col w-full" style={{ marginLeft: isSidebarOpen ? '16rem' : '0' }}>
                <Header onMenuClick={toggleSidebar} />
                <main className={`flex-1 ${isFullWidthPage ? 'p-0' : 'container mx-auto px-4 max-w-7xl py-6'}`}>{children}</main> {/* Adjusted padding to match footer's container */}
                {!hideFooter && <Footer />} {/* Conditionally render Footer */}
            </div>
        </div>
    );
};

export default MainLayout;
