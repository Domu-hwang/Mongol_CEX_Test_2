import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-card text-foreground py-12 border-t border-border">
            <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold mb-4 text-yellow-500">IKH MYANGAN</h3>
                    <p className="text-muted-foreground text-sm">
                        Building the future of digital finance in Mongolia with global standards.
                    </p>
                    <div className="flex space-x-4 mt-6">
                        {/* Social Media Icons */}
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-yellow-500 transition-colors" aria-label="Discord">
                            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                            </svg>
                        </a>
                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-yellow-500 transition-colors" aria-label="X (Twitter)">
                            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                            </svg>
                        </a>
                        <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-yellow-500 transition-colors" aria-label="Telegram">
                            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">About Us</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/about" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">About IKH MYANGAN</Link>
                        </li>
                        <li>
                            <Link to="/careers" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">Careers</Link>
                        </li>
                        <li>
                            <Link to="/legal" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">Legal & Privacy</Link>
                        </li>
                        <li>
                            <Link to="/blog" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">Blog</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Products</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/trade" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">Spot Trading</Link>
                        </li>
                        <li>
                            <Link to="/quick-swap" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">Quick Swap</Link>
                        </li>
                        <li>
                            <Link to="/my-assets" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">My Assets</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Features</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/features-overview" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">Features Overview</Link>
                        </li>
                        <li>
                            <Link to="/security" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">Security</Link>
                        </li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-foreground">Support</h3>
                    <ul className="space-y-2">
                        <li>
                            <p className="text-muted-foreground text-sm">Email: support@mongolcex.com</p>
                        </li>
                        <li>
                            <p className="text-muted-foreground text-sm">Phone: +976 7711 7711</p>
                        </li>
                        <li>
                            <Link to="/support" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">24/7 Chat Support</Link>
                        </li>
                        <li>
                            <Link to="/faq" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">FAQ</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-muted-foreground hover:text-yellow-500 text-sm transition-colors">Contact Us</Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="border-t border-border mt-8 pt-6 mb-4">
                    <p className="text-xs text-muted-foreground text-center">
                        This service may have limited features during the pilot period. Simulation-first approach applies.
                    </p>
                </div>
                <div className="text-center text-muted-foreground text-sm">
                    &copy; {new Date().getFullYear()} IKH MYANGAN. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
