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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface P2pTransferDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onTransfer: (fromAccount: string, toAccount: string, amount: number, asset: string) => void;
    spotBalance: number;
    p2pBalance: number;
    availableAssets: string[];
}

const P2pTransferDialog: React.FC<P2pTransferDialogProps> = ({
    isOpen,
    onClose,
    onTransfer,
    spotBalance,
    p2pBalance,
    availableAssets,
}) => {
    const [fromAccount, setFromAccount] = useState('spot');
    const [toAccount, setToAccount] = useState('p2p');
    const [amount, setAmount] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(availableAssets[0] || 'USDT');

    const handleSwapAccounts = () => {
        setFromAccount(toAccount);
        setToAccount(fromAccount);
        setAmount(''); // Clear amount on swap
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const transferAmount = parseFloat(amount);
        if (isNaN(transferAmount) || transferAmount <= 0) {
            alert('Please enter a valid amount.');
            return;
        }
        onTransfer(fromAccount, toAccount, transferAmount, selectedAsset);
        onClose();
    };

    const currentBalance = fromAccount === 'spot' ? spotBalance : p2pBalance;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Transfer Funds</DialogTitle>
                    <DialogDescription>
                        Move assets between your Spot Wallet and P2P Account.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fromAccount" className="text-right">
                            From
                        </Label>
                        <Select value={fromAccount} onValueChange={setFromAccount}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="spot">Spot Wallet ({spotBalance.toFixed(2)} {selectedAsset})</SelectItem>
                                <SelectItem value="p2p">P2P Account ({p2pBalance.toFixed(2)} {selectedAsset})</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="col-start-2 col-span-1"
                            onClick={handleSwapAccounts}
                        >
                            ⇅
                        </Button>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="toAccount" className="text-right">
                            To
                        </Label>
                        <Select value={toAccount} onValueChange={setToAccount}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="spot">Spot Wallet ({spotBalance.toFixed(2)} {selectedAsset})</SelectItem>
                                <SelectItem value="p2p">P2P Account ({p2pBalance.toFixed(2)} {selectedAsset})</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="asset" className="text-right">
                            Asset
                        </Label>
                        <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select asset" />
                            </SelectTrigger>
                            <SelectContent>
                                {availableAssets.map((asset) => (
                                    <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="amount" className="text-right">
                            Amount
                        </Label>
                        <Input
                            id="amount"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="col-span-3"
                            placeholder={`Available: ${currentBalance.toFixed(2)} ${selectedAsset}`}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Confirm Transfer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default P2pTransferDialog;