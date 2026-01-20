import React from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Link } from 'react-router-dom';

const mockMarkets = [
    { pair: 'BTC/USDT', price: '$45,000.00', change: '+2.5%', volume: '1,234.56 BTC', trend: 'up' },
    { pair: 'ETH/USDT', price: '$2,350.20', change: '-1.2%', volume: '18,240 ETH', trend: 'down' },
    { pair: 'MNT/USDT', price: '$1.02', change: '+4.1%', volume: '5,420,000 MNT', trend: 'up' },
];

export const LandingPage: React.FC = () => {
    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            {/* Landing / Hero */}
            <section className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 lg:flex-row lg:items-center lg:py-12">
                <div className="flex-1 space-y-4">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">CEX Pilot · Mongolia</p>
                    <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
                        Trade crypto fast with local compliance & clear liquidity
                    </h1>
                    <p className="text-base text-slate-600 sm:text-lg">
                        Mobile-first experience for BTC/USDT, instant balance visibility, and guided KYC built for Mongolian traders.
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link to="/auth/register">
                            <Button className="w-full sm:w-auto">Start Trading</Button>
                        </Link>
                        <Link to="/wallet">
                            <Button variant="outline" className="w-full sm:w-auto">
                                View Wallet
                            </Button>
                        </Link>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                            <p className="text-xs text-slate-500">Response</p>
                            <p className="text-lg font-semibold">API {'<'} 500ms</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                            <p className="text-xs text-slate-500">First trade</p>
                            <p className="text-lg font-semibold">{'<'} 10 min</p>
                        </div>
                        <div className="rounded-2xl bg-white p-4 shadow-sm">
                            <p className="text-xs text-slate-500">Uptime target</p>
                            <p className="text-lg font-semibold">99% Pilot</p>
                        </div>
                    </div>
                </div>

                {/* Market List on Landing */}
                <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-lg lg:max-w-md">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Markets</h3>
                        <Input placeholder="Search pair" className="w-40" />
                    </div>
                    <div className="mt-4 space-y-3">
                        {mockMarkets.map((m) => (
                            <div
                                key={m.pair}
                                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3"
                            >
                                <div>
                                    <p className="font-semibold">{m.pair}</p>
                                    <p className="text-xs text-slate-500">Vol {m.volume}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold">{m.price}</p>
                                    <p className={m.trend === 'up' ? 'text-emerald-600 text-xs' : 'text-rose-600 text-xs'}>
                                        {m.change}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Link to="/trade">
                        <Button variant="outline" className="mt-6 w-full">
                            모든 마켓 보기
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Guided flow: Registration → Deposit → Trade */}
            <section className="mx-auto max-w-6xl space-y-4 px-4 pb-10">
                <h2 className="text-2xl font-bold">First-time to first trade</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        {
                            title: 'Register',
                            desc: 'Email + password, verification code. Remember me (7 days).',
                        },
                        {
                            title: 'Deposit',
                            desc: 'Select asset, QR + copy address, confirmations notice (3x).',
                        },
                        {
                            title: 'Buy BTC',
                            desc: 'Pick BTC/USDT, Market order, quick CTA with confirmation modal.',
                        },
                    ].map((card) => (
                        <div key={card.title} className="rounded-2xl bg-white p-4 shadow-sm">
                            <p className="text-sm font-semibold text-blue-600">{card.title}</p>
                            <p className="text-sm text-slate-600">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features summary */}
            <section className="mx-auto max-w-6xl space-y-6 px-4 pb-12">
                <h2 className="text-2xl font-bold">Platform Features</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">Wallet & Portfolio</h3>
                        <p className="mt-2 text-slate-600">
                            Available/locked 잔고 확인 및 입출금, 거래 기능을 한번에 관리하세요.
                        </p>
                        <Link to="/wallet">
                            <Button variant="outline" className="mt-4">
                                지갑 관리
                            </Button>
                        </Link>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">Trading Terminal</h3>
                        <p className="mt-2 text-slate-600">
                            시장/지정가 주문, 실시간 시세 및 체결 내역을 모바일에서 편리하게 확인하세요.
                        </p>
                        <Link to="/trade">
                            <Button variant="outline" className="mt-4">
                                거래 시작
                            </Button>
                        </Link>
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold">KYC & Compliance</h3>
                        <p className="mt-2 text-slate-600">
                            국가별 맞춤 가이드로 빠르고 안전하게 본인 인증을 완료하고 거래를 시작하세요.
                        </p>
                        <Link to="/auth/kyc">
                            <Button variant="outline" className="mt-4">
                                KYC 진행
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Admin console summary */}
            <section className="mx-auto max-w-6xl space-y-4 px-4 pb-12">
                <div className="rounded-3xl bg-white p-6 shadow-lg">
                    <h3 className="text-xl font-bold">Admin Console (pilot sample)</h3>
                    <div className="mt-4 grid gap-4 md:grid-cols-4">
                        {[
                            { title: 'Active Users (24h)', value: '245', tone: 'emerald' },
                            { title: 'Volume (24h)', value: '$1.2M', tone: 'blue' },
                            { title: 'Pending Withdrawals', value: '3', tone: 'rose' },
                            { title: 'System Status', value: 'Operational', tone: 'emerald' },
                        ].map((card) => (
                            <div key={card.title} className="rounded-2xl border border-slate-100 p-4">
                                <p className="text-xs text-slate-500">{card.title}</p>
                                <p className="text-lg font-semibold text-slate-900">{card.value}</p>
                                <p
                                    className={`text-xs ${card.tone === 'rose'
                                            ? 'text-rose-600'
                                            : card.tone === 'emerald'
                                                ? 'text-emerald-600'
                                                : 'text-blue-600'
                                        }`}
                                >
                                    Real-time
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
};
