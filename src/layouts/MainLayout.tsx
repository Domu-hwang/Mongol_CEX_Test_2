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

    return (
        <div className="flex min-h-screen">
            <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
            <div className="flex-1 flex flex-col" style={{ marginLeft: isSidebarOpen ? '16rem' : '0' }}>
                <Header onMenuClick={toggleSidebar} />
                <main className="flex-1 p-6">{children}</main>
                {!hideFooter && <Footer />} {/* Conditionally render Footer */}
            </div>
        </div>
    );
};

export default MainLayout;
