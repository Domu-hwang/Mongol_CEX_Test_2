import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface P2pWalletAccountProps {
    balance: number;
    currency: string;
    onTransferClick: () => void;
}

const P2pWalletAccount: React.FC<P2pWalletAccountProps> = ({ balance, currency, onTransferClick }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>P2P Account</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold">{balance.toFixed(2)} {currency}</span>
                    <Button onClick={onTransferClick}>Transfer</Button>
                </div>
                <p className="text-muted-foreground">
                    Funds in your P2P account are used for P2P trading. You can transfer funds between your Spot and P2P accounts.
                </p>
            </CardContent>
        </Card>
    );
};

export default P2pWalletAccount;