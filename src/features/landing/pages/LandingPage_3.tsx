import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowUpRight, Check, Sparkles, Shield, Zap, Globe, Users, Clock, Wallet, TrendingUp, ChevronDown, Star } from 'lucide-react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================
// THREE.JS INTERACTIVE GRID ANIMATION
// ============================================

// Vertex Shader for Grid Lines (flat, no elevation)
const gridVertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;

    varying vec3 vPosition;
    varying float vDistance;

    void main() {
        vPosition = position;

        // Calculate distance from mouse (in screen space, adjusted for larger grid)
        vec2 mousePos = uMouse * 2.0 - 1.0;
        float dist = distance(position.xy, mousePos * 30.0);
        vDistance = dist;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = 3.0;
    }
`;

// Fragment Shader for Grid Lines
const gridFragmentShader = `
    uniform float uTime;
    uniform vec3 uColor;

    varying vec3 vPosition;
    varying float vDistance;

    void main() {
        vec3 color = uColor;

        // Base alpha for lines (stronger)
        float alpha = 0.5;

        // Brighten near mouse
        if (vDistance < 3.0) {
            alpha = 0.7 + (1.0 - vDistance / 3.0) * 0.3;
        }

        gl_FragColor = vec4(color, alpha);
    }
`;

// Vertex Shader for Filled Cells
const cellVertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        vUv = uv;
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;

// Fragment Shader for Filled Cells with Irregular Ripple Effect
const cellFragmentShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uHoverRadius;
    uniform vec3 uColor;
    uniform float uGridSize;
    uniform float uDivisions;

    varying vec2 vUv;
    varying vec3 vPosition;

    // Pseudo-random function
    float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
    }

    // Noise function
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        vec2 u = f * f * (3.0 - 2.0 * f);

        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        // Convert mouse to grid space
        vec2 mousePos = (uMouse * 2.0 - 1.0) * (uGridSize / 2.0);

        // Calculate cell coordinates
        float cellSize = uGridSize / uDivisions;
        vec2 cellCoord = floor((vPosition.xy + uGridSize / 2.0) / cellSize);
        vec2 cellCenter = (cellCoord + 0.5) * cellSize - uGridSize / 2.0;

        // Per-cell random value for irregularity
        float cellRandom = random(cellCoord);
        float cellNoise = noise(cellCoord * 0.5 + uTime * 0.3);

        // Distance from mouse to cell center with irregular offset
        float angleOffset = cellRandom * 6.28318; // Random angle per cell
        vec2 irregularOffset = vec2(cos(angleOffset), sin(angleOffset)) * cellNoise * cellSize * 0.5;
        float dist = distance(cellCenter + irregularOffset, mousePos);

        // Ripple effect with irregular timing
        float rippleSpeed = 3.0 + cellRandom * 2.0; // Variable speed per cell
        float rippleWidth = 1.0 + cellNoise * 1.5; // Variable width

        float fillStrength = 0.0;

        // Create multiple irregular ripple rings
        for (float i = 0.0; i < 4.0; i++) {
            float phaseOffset = cellRandom * 3.0 + i * 1.5;
            float ripplePhase = mod(uTime * rippleSpeed - phaseOffset, 12.0);
            float rippleRadius = ripplePhase * cellSize * (1.2 + cellNoise * 0.8);

            // Irregular ring shape
            float ringDist = abs(dist - rippleRadius);
            float ring = 1.0 - smoothstep(0.0, rippleWidth * cellSize, ringDist);

            // Add some noise to the ring intensity
            float intensityNoise = 0.5 + noise(cellCoord + uTime * 0.5 + i) * 0.5;
            ring *= intensityNoise;

            // Fade out as ripple expands
            float rippleFade = 1.0 - smoothstep(0.0, uHoverRadius * cellSize * 2.5, rippleRadius);

            fillStrength += ring * rippleFade * 0.4;
        }

        // Sporadic cell flicker
        float flicker = step(0.92, noise(cellCoord * 2.0 + uTime * 2.0));
        float flickerDist = distance(cellCenter, mousePos);
        float flickerRadius = uHoverRadius * cellSize * 1.5;
        if (flickerDist < flickerRadius) {
            fillStrength += flicker * 0.5 * (1.0 - flickerDist / flickerRadius);
        }

        // Center glow with noise
        float centerGlow = 1.0 - smoothstep(0.0, cellSize * 3.0, dist);
        centerGlow *= 0.7 + cellNoise * 0.3;
        fillStrength += centerGlow * 0.6;

        // Clamp total strength
        fillStrength = clamp(fillStrength, 0.0, 1.0);

        float alpha = fillStrength * 0.85;

        gl_FragColor = vec4(uColor, alpha);
    }
`;

