import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface P2pDisputeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onDisputeSubmit: (tradeId: string, reason: string, evidenceUrl?: string) => void;
    tradeId: string;
}

const P2pDisputeDialog: React.FC<P2pDisputeDialogProps> = ({
    isOpen,
    onClose,
    onDisputeSubmit,
    tradeId,
}) => {
    const [reason, setReason] = useState('');
    const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setEvidenceFile(e.target.files[0]);
        } else {
            setEvidenceFile(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reason.trim()) {
            alert('Please provide a reason for the dispute.');
            return;
        }

        setLoading(true);
        let evidenceUrl: string | undefined;

        if (evidenceFile) {
            // In a real application, you would upload the file to a storage service
            // and get a URL. This is a mock upload.
            console.log('Uploading evidence file:', evidenceFile.name);
            evidenceUrl = `mock-upload-url/${evidenceFile.name}`;
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload time
        }

        onDisputeSubmit(tradeId, reason, evidenceUrl);
        setLoading(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Raise a Dispute for Trade #{tradeId}</DialogTitle>
                    <DialogDescription>
                        Please provide details about the issue. Our support team will review your case.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div>
                        <Label htmlFor="reason">Reason for Dispute</Label>
                        <Textarea
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Describe the issue in detail..."
                            rows={5}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="evidence">Evidence (Optional)</Label>
                        <Input
                            id="evidence"
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleFileChange}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Upload screenshots of chat, payment proofs, or other relevant documents.
                        </p>
                    </div>
                    {loading && <p className="text-center text-muted-foreground">Submitting dispute...</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Dispute'}
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default P2pDisputeDialog;