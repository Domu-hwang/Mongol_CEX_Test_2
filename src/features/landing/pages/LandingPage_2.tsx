import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import FadeInSection from '@/components/animations/FadeInSection';
import {
    ArrowRight,
    Shield,
    Zap,
    Users,
    TrendingUp,
    Wallet,
    RefreshCcw,
    BarChart3,
    Lock,
    CheckCircle,
    ChevronRight
} from 'lucide-react';

// Bitcoin image path with base URL
const BITCOIN_IMAGE_URL = `${import.meta.env.BASE_URL}images/Bitcoin.svg`;

// Bitcoin Fireworks Particle System
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    size: number;
    opacity: number;
    life: number;
    maxLife: number;
}

const BitcoinFireworks: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const imageRef = useRef<HTMLImageElement | null>(null);
    const animationRef = useRef<number>();

    useEffect(() => {
        // Load Bitcoin image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = BITCOIN_IMAGE_URL;
        img.onload = () => {
            imageRef.current = img;
        };
        img.onerror = (e) => {
            console.error('Failed to load Bitcoin image:', e);
        };

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create firework burst
        const createBurst = (x: number, y: number) => {
            const particleCount = 5 + Math.floor(Math.random() * 4); // 5-8 particles (reduced)
            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
                const speed = 3 + Math.random() * 5;
                const life = 80 + Math.random() * 60;
                particlesRef.current.push({
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    rotation: Math.random() * 360,
                    rotationSpeed: (Math.random() - 0.5) * 15,
                    size: 50 + Math.random() * 40, // Bigger particles (50-90px)
                    opacity: 1,
                    life,
                    maxLife: life,
                });
            }
        };

        // Auto-fire from sides
        let lastFireTime = 0;
        const fireInterval = 800; // ms between bursts

        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Auto-fire bursts from left and right sides
            if (time - lastFireTime > fireInterval) {
                const side = Math.random() > 0.5 ? 'left' : 'right';
                const x = side === 'left' ? 50 + Math.random() * 100 : canvas.width - 50 - Math.random() * 100;
                const y = 100 + Math.random() * (canvas.height * 0.6);
                createBurst(x, y);
                lastFireTime = time;
            }

            // Update and draw particles
            particlesRef.current = particlesRef.current.filter(particle => {
                // Update
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.15; // gravity
                particle.vx *= 0.98; // air resistance
                particle.rotation += particle.rotationSpeed;
                particle.life--;
                particle.opacity = particle.life / particle.maxLife;

                // Draw
                if (imageRef.current && particle.opacity > 0) {
                    ctx.save();
                    ctx.globalAlpha = particle.opacity;
                    ctx.translate(particle.x, particle.y);
                    ctx.rotate((particle.rotation * Math.PI) / 180);

                    // Glow effect
                    ctx.shadowColor = 'rgba(234, 179, 8, 0.8)';
                    ctx.shadowBlur = 15;

                    ctx.drawImage(
                        imageRef.current,
                        -particle.size / 2,
                        -particle.size / 2,
                        particle.size,
                        particle.size
                    );
                    ctx.restore();
                }

                return particle.life > 0;
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-10"
            style={{ width: '100%', height: '100%' }}
        />
    );
};

// Floating Bitcoin that follows mouse with rotation
const FloatingBitcoin: React.FC = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
    const [rotation, setRotation] = useState(0);
    const animationRef = useRef<number>();

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setTargetPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    useEffect(() => {
        const animate = () => {
            // Smooth follow with easing (faster)
            setPosition(prev => ({
                x: prev.x + (targetPosition.x - prev.x) * 0.2,
                y: prev.y + (targetPosition.y - prev.y) * 0.2
            }));

            // Continuous rotation (3x faster)
            setRotation(prev => prev + 1.5);

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [targetPosition]);

    return (
        <div
            className="fixed pointer-events-none z-50"
            style={{
                left: position.x - 40,
                top: position.y - 40,
                transform: `rotate(${rotation}deg)`,
                transition: 'opacity 0.3s ease',
                opacity: position.x === 0 && position.y === 0 ? 0 : 1
            }}
        >
            <img
                src={BITCOIN_IMAGE_URL}
                alt="Bitcoin"
                className="w-[80px] h-[80px] drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]"
            />
        </div>
    );
};

// Hero Section - OKX Style with Bold Typography
const HeroSection2: React.FC = () => {
    return (
        <section
            className="min-h-[90vh] flex items-center relative overflow-hidden"
            style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)' }}
        >
            {/* Bitcoin Fireworks Animation */}
            <BitcoinFireworks />

            <div className="w-full px-4 relative z-20">
                <div className="max-w-7xl mx-auto text-center">
                    <FadeInSection>
                        <p className="text-yellow-500 font-mono text-sm tracking-widest uppercase mb-6">
                            Next-Generation Digital Asset Exchange
                        </p>
                    </FadeInSection>

                    <FadeInSection delay={0.1}>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] tracking-tight mb-8">
                            TRADE
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                                WITHOUT
                            </span>
                            <br />
                            LIMITS
                        </h1>
                    </FadeInSection>

                    <FadeInSection delay={0.2}>
                        <p className="text-xl md:text-2xl text-zinc-400 max-w-2xl mx-auto mb-12 font-light">
                            Fast. Secure. Reliable. Buy, sell, and swap 50+ digital assets with industry-leading speed.
                        </p>
                    </FadeInSection>

                    <FadeInSection delay={0.3}>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button className="bg-yellow-500 text-black hover:bg-yellow-400 px-10 py-7 text-lg font-bold rounded-none">
                                    START TRADING
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/trade">
                                <Button variant="outline" className="border-2 border-zinc-700 text-white hover:bg-zinc-800 px-10 py-7 text-lg font-bold rounded-none">
                                    VIEW MARKETS
                                </Button>
                            </Link>
                        </div>
                    </FadeInSection>

                    {/* Trust Stats */}
                    <FadeInSection delay={0.4}>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-zinc-800">
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-black text-white">10K+</p>
                                <p className="text-zinc-500 text-sm uppercase tracking-wider mt-1">Traders</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-black text-white">$50M+</p>
                                <p className="text-zinc-500 text-sm uppercase tracking-wider mt-1">Daily Volume</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-black text-white">99.9%</p>
                                <p className="text-zinc-500 text-sm uppercase tracking-wider mt-1">Uptime</p>
                            </div>
                            <div className="text-center">
                                <p className="text-4xl md:text-5xl font-black text-white">50+</p>
                                <p className="text-zinc-500 text-sm uppercase tracking-wider mt-1">Assets</p>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </div>
        </section>
    );
};

