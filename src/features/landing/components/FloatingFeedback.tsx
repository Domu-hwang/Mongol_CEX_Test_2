import React, { useState } from 'react';
import { MessageCircle, X, Bug, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingFeedback: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Expanded Menu */}
            {isOpen && (
                <div className="mb-4 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
                    <a
                        href="mailto:support@mongolcex.com?subject=Bug Report"
                        className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3 shadow-lg hover:border-yellow-500/50 transition-colors"
                    >
                        <Bug className="w-5 h-5 text-red-500" />
                        <span className="text-sm font-medium text-foreground">Report Bug</span>
                    </a>
                    <a
                        href="mailto:support@mongolcex.com?subject=Feedback"
                        className="flex items-center gap-2 bg-card border border-border rounded-lg px-4 py-3 shadow-lg hover:border-yellow-500/50 transition-colors"
                    >
                        <Lightbulb className="w-5 h-5 text-yellow-500" />
                        <span className="text-sm font-medium text-foreground">Send Feedback</span>
                    </a>
                </div>
            )}

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg transition-all ${isOpen
                    ? 'bg-secondary hover:bg-secondary/80'
                    : 'bg-yellow-500 hover:bg-yellow-600'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-secondary-foreground" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-black" />
                )}
            </Button>
        </div>
    );
};

export default FloatingFeedback;
