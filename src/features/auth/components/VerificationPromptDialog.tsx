import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose, // Import DialogClose for closing the dialog
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button'; // Import Button for actions
import { useNavigate } from 'react-router-dom';

interface VerificationPromptDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const VerificationPromptDialog: React.FC<VerificationPromptDialogProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    const handleVerifyClick = () => {
        onClose();
        navigate('/kyc'); // Navigate to the KYC page to start verification
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-800 text-white border-gray-700">
                <DialogHeader>
                    <DialogTitle className="text-yellow-500">Identity Verification Required</DialogTitle>
                    <DialogDescription className="text-gray-300">
                        To activate your account and start trading, please complete your identity verification.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost" onClick={onClose} className="text-gray-300 hover:bg-gray-700">
                            Later
                        </Button>
                    </DialogClose>
                    <Button onClick={handleVerifyClick} className="bg-yellow-500 text-black hover:bg-yellow-600">
                        Start Verification
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default VerificationPromptDialog;
