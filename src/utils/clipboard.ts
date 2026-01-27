import { createToast } from '@/components/ui/use-toast';

export interface ClipboardResult {
    success: boolean;
    error?: string;
}

export const copyToClipboard = async (text: string): Promise<ClipboardResult> => {
    try {
        // Check if clipboard API is available (requires HTTPS or localhost)
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            createToast({
                title: 'Copied!',
                description: 'Address copied to clipboard',
            });
            return { success: true };
        } else {
            // Fallback for non-HTTPS environments
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            const success = document.execCommand('copy');
            document.body.removeChild(textArea);

            if (success) {
                createToast({
                    title: 'Copied!',
                    description: 'Address copied to clipboard',
                });
                return { success: true };
            } else {
                throw new Error('Copy command failed');
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to copy';
        createToast({
            title: 'Copy failed',
            description: 'Please copy the address manually',
            variant: 'destructive',
        });
        return { success: false, error: errorMessage };
    }
};
