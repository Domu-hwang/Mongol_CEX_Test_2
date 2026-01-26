import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    return (
        <footer className="bg-card text-foreground py-12 border-t border-border">
            <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-5 gap-8">
                <div className="md:col-span-1">
                    <h3 className="text-xl font-bold mb-4 text-yellow-500">IKH MYANGAN</h3>
                    <p className="text-muted-foreground text-sm">
                        Building the future of digital finance in Mongolia with global standards.
                    </p>
                    <div className="flex space-x-4 mt-6">
                        {/* Social Media Icons */}
                        <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-yellow-500 transition-colors">
                            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M20.927 2.000a1.328 1.328 0 0 0-1.288-.958 1.487 1.487 0 0 0-1.291.607c-1.396-.549-2.825-.97-4.22-.97-1.465 0-2.871.421-4.276.98C8.598.665 7.156.042 5.7.042 4.398.042 3.037.492 1.77 1.353a1.474 1.474 0 0 0-1.311.958A1.332 1.332 0 0 0 0 2.457c0 1.5.704 2.946 1.636 4.364 1.258 1.83 2.766 3.557 4.502 5.213.351.34.69.7.994 1.056l.006.006c.071.082.146.165.23.245.244.227.49.444.757.652.285.22.585.426.903.62.062.037.124.072.187.108.151.087.306.166.467.234.331.144.686.273 1.05.39.293.094.596.177.904.25.132.031.265.059.398.087.037.009.073.018.11.026.069.016.138.031.208.046a.82.82 0 0 0 .153.028c.45.034.903.051 1.359.051 1.634 0 3.25-.378 4.755-1.12.3-.146.593-.298.882-.456a.71.71 0 0 0 .204-.11c.29-.15.568-.31.834-.48.24-.153.468-.31.678-.474.32-.24.622-.505.886-.78.34-.35.666-.704.972-1.071C22.618 6.94 24 4.5 24 2.457A1.328 1.328 0 0 0 20.927 2.000zM8.3 12.308c-1.164 0-2.106-.942-2.106-2.106 0-1.164.942-2.106 2.106-2.106s2.106.942 2.106 2.106c0 1.164-.942 2.106-2.106 2.106zm7.4 0c-1.164 0-2.106-.942-2.106-2.106 0-1.164.942-2.106 2.106-2.106s2.106.942 2.106 2.106c0 1.164-.942 2.106-2.106 2.106z"></path></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-yellow-500 transition-colors">
                            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M18.901 1.153C20.59.324 22 2.008 22 3.867v16.264c0 1.86-1.407 3.543-3.099 2.714L.925 14.88c-1.693-.829-1.693-3.197 0-4.025L18.901 1.153zM16.48 8.016l-3.376 4.398-4.226-2.529.816-1.554-1.22-.71-1.43 2.723-1.636-.96 1.43-2.723 1.22.71 1.385-2.63-2.028-1.18 2.028 1.18 1.636.96 1.22-.71-1.385 2.63 1.22-.71 1.43-2.723 1.636.96-.816 1.554L16.48 8.016z"></path></svg>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-yellow-500 transition-colors">
                            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 0C8.75 0 8.355.011 7.025.074 5.695.137 4.707.387 3.85.733c-.958.388-1.748.887-2.53 1.671-.784.782-1.282 1.572-1.67 2.53-.346.858-.596 1.846-.658 3.175-.064 1.33-.075 1.725-.075 4.975s.011 3.645.074 4.975c.063 1.33.313 2.318.658 3.175.388.958.887 1.748 1.67 2.53.782.784 1.572 1.282 2.53 1.67.858.346 1.846.596 3.175.658 1.33.064 1.725.075 4.975.075s3.645-.011 4.975-.074c1.33-.063 2.318-.313 3.175-.658.958-.388 1.748-.887 2.53-1.67.784-.782 1.282-1.572 1.67-2.53.346-.858.596-1.846.658-3.175.064-1.33.075-1.725.075-4.975s-.011-3.645-.074-4.975c-.063-1.33-.313-2.318-.658-3.175-.388-.958-.887-1.748-1.67-2.53-.782-.784-1.572-1.282-2.53-1.67C19.305.426 18.317.176 16.987.114 15.657.051 15.262.04 12 .04zM12 2.18c3.21 0 3.585.011 4.85.074 1.233.063 1.956.327 2.404.502.48.188.825.405 1.22.802.395.395.613.74.802 1.22.175.448.439 1.171.502 2.404.063 1.265.074 1.64.074 4.85s-.011 3.585-.074 4.85c-.063 1.233-.327 1.956-.502 2.404-.188.48-.405.825-.802 1.22-.395.395-.74.613-1.22.802-.448.175-1.171.439-2.404.502-1.265.063-1.64.074-4.85.074s-3.585-.011-4.85-.074c-1.233-.063-1.956-.327-2.404-.502-.48-.188-.825-.405-1.22-.802-.395-.395-.613-.74-.802-1.22-.175-.448-.439-1.171-.502-2.404-.063-1.265-.074-1.64-.074-4.85s.011-3.585.074-4.85c.063-1.233.327-1.956.502-2.404.188-.48.405-.825.802-1.22.395-.395.74-.613 1.22-.802.448-.175 1.171-.439 2.404-.502C8.415 2.191 8.79 2.18 12 2.18zM12 7.18c-2.652 0-4.82 2.168-4.82 4.82s2.168 4.82 4.82 4.82 4.82-2.168 4.82-4.82-2.168-4.82-4.82-4.82zm0 2.18c1.45 0 2.64 1.188 2.64 2.64s-1.19 2.64-2.64 2.64-2.64-1.188-2.64-2.64 1.19-2.64 2.64-2.64z"></path></svg>
                        </a>
                        <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-yellow-500 transition-colors">
                            <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M22.617 3.511C23.084 3.044 22.983 2.16 22.25 1.834c-.733-.326-1.57.195-2.037.66L.33 13.923c-.596.596-.717 1.48-.225 2.067.492.587 1.376.678 1.972.083l3.96-3.96 11.23-6.619c.706-.416 1.464-.175 1.464.673a.81.81 0 0 1-.397.697l-8.623 5.37-2.736 2.071c-.742.56-1.733.56-2.474 0-.493-.493-.615-1.192-.308-1.74l-.062-.03c-.225-.396.062-.888.459-.971l3.355-.783 7.746-4.996c.742-.416 1.464-.175 1.464.673a.81.81 0 0 1-.397.697l-9.356 5.86-1.936 1.463c-.878.662-1.928 1.46-3.048 1.34-1.12-.12-2.146-.615-2.686-1.424-.54-.81-.54-1.897 0-2.707l3.65-3.65 3.96 3.96 1.972-1.972-4.93-3.084z"></path></svg>
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
            <div className="container mx-auto px-4">
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
