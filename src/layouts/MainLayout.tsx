import React from 'react';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="antigravity-wrapper">
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default MainLayout;
