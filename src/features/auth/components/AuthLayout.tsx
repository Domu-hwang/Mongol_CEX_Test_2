import React from 'react';

interface AuthLayoutProps {
    title: string;
    subtitle?: string;
    helperText?: string;
    children: React.ReactNode;
    sideContent?: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    title,
    subtitle,
    helperText,
    children,
    sideContent,
}) => {
    return (
        <div className="min-h-[500px] w-full max-w-[1000px] overflow-hidden rounded-2xl border border-gray-800 bg-[#1e2329] shadow-2xl md:grid md:grid-cols-2">
            <div className="hidden flex-col justify-between bg-[#181a20] p-10 text-white md:flex">
                <div>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-primary-600"></div>
                        <p className="text-xl font-bold tracking-tight">Mongol CEX</p>
                    </div>
                    <h2 className="mt-8 text-4xl font-bold leading-tight">Secure & Trusted <br /><span className="text-primary-600">Crypto Exchange</span></h2>
                    <p className="mt-6 text-gray-400 text-lg leading-relaxed">
                        Join the future of finance with institutional-grade security and multi-jurisdiction compliance.
                    </p>
                </div>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="mt-1 rounded-full bg-primary-600/10 p-2 text-primary-600">
                            <span className="block h-2 w-2 rounded-full bg-current"></span>
                        </div>
                        <div>
                            <h4 className="font-semibold">Professional Performance</h4>
                            <p className="text-sm text-gray-400">High-speed matching engine with low latency.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="mt-1 rounded-full bg-primary-600/10 p-2 text-primary-600">
                            <span className="block h-2 w-2 rounded-full bg-current"></span>
                        </div>
                        <div>
                            <h4 className="font-semibold">Compliant & Secure</h4>
                            <p className="text-sm text-gray-400">Restricted jurisdiction filtering and AML screening.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-8 p-10 bg-[#1e2329]">
                <header className="space-y-3">
                    <h1 className="text-3xl font-bold text-white">{title}</h1>
                    {subtitle && <p className="text-gray-400">{subtitle}</p>}
                    {helperText && <p className="text-sm text-gray-500 bg-gray-800/50 p-3 rounded-lg border border-gray-700">{helperText}</p>}
                </header>

                <div className="space-y-6">{children}</div>

                {sideContent && (
                    <div className="rounded-xl border border-gray-700 bg-gray-800/30 p-5 text-sm text-gray-300">
                        {sideContent}
                    </div>
                )}
            </div>
        </div>
    );
};
