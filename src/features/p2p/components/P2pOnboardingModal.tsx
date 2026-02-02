import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface P2pOnboardingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

const P2pOnboardingModal: React.FC<P2pOnboardingModalProps> = ({ isOpen, onClose, onConfirm }) => {
    const [hasAgreed, setHasAgreed] = useState(false);

    const safetyChecks = [
        {
            emoji: '👤',
            title: "It's all about you",
            description: "I'll use a bank account in my own name to keep things transparent.",
        },
        {
            emoji: '💬',
            title: "Let's keep it here",
            description: "I'll stay in the official chat so the team can support me if I need help.",
        },
        {
            emoji: '✅',
            title: "Double-check the bank",
            description: "I'll verify the actual deposit in my bank account before releasing my crypto.",
        },
    ];

    const handleConfirm = () => {
        if (hasAgreed) {
            setHasAgreed(false);
            onConfirm();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent
                className="sm:max-w-[480px] [&>button]:hidden"
                onPointerDownOutside={(e) => e.preventDefault()}
                onEscapeKeyDown={(e) => e.preventDefault()}
            >
                <DialogHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <DialogTitle className="text-xl text-center">
                        Ready to start P2P trading?
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Just a quick safety check to keep your journey secure!
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-3">
                    {safetyChecks.map((check, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                        >
                            <span className="text-xl flex-shrink-0">{check.emoji}</span>
                            <div>
                                <p className="font-medium text-sm">{check.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    "{check.description}"
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div
                    className={cn(
                        "flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors",
                        hasAgreed ? "bg-primary/10" : "bg-muted/30 hover:bg-muted/50"
                    )}
                    onClick={() => setHasAgreed(!hasAgreed)}
                >
                    <Checkbox
                        id="agreement"
                        checked={hasAgreed}
                        onCheckedChange={(checked) => setHasAgreed(checked as boolean)}
                        className="mt-0.5"
                    />
                    <label
                        htmlFor="agreement"
                        className="text-sm text-muted-foreground cursor-pointer leading-relaxed"
                    >
                        I've read the{' '}
                        <button
                            type="button"
                            className="text-primary hover:underline font-medium"
                            onClick={(e) => {
                                e.stopPropagation();
                                window.open('/p2p/safety-guidelines', '_blank');
                            }}
                        >
                            Full Safety Guidelines
                        </button>
                        {' '}and I'm ready to trade responsibly.
                    </label>
                </div>

                <DialogFooter className="pt-4">
                    <Button
                        onClick={handleConfirm}
                        className="w-full h-12"
                        disabled={!hasAgreed}
                    >
                        Got it, let's go!
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default P2pOnboardingModal;
