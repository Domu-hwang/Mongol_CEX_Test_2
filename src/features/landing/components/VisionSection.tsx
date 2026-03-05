import React from 'react';
import { TrendingUp, TrendingDown, Flame, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const marketTrends = [
    {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: '96,440.50',
        change: '+2.45',
        isPositive: true,
        volume: '45.2B',
        image: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    },
    {
        symbol: 'ETH',
        name: 'Ethereum',
        price: '2,850.10',
        change: '-1.20',
        isPositive: false,
        volume: '18.5B',
        image: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    },
    {
        symbol: 'SOL',
        name: 'Solana',
        price: '108.20',
        change: '+5.40',
        isPositive: true,
        volume: '4.1B',
        image: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    },
    {
        symbol: 'XRP',
        name: 'Ripple',
        price: '1.56',
        change: '+0.50',
        isPositive: true,
        volume: '2.8B',
        image: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
    },
    {
        symbol: 'DOGE',
        name: 'Dogecoin',
        price: '0.14',
        change: '+8.10',
        isPositive: true,
        volume: '1.2B',
        image: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
    },
];

const VisionSection: React.FC = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { ref: visionRef, isVisible } = useScrollAnimation({ threshold: 0.2, rootMargin: '-50px' });

    // Animation settings - elegant and sophisticated
    const duration = 2.0;
    const easeOutExpo = 'cubic-bezier(0.16, 1, 0.3, 1)';

    const titleStyle: React.CSSProperties = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
        transition: `opacity ${duration}s ${easeOutExpo}, transform ${duration}s ${easeOutExpo}`,
    };

    const subtitleStyle: React.CSSProperties = {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity ${duration}s ${easeOutExpo} 0.15s, transform ${duration}s ${easeOutExpo} 0.15s`,
    };

    return (
        <>
            {/* Vision Section */}
            <section className="pt-[15vh] pb-[15vh] md:pt-[30vh] md:pb-[30vh] bg-black">
                <div className="container mx-auto px-4">
                    <div ref={visionRef} className="text-center">
                        <h2
                            className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6"
                            style={titleStyle}
                        >
                            {t('vision.title')}
                        </h2>
                        <p
                            className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto"
                            style={subtitleStyle}
                        >
                            {t('vision.subtitle')}
                        </p>
                    </div>
                </div>
            </section>

            {/* Market Trends Section - Completely Separate */}
            <section className="pb-24 md:pb-72 bg-black">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        {/* Section Header with Filters */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-10 gap-6">
                            <div>
                                <h3 className="text-h3 md:text-h2 font-bold text-foreground mb-2">{t('vision.marketTrends')}</h3>
                                <p className="text-body-sm text-muted-foreground">{t('vision.marketTrendsSubtitle')}</p>
                            </div>

                            <div className="flex bg-zinc-900/50 p-1 rounded-lg border border-border/50">
                                <button className="flex items-center gap-2 px-4 py-1.5 rounded-md bg-zinc-800 text-foreground text-caption font-semibold transition-all">
                                    <Flame className="w-3.5 h-3.5" />
                                    {t('vision.hot')}
                                </button>
                                <button className="flex items-center gap-2 px-4 py-1.5 rounded-md text-muted-foreground hover:text-foreground text-caption font-semibold transition-all">
                                    <Star className="w-3.5 h-3.5" />
                                    {t('vision.newListing')}
                                </button>
                            </div>
                        </div>

                        {/* Market Table */}
                        <div className="bg-zinc-900/50 border border-border rounded-2xl overflow-hidden">
                            {/* Table Header */}
                            <div className="hidden md:grid grid-cols-5 px-8 py-4 border-b border-border/50 bg-zinc-900/40">
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('vision.assetName')}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right pr-4">{t('vision.lastPrice')}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right pr-4">{t('vision.change24h')}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right pr-4">{t('vision.volume24h')}</div>
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-right">{t('vision.trade')}</div>
                            </div>

                            {/* Assets */}
                            <div className="divide-y divide-border/30">
                                {marketTrends.map((token, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-2 md:grid-cols-5 items-center px-4 md:px-8 py-5 hover:bg-zinc-800/20 transition-all cursor-pointer group"
                                        onClick={() => navigate('/coming-soon')}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-zinc-800 flex items-center justify-center">
                                                <img
                                                    src={token.image}
                                                    alt={token.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                        target.parentElement!.innerHTML = `<span class="text-white font-bold text-xs">${token.symbol.charAt(0)}</span>`;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground leading-tight">{token.symbol}</p>
                                                <p className="text-[10px] text-muted-foreground">{token.name}</p>
                                            </div>
                                        </div>

                                        <div className="text-right md:pr-4">
                                            <p className="font-bold text-foreground">${token.price}</p>
                                            <div className="md:hidden flex justify-end items-center gap-1 mt-1">
                                                <span className={`text-caption font-medium ${token.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                                    {token.change}%
                                                </span>
                                            </div>
                                        </div>

                                        <div className="hidden md:flex justify-end items-center gap-1 pr-4">
                                            <span className={`text-body-sm font-bold flex items-center gap-1.5 ${token.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                                                {token.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                {token.change}%
                                            </span>
                                        </div>

                                        <div className="hidden md:block text-right pr-4">
                                            <p className="text-body-sm text-foreground/80 font-medium">${token.volume}</p>
                                        </div>

                                        <div className="hidden md:flex justify-end">
                                            <Button
                                                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold h-9 px-6 rounded-lg text-xs transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate('/coming-soon');
                                                }}
                                            >
                                                {t('vision.tradeNow')}
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer Link */}
                            <div className="py-5 text-center border-t border-border/30 bg-zinc-900/20 group cursor-pointer hover:bg-zinc-900/40 transition-colors">
                                <a
                                    href="/coming-soon"
                                    className="text-caption font-bold text-foreground/60 group-hover:text-yellow-500 inline-flex items-center gap-2 transition-colors"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/coming-soon');
                                    }}
                                >
                                    {t('vision.viewAllMarkets')}
                                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default VisionSection;