// Grid configuration
const GRID_SIZE = 60;
const GRID_DIVISIONS = 70;

// Grid Lines Component (flat)
const GridLines: React.FC<{ mousePosition: React.MutableRefObject<{ x: number; y: number }> }> = ({ mousePosition }) => {
    const meshRef = useRef<THREE.LineSegments>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uColor: { value: new THREE.Color(0xeab308) },
    }), []);

    // Create grid geometry
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const vertices: number[] = [];
        const step = GRID_SIZE / GRID_DIVISIONS;

        // Horizontal lines
        for (let i = 0; i <= GRID_DIVISIONS; i++) {
            const y = -GRID_SIZE / 2 + i * step;
            vertices.push(-GRID_SIZE / 2, y, 0);
            vertices.push(GRID_SIZE / 2, y, 0);
        }

        // Vertical lines
        for (let i = 0; i <= GRID_DIVISIONS; i++) {
            const x = -GRID_SIZE / 2 + i * step;
            vertices.push(x, -GRID_SIZE / 2, 0);
            vertices.push(x, GRID_SIZE / 2, 0);
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return geo;
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

            // Faster mouse tracking
            const targetX = mousePosition.current.x;
            const targetY = mousePosition.current.y;
            materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.5;
            materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.5;
        }
    });

    return (
        <lineSegments ref={meshRef} geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={gridVertexShader}
                fragmentShader={gridFragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
            />
        </lineSegments>
    );
};

// Grid Cells Component (fills on hover)
const GridCells: React.FC<{ mousePosition: React.MutableRefObject<{ x: number; y: number }> }> = ({ mousePosition }) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uHoverRadius: { value: 4.0 },
        uColor: { value: new THREE.Color(0xeab308) },
        uGridSize: { value: GRID_SIZE },
        uDivisions: { value: GRID_DIVISIONS },
    }), []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

            const targetX = mousePosition.current.x;
            const targetY = mousePosition.current.y;
            // Faster, more responsive mouse tracking
            materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.5;
            materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.5;
        }
    });

    return (
        <mesh ref={meshRef}>
            <planeGeometry args={[GRID_SIZE, GRID_SIZE, GRID_DIVISIONS, GRID_DIVISIONS]} />
            <shaderMaterial
                ref={materialRef}
                vertexShader={cellVertexShader}
                fragmentShader={cellFragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    );
};

// Grid Points Component (intersection dots)
const GridPoints: React.FC<{ mousePosition: React.MutableRefObject<{ x: number; y: number }> }> = ({ mousePosition }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        uColor: { value: new THREE.Color(0xeab308) },
    }), []);

    // Create points geometry at grid intersections
    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        const vertices: number[] = [];
        const step = GRID_SIZE / GRID_DIVISIONS;

        for (let i = 0; i <= GRID_DIVISIONS; i++) {
            for (let j = 0; j <= GRID_DIVISIONS; j++) {
                const x = -GRID_SIZE / 2 + i * step;
                const y = -GRID_SIZE / 2 + j * step;
                vertices.push(x, y, 0);
            }
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        return geo;
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;

            const targetX = mousePosition.current.x;
            const targetY = mousePosition.current.y;
            materialRef.current.uniforms.uMouse.value.x += (targetX - materialRef.current.uniforms.uMouse.value.x) * 0.5;
            materialRef.current.uniforms.uMouse.value.y += (targetY - materialRef.current.uniforms.uMouse.value.y) * 0.5;
        }
    });

    return (
        <points ref={pointsRef} geometry={geometry}>
            <shaderMaterial
                ref={materialRef}
                vertexShader={gridVertexShader}
                fragmentShader={gridFragmentShader}
                uniforms={uniforms}
                transparent={true}
                depthWrite={false}
            />
        </points>
    );
};

