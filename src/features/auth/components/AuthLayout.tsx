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
        <div className="min-h-[600px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg md:grid md:grid-cols-2">
            <div className="flex flex-col justify-between bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white">
                <div>
                    <p className="text-sm uppercase tracking-wide text-blue-200">Mongol CEX Pilot</p>
                    <h2 className="mt-4 text-3xl font-bold">Institutional-grade security</h2>
                    <p className="mt-2 text-slate-200">
                        Zero-knowledge KYC & biometric safeguards tailored for multi-jurisdiction compliance.
                    </p>
                </div>
                <div className="space-y-4 rounded-2xl bg-slate-800/60 p-4">
                    <h3 className="text-lg font-semibold">Why verify?</h3>
                    <ul className="space-y-2 text-sm text-slate-200">
                        <li>✔ Higher fiat limits & same-day withdrawals</li>
                        <li>✔ Regulatory coverage for EU/UK/Swiss/Australia</li>
                        <li>✔ Tiered access to OTC & derivatives</li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col gap-6 p-8">
                <header className="space-y-2">
                    <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
                    {subtitle && <p className="text-slate-600">{subtitle}</p>}
                    {helperText && <p className="text-sm text-slate-500">{helperText}</p>}
                </header>

                <div className="space-y-4">{children}</div>

                {sideContent && (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                        {sideContent}
                    </div>
                )}
            </div>
        </div>
    );
};
