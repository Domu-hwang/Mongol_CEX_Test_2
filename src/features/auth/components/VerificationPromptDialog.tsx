import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

interface VerificationPromptDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const VerificationPromptDialog: React.FC<VerificationPromptDialogProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleVerifyClick = () => {
        onClose();
        navigate('/onboarding/intro/otp');
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-foreground">Identity Verification Required</DialogTitle>
                    <DialogDescription className="text-muted-foreground pt-2">
                        To activate your account and start trading, please complete your identity verification. This helps ensure a secure environment for all testers.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 flex justify-center">
                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center">
                        <span className="text-2xl">🔐</span>
                    </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                    <DialogClose asChild>
                        <Button type="button" variant="ghost" onClick={onClose}>
                            Later
                        </Button>
                    </DialogClose>
                    <Button variant="yellow" onClick={handleVerifyClick} className="w-full sm:w-auto">
                        Start Verification
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default VerificationPromptDialog;