// Main Hero Animation Component
const HeroAnimation: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePosition = useRef({ x: 0.5, y: 0.5 });

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            mousePosition.current.x = (event.clientX - rect.left) / rect.width;
            mousePosition.current.y = 1 - (event.clientY - rect.top) / rect.height;
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('mousemove', handleMouseMove);
            return () => container.removeEventListener('mousemove', handleMouseMove);
        }
    }, [handleMouseMove]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 0, left: 0, right: 0 }}
        >
            <Canvas
                camera={{ position: [0, 0, 8], fov: 110 }}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.5} />
                <group>
                    <GridCells mousePosition={mousePosition} />
                    <GridLines mousePosition={mousePosition} />
                    <GridPoints mousePosition={mousePosition} />
                </group>
            </Canvas>
        </div>
    );
};

// ============================================
// GLASS CARD COMPONENT
// ============================================
interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hover = true }) => {
    return (
        <div
            className={`
                backdrop-blur-xl border border-white/10 rounded-2xl
                ${hover ? 'hover:border-white/20 transition-all duration-500' : ''}
                ${className}
            `}
        >
            {children}
        </div>
    );
};

// ============================================
// SCROLL ANIMATION HOOK
// ============================================
const useScrollAnimation = () => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
};

// ============================================
// ANIMATED SECTION WRAPPER
// ============================================
interface AnimatedSectionProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({ children, className = '', delay = 0 }) => {
    const { ref, isVisible } = useScrollAnimation();

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
};

