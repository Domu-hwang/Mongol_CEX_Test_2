import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const NotFoundPage: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] bg-white text-slate-900 p-8 text-center">
            <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
            <h2 className="text-3xl font-semibold mb-6">페이지를 찾을 수 없습니다</h2>
            <p className="text-lg text-slate-600 mb-8">
                요청하신 페이지를 찾을 수 없습니다. 주소를 확인하거나 아래 버튼을 클릭하여 홈으로 돌아가세요.
            </p>
            <Link to="/">
                <Button variant="primary" size="lg">
                    홈으로 돌아가기
                </Button>
            </Link>
        </div>
    );
};

export default NotFoundPage;