// Product Showcase with Mockups
const ProductShowcase: React.FC = () => {
    const products = [
        {
            title: 'SPOT TRADING',
            description: 'Professional-grade trading interface with real-time charts, order books, and advanced order types.',
            link: '/trade',
            linkText: 'Start Trading',
            mockupType: 'trade',
        },
        {
            title: 'QUICK SWAP',
            description: 'Instantly swap between cryptocurrencies. No order book, no complexity. Just fast, simple exchanges.',
            link: '/quick-swap',
            linkText: 'Swap Now',
            mockupType: 'swap',
        },
        {
            title: 'WALLET',
            description: 'Secure asset management with easy deposits, withdrawals, and complete transaction history.',
            link: '/my-assets',
            linkText: 'View Wallet',
            mockupType: 'wallet',
        },
    ];

    return (
        <section className="py-32 bg-zinc-950">
            <div className="container mx-auto px-4 max-w-7xl">
                <FadeInSection>
                    <div className="text-center mb-20">
                        <p className="text-yellow-500 font-mono text-sm tracking-widest uppercase mb-4">
                            Our Products
                        </p>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
                            EVERYTHING YOU NEED
                        </h2>
                    </div>
                </FadeInSection>

                <div className="space-y-32">
                    {products.map((product, index) => (
                        <FadeInSection key={index} delay={0.1 * index}>
                            <div className={`grid md:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                                {/* Content */}
                                <div className={`${index % 2 === 1 ? 'md:order-2' : ''}`}>
                                    <h3 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">
                                        {product.title}
                                    </h3>
                                    <p className="text-xl text-zinc-400 mb-8 leading-relaxed">
                                        {product.description}
                                    </p>
                                    <Link to={product.link}>
                                        <Button className="bg-yellow-500 text-black hover:bg-yellow-400 px-8 py-6 text-lg font-bold rounded-none group">
                                            {product.linkText}
                                            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>

                                {/* Mockup */}
                                <div className={`${index % 2 === 1 ? 'md:order-1' : ''}`}>
                                    <div className="relative">
                                        {/* Browser Frame */}
                                        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden shadow-2xl">
                                            {/* Browser Header */}
                                            <div className="flex items-center gap-2 px-4 py-3 bg-zinc-800 border-b border-zinc-700">
                                                <div className="flex gap-1.5">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                </div>
                                                <div className="flex-1 mx-4">
                                                    <div className="bg-zinc-700 rounded px-3 py-1 text-xs text-zinc-400 font-mono">
                                                        ikhmyangan.mn/{product.mockupType}
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Screen Content */}
                                            <div className="aspect-[16/10] bg-zinc-900 overflow-hidden">
                                                {product.mockupType === 'trade' && (
                                                    <img src={`${import.meta.env.BASE_URL}images/Trade.png`} alt="Trade Interface" className="w-full h-full object-cover object-top" />
                                                )}
                                                {product.mockupType === 'swap' && (
                                                    <img src={`${import.meta.env.BASE_URL}images/QuickSwap.png`} alt="Quick Swap Interface" className="w-full h-full object-cover object-top" />
                                                )}
                                                {product.mockupType === 'wallet' && (
                                                    <img src={`${import.meta.env.BASE_URL}images/Wallet.png`} alt="Wallet Interface" className="w-full h-full object-cover object-top" />
                                                )}
                                            </div>
                                        </div>
                                        {/* Glow Effect */}
                                        <div className="absolute -inset-4 bg-yellow-500/10 blur-3xl -z-10 rounded-3xl"></div>
                                    </div>
                                </div>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Trade Mockup Component
const TradeMockup: React.FC = () => {
    return (
        <div className="h-full flex gap-3 text-xs">
            {/* Left - Chart */}
            <div className="flex-1 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold">BTC/USDT</span>
                        <span className="text-green-500">+2.34%</span>
                    </div>
                    <span className="text-yellow-500 font-mono">$67,432.50</span>
                </div>
                {/* Chart Area */}
                <div className="flex-1 bg-zinc-800/50 rounded p-2 relative overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
                        <path
                            d="M0,60 L20,55 L40,45 L60,50 L80,30 L100,35 L120,25 L140,30 L160,20 L180,25 L200,15"
                            stroke="#22c55e"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M0,60 L20,55 L40,45 L60,50 L80,30 L100,35 L120,25 L140,30 L160,20 L180,25 L200,15 L200,80 L0,80 Z"
                            fill="url(#greenGradient)"
                            opacity="0.3"
                        />
                        <defs>
                            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#22c55e" />
                                <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            </div>
            {/* Right - Order Book */}
            <div className="w-28 flex flex-col gap-1">
                <span className="text-zinc-500 text-[10px]">ORDER BOOK</span>
                <div className="flex-1 bg-zinc-800/50 rounded p-2 space-y-0.5">
                    {[...Array(5)].map((_, i) => (
                        <div key={`sell-${i}`} className="flex justify-between text-[9px]">
                            <span className="text-red-500">67,{450 - i * 5}</span>
                            <span className="text-zinc-500">{(0.5 + i * 0.2).toFixed(2)}</span>
                        </div>
                    ))}
                    <div className="border-t border-zinc-700 my-1"></div>
                    {[...Array(5)].map((_, i) => (
                        <div key={`buy-${i}`} className="flex justify-between text-[9px]">
                            <span className="text-green-500">67,{430 - i * 5}</span>
                            <span className="text-zinc-500">{(0.8 + i * 0.3).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Swap Mockup Component
const SwapMockup: React.FC = () => {
    return (
        <div className="h-full flex items-center justify-center">
            <div className="w-full max-w-xs space-y-3">
                {/* From */}
                <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span>From</span>
                        <span>Balance: 1.5 ETH</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl text-white font-bold">1.0</span>
                        <div className="flex items-center gap-2 bg-zinc-700 px-3 py-1.5 rounded-full">
                            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                            <span className="text-white text-sm font-medium">ETH</span>
                        </div>
                    </div>
                </div>

                {/* Swap Icon */}
                <div className="flex justify-center">
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                        <RefreshCcw className="w-5 h-5 text-black" />
                    </div>
                </div>

                {/* To */}
                <div className="bg-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between text-xs text-zinc-500 mb-2">
                        <span>To</span>
                        <span>Balance: 0 BTC</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-2xl text-white font-bold">0.015</span>
                        <div className="flex items-center gap-2 bg-zinc-700 px-3 py-1.5 rounded-full">
                            <div className="w-5 h-5 bg-orange-500 rounded-full"></div>
                            <span className="text-white text-sm font-medium">BTC</span>
                        </div>
                    </div>
                </div>

                {/* Swap Button */}
                <div className="bg-yellow-500 text-black font-bold text-center py-3 rounded-lg text-sm">
                    SWAP NOW
                </div>
            </div>
        </div>
    );
};

// Wallet Mockup Component
const WalletMockup: React.FC = () => {
    const assets = [
        { symbol: 'BTC', name: 'Bitcoin', amount: '0.5432', value: '$36,543.21', change: '+2.34%', positive: true },
        { symbol: 'ETH', name: 'Ethereum', amount: '4.2100', value: '$15,234.56', change: '+1.87%', positive: true },
        { symbol: 'USDT', name: 'Tether', amount: '5,000.00', value: '$5,000.00', change: '0.00%', positive: true },
    ];

    return (
        <div className="h-full flex flex-col gap-3">
            {/* Total Balance */}
            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 rounded-lg p-4 border border-yellow-500/30">
                <p className="text-zinc-400 text-xs mb-1">Total Balance</p>
                <p className="text-2xl font-black text-white">$56,777.77</p>
                <p className="text-green-500 text-xs mt-1">+$1,234.56 (2.23%) today</p>
            </div>

            {/* Asset List */}
            <div className="flex-1 space-y-2">
                {assets.map((asset, index) => (
                    <div key={index} className="flex items-center justify-between bg-zinc-800/50 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                                asset.symbol === 'BTC' ? 'bg-orange-500' :
                                asset.symbol === 'ETH' ? 'bg-blue-500' : 'bg-green-500'
                            } text-white`}>
                                {asset.symbol.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white text-sm font-medium">{asset.symbol}</p>
                                <p className="text-zinc-500 text-[10px]">{asset.amount}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-white text-sm">{asset.value}</p>
                            <p className={`text-[10px] ${asset.positive ? 'text-green-500' : 'text-red-500'}`}>
                                {asset.change}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Features Grid - Brutal Style
const FeaturesGrid: React.FC = () => {
    const features = [
        { icon: Zap, title: 'INSTANT EXECUTION', description: 'Sub-second order matching' },
        { icon: Shield, title: 'BANK-GRADE SECURITY', description: '95% cold storage' },
        { icon: Lock, title: 'PROOF OF RESERVES', description: 'Full transparency' },
        { icon: Users, title: '24/7 SUPPORT', description: 'Always here for you' },
    ];

    return (
        <section className="py-24 bg-black border-y border-zinc-800">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid md:grid-cols-4 gap-0">
                    {features.map((feature, index) => (
                        <FadeInSection key={index} delay={0.1 * index}>
                            <div className={`p-8 text-center border-zinc-800 ${index < 3 ? 'md:border-r' : ''}`}>
                                <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6">
                                    <feature.icon className="w-8 h-8 text-yellow-500" />
                                </div>
                                <h3 className="text-lg font-black text-white mb-2 tracking-tight">
                                    {feature.title}
                                </h3>
                                <p className="text-zinc-500 text-sm">{feature.description}</p>
                            </div>
                        </FadeInSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// Why Choose Us Section
const WhyChooseSection: React.FC = () => {
    const reasons = [
        {
            number: '01',
            title: 'PROVEN RELIABILITY',
            description: 'Built on battle-tested technology serving millions of transactions daily.',
        },
        {
            number: '02',
            title: 'LOCAL EXPERTISE',
            description: 'Deep understanding of market needs and regulatory requirements.',
        },
        {
            number: '03',
            title: 'TRANSPARENT OPERATIONS',
            description: 'Clear fee structures, proof of reserves, and regular security audits.',
        },
    ];

    return (
        <section className="py-32 bg-zinc-950">
            <div className="container mx-auto px-4 max-w-7xl">
                <FadeInSection>
                    <div className="max-w-4xl mx-auto">
                        <p className="text-yellow-500 font-mono text-sm tracking-widest uppercase mb-4">
                            Why IKH MYANGAN
                        </p>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-16">
                            BUILT FOR
                            <br />
                            <span className="text-zinc-500">SERIOUS TRADERS</span>
                        </h2>

                        <div className="space-y-12">
                            {reasons.map((reason, index) => (
                                <FadeInSection key={index} delay={0.1 * index}>
                                    <div className="flex gap-8 items-start border-b border-zinc-800 pb-12">
                                        <span className="text-6xl font-black text-zinc-800">{reason.number}</span>
                                        <div>
                                            <h3 className="text-2xl font-black text-white mb-3">{reason.title}</h3>
                                            <p className="text-zinc-400 text-lg">{reason.description}</p>
                                        </div>
                                    </div>
                                </FadeInSection>
                            ))}
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </section>
    );
};

// CTA Section - Brutal Style
const CTASection: React.FC = () => {
    return (
        <section className="py-32 bg-yellow-500">
            <div className="container mx-auto px-4 max-w-7xl">
                <FadeInSection>
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-5xl md:text-7xl font-black text-black tracking-tight mb-8">
                            START NOW
                        </h2>
                        <p className="text-xl text-black/70 mb-12 max-w-2xl mx-auto">
                            Join thousands of traders who trust IKH MYANGAN for secure and efficient digital asset trading.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/register">
                                <Button className="bg-black text-white hover:bg-zinc-800 px-12 py-7 text-lg font-black rounded-none">
                                    CREATE ACCOUNT
                                </Button>
                            </Link>
                            <Link to="/trade">
                                <Button className="bg-white text-black hover:bg-white/90 px-12 py-7 text-lg font-black rounded-none">
                                    EXPLORE MARKETS
                                </Button>
                            </Link>
                        </div>
                    </div>
                </FadeInSection>
            </div>
        </section>
    );
};

// Main Landing Page 2
const LandingPage_2: React.FC = () => {
    return (
        <div>
            <FloatingBitcoin />
            <HeroSection2 />
            <FeaturesGrid />
            <ProductShowcase />
            <WhyChooseSection />
            <CTASection />
        </div>
    );
};

export default LandingPage_2;