// ============================================
// HERO SECTION
// ============================================
const HeroSection: React.FC = () => {
    return (
        <section className="min-h-screen flex items-center justify-center relative px-6">
            <HeroAnimation />

            <div className="max-w-5xl mx-auto text-center relative z-10">
                {/* Badge */}
                <AnimatedSection>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 backdrop-blur-sm mb-8">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-white/70">Mongolia's Next-Gen Exchange</span>
                    </div>
                </AnimatedSection>

                {/* Main headline */}
                <AnimatedSection delay={100}>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-tight mb-6">
                        Trading
                        <span className="block font-medium bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent pb-2">
                            Reimagined
                        </span>
                    </h1>
                </AnimatedSection>

                {/* Subtitle */}
                <AnimatedSection delay={200}>
                    <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Experience seamless crypto trading with institutional-grade security,
                        lightning-fast execution, and an interface designed for the future.
                    </p>
                </AnimatedSection>

                {/* CTA Buttons */}
                <AnimatedSection delay={300}>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register">
                            <Button className="bg-brand text-black hover:bg-yellow-400 px-8 py-6 text-base font-medium rounded-full group">
                                Start Trading
                                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/trade">
                            <Button
                                variant="outline"
                                className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-base font-medium rounded-full backdrop-blur-sm"
                            >
                                Explore Platform
                            </Button>
                        </Link>
                    </div>
                </AnimatedSection>

                {/* Scroll indicator */}
                <AnimatedSection delay={500}>
                    <div className="mt-20 flex flex-col items-center gap-2 text-white/30">
                        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
                        <ChevronDown className="w-5 h-5 animate-bounce" />
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
};

// ============================================
// STATS SECTION
// ============================================
const StatsSection: React.FC = () => {
    const stats = [
        { value: '$50M+', label: 'Daily Volume', icon: TrendingUp },
        { value: '10K+', label: 'Active Traders', icon: Users },
        { value: '99.9%', label: 'Uptime', icon: Clock },
        { value: '50+', label: 'Trading Pairs', icon: Wallet },
    ];

    return (
        <section className="py-20 px-6 border-y border-white/5">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <AnimatedSection key={index} delay={index * 100}>
                            <div className="text-center">
                                <stat.icon className="w-6 h-6 text-yellow-500/50 mx-auto mb-3" />
                                <p className="text-3xl md:text-4xl font-light text-white mb-1">{stat.value}</p>
                                <p className="text-sm text-white/40">{stat.label}</p>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================
// PRODUCT SHOWCASE SECTION
// ============================================
const ProductShowcase: React.FC = () => {
    const [activeProduct, setActiveProduct] = useState(0);

    const products = [
        {
            title: 'Spot Trading',
            subtitle: 'Professional Trading Interface',
            description: 'Advanced charting tools, real-time order books, and multiple order types for professional traders.',
            image: '/images/Trade.png',
            features: ['Real-time TradingView charts', 'Market, Limit & Stop orders', 'Deep liquidity pools', 'Low trading fees'],
            link: '/trade',
        },
        {
            title: 'Quick Swap',
            subtitle: 'Instant Token Exchange',
            description: 'Swap between cryptocurrencies instantly with the best rates. No complexity, just results.',
            image: '/images/QuickSwap.png',
            features: ['One-click swaps', 'Best rate aggregation', 'No order book needed', 'Instant execution'],
            link: '/quick-swap',
        },
        {
            title: 'Secure Wallet',
            subtitle: 'Bank-Grade Asset Security',
            description: 'Your assets are protected with industry-leading security measures and full transparency.',
            image: '/images/Wallet.png',
            features: ['95% cold storage', 'Multi-signature security', 'Real-time portfolio tracking', 'Easy deposits & withdrawals'],
            link: '/my-assets',
        },
    ];

    return (
        <section className="py-32 px-6">
            <div className="max-w-7xl mx-auto">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <p className="text-yellow-500 text-sm font-medium tracking-widest uppercase mb-4">
                            Platform
                        </p>
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-4">
                            Everything you need
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto text-lg">
                            A complete suite of tools designed for traders of all levels
                        </p>
                    </div>
                </AnimatedSection>

                {/* Product tabs */}
                <AnimatedSection delay={100}>
                    <div className="flex justify-center gap-2 mb-12 flex-wrap">
                        {products.map((product, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveProduct(index)}
                                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                                    activeProduct === index
                                        ? 'bg-yellow-500 text-black'
                                        : 'text-white/60 hover:bg-white/10 border border-white/10'
                                }`}
                            >
                                {product.title}
                            </button>
                        ))}
                    </div>
                </AnimatedSection>

                {/* Product display */}
                <AnimatedSection delay={200}>
                    <GlassCard className="p-3 md:p-4" hover={false}>
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            {/* Image */}
                            <div className="rounded-xl overflow-hidden">
                                <img
                                    src={products[activeProduct].image}
                                    alt={products[activeProduct].title}
                                    className="w-full h-auto rounded-xl transition-all duration-500"
                                />
                            </div>

                            {/* Info */}
                            <div className="p-4 md:p-8">
                                <p className="text-yellow-500 text-sm font-medium mb-2">
                                    {products[activeProduct].subtitle}
                                </p>
                                <h3 className="text-3xl md:text-4xl font-light text-white mb-4">
                                    {products[activeProduct].title}
                                </h3>
                                <p className="text-white/50 mb-8 leading-relaxed text-lg">
                                    {products[activeProduct].description}
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {products[activeProduct].features.map((feature, index) => (
                                        <li key={index} className="flex items-center gap-3 text-white/70">
                                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                                <Check className="w-3 h-3 text-yellow-500" />
                                            </div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <Link to={products[activeProduct].link}>
                                    <Button className="bg-yellow-500 text-black hover:bg-yellow-400 rounded-full px-8 py-6 group">
                                        Try {products[activeProduct].title}
                                        <ArrowUpRight className="ml-2 w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </GlassCard>
                </AnimatedSection>
            </div>
        </section>
    );
};

// ============================================
// HOW IT WORKS SECTION
// ============================================
const HowItWorksSection: React.FC = () => {
    const steps = [
        {
            number: '01',
            title: 'Create Account',
            description: 'Sign up in minutes with just your email. Quick verification process.',
        },
        {
            number: '02',
            title: 'Deposit Funds',
            description: 'Add crypto or fiat currency to your secure wallet instantly.',
        },
        {
            number: '03',
            title: 'Start Trading',
            description: 'Trade 50+ cryptocurrencies with professional tools and low fees.',
        },
        {
            number: '04',
            title: 'Withdraw Anytime',
            description: 'Your funds are always accessible. Withdraw whenever you want.',
        },
    ];

    return (
        <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <AnimatedSection>
                    <div className="text-center mb-20">
                        <p className="text-yellow-500 text-sm font-medium tracking-widest uppercase mb-4">
                            Getting Started
                        </p>
                        <h2 className="text-4xl md:text-6xl font-light text-white">
                            How it works
                        </h2>
                    </div>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <AnimatedSection key={index} delay={index * 100}>
                            <div className="relative">
                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-8 left-[60%] w-full h-[1px] bg-gradient-to-r from-yellow-500/30 to-transparent" />
                                )}
                                <div className="text-center lg:text-left">
                                    <span className="text-5xl font-light text-yellow-500/20 mb-4 block">
                                        {step.number}
                                    </span>
                                    <h3 className="text-xl font-medium text-white mb-3">{step.title}</h3>
                                    <p className="text-white/40 leading-relaxed">{step.description}</p>
                                </div>
                            </div>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================
// FEATURES SECTION
// ============================================
const FeaturesSection: React.FC = () => {
    const features = [
        {
            icon: Zap,
            title: 'Lightning Fast',
            description: 'Execute trades in milliseconds with our high-performance matching engine built for speed.',
        },
        {
            icon: Shield,
            title: 'Bank-Grade Security',
            description: '95% cold storage, multi-sig wallets, regular audits, and insurance protection for your assets.',
        },
        {
            icon: Globe,
            title: 'Local Expertise',
            description: 'Built specifically for Mongolia with deep understanding of local market needs and regulations.',
        },
        {
            icon: Users,
            title: '24/7 Support',
            description: 'Our dedicated support team is always available to help you with any questions or issues.',
        },
        {
            icon: TrendingUp,
            title: 'Advanced Charts',
            description: 'Professional TradingView charts with 100+ indicators and drawing tools for technical analysis.',
        },
        {
            icon: Wallet,
            title: 'Low Fees',
            description: 'Competitive trading fees starting at just 0.1%. The more you trade, the more you save.',
        },
    ];

    return (
        <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <p className="text-yellow-500 text-sm font-medium tracking-widest uppercase mb-4">
                            Why Choose Us
                        </p>
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-4">
                            Built different
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto text-lg">
                            Every feature designed with traders in mind
                        </p>
                    </div>
                </AnimatedSection>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <AnimatedSection key={index} delay={index * 80}>
                            <GlassCard className="p-8 h-full">
                                <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-6">
                                    <feature.icon className="w-6 h-6 text-yellow-500" />
                                </div>
                                <h3 className="text-xl font-medium text-white mb-3">{feature.title}</h3>
                                <p className="text-white/50 leading-relaxed">{feature.description}</p>
                            </GlassCard>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================
// TESTIMONIALS SECTION
// ============================================
const TestimonialsSection: React.FC = () => {
    const testimonials = [
        {
            quote: "The fastest and most reliable exchange I've used in Mongolia. The interface is intuitive and trading fees are very competitive.",
            author: 'Bat-Erdene T.',
            role: 'Professional Trader',
            rating: 5,
        },
        {
            quote: "Finally, an exchange that understands the local market. Customer support is excellent and always responsive.",
            author: 'Oyungerel B.',
            role: 'Crypto Investor',
            rating: 5,
        },
        {
            quote: "Quick Swap feature is a game changer. I can exchange tokens instantly without dealing with order books.",
            author: 'Munkh-Ochir D.',
            role: 'DeFi Enthusiast',
            rating: 5,
        },
    ];

    return (
        <section className="py-32 px-6">
            <div className="max-w-6xl mx-auto">
                <AnimatedSection>
                    <div className="text-center mb-16">
                        <p className="text-yellow-500 text-sm font-medium tracking-widest uppercase mb-4">
                            Testimonials
                        </p>
                        <h2 className="text-4xl md:text-6xl font-light text-white">
                            Loved by traders
                        </h2>
                    </div>
                </AnimatedSection>

                <div className="grid md:grid-cols-3 gap-6">
                    {testimonials.map((testimonial, index) => (
                        <AnimatedSection key={index} delay={index * 100}>
                            <GlassCard className="p-8 h-full flex flex-col">
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    ))}
                                </div>
                                <p className="text-white/70 leading-relaxed mb-6 flex-grow">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <p className="text-white font-medium">{testimonial.author}</p>
                                    <p className="text-white/40 text-sm">{testimonial.role}</p>
                                </div>
                            </GlassCard>
                        </AnimatedSection>
                    ))}
                </div>
            </div>
        </section>
    );
};

// ============================================
// CTA SECTION
// ============================================
const CTASection: React.FC = () => {
    return (
        <section className="py-32 px-6">
            <div className="max-w-4xl mx-auto">
                <AnimatedSection>
                    <GlassCard className="p-12 md:p-20 text-center relative overflow-hidden" hover={false}>
                        {/* Background glows */}

                        <div className="relative z-10">
                            <p className="text-yellow-500 text-sm font-medium tracking-widest uppercase mb-4">
                                Get Started Today
                            </p>
                            <h2 className="text-4xl md:text-6xl font-light text-white mb-6">
                                Ready to trade?
                            </h2>
                            <p className="text-white/50 max-w-xl mx-auto mb-10 text-lg leading-relaxed">
                                Join thousands of traders who trust IKH MYANGAN for secure and efficient digital asset trading. Create your free account in minutes.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/register">
                                    <Button className="bg-yellow-500 text-black hover:bg-yellow-400 px-10 py-6 text-base font-medium rounded-full">
                                        Create Free Account
                                    </Button>
                                </Link>
                                <Link to="/trade">
                                    <Button
                                        variant="outline"
                                        className="border-white/20 text-white hover:bg-white/10 px-10 py-6 text-base font-medium rounded-full"
                                    >
                                        View Markets
                                    </Button>
                                </Link>
                            </div>
                            <p className="mt-6 text-white/30 text-sm">
                                No credit card required • Start trading in minutes
                            </p>
                        </div>
                    </GlassCard>
                </AnimatedSection>
            </div>
        </section>
    );
};

// ============================================
// FOOTER
// ============================================
const Footer: React.FC = () => {
    return (
        <footer className="py-12 px-6 border-t border-white/5">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">IKH MYANGAN</span>
                </div>
                <p className="text-white/30 text-sm">
                    © 2026 IKH MYANGAN. All rights reserved.
                </p>
                <div className="flex gap-8">
                    <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                        Terms
                    </a>
                    <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                        Privacy
                    </a>
                    <a href="#" className="text-white/30 hover:text-white/60 text-sm transition-colors">
                        Support
                    </a>
                </div>
            </div>
        </footer>
    );
};

// ============================================
// MAIN LANDING PAGE 3
// ============================================
const LandingPage_3: React.FC = () => {
    return (
        <div className="bg-black min-h-screen">
            <HeroSection />
            <StatsSection />
            <ProductShowcase />
            <HowItWorksSection />
            <FeaturesSection />
            <TestimonialsSection />
            <CTASection />
        </div>
    );
};

export default LandingPage_3;
