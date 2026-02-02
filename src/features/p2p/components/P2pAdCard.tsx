import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { P2PAd, MerchantInfo } from '../types';
import { Badge } from '@/components/ui/badge';

interface P2pAdCardProps {
    ad: P2PAd;
    merchantInfo: MerchantInfo; // Assuming we can fetch merchant info separately or it's embedded
    onBuySellClick: (adId: string, type: 'BUY' | 'SELL') => void;
}

const P2pAdCard: React.FC<P2pAdCardProps> = ({ ad, merchantInfo, onBuySellClick }) => {
    return (
        <Card className="bg-card border border-border p-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                    {merchantInfo.nickname}
                    {merchantInfo.isVerified && <Badge variant="secondary">Verified</Badge>}
                </CardTitle>
                <Badge variant={ad.type === 'BUY' ? 'success' : 'destructive'}>
                    {ad.type === 'BUY' ? 'Buy' : 'Sell'} {ad.asset}
                </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Completion Rate:</span>
                    <span>{(merchantInfo.completionRate * 100).toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Avg. Release Time:</span>
                    <span>{Math.round(merchantInfo.averageReleaseTime / 60)} min</span>
                </div>
                <div className="flex justify-between items-center text-lg font-semibold">
                    <span>Price:</span>
                    <span>{ad.price.toFixed(2)} {ad.fiatCurrency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Available:</span>
                    <span>{ad.availableAmount.toFixed(4)} {ad.asset}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Limit:</span>
                    <span>{ad.minLimit.toFixed(2)} - {ad.maxLimit.toFixed(2)} {ad.fiatCurrency}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Payment:</span>
                    <span>{ad.paymentMethods.join(', ')}</span>
                </div>
                <Button
                    className="w-full mt-4"
                    variant={ad.type === 'BUY' ? 'success' : 'destructive'}
                    onClick={() => onBuySellClick(ad.id, ad.type)}
                >
                    {ad.type === 'BUY' ? `Buy ${ad.asset}` : `Sell ${ad.asset}`}
                </Button>
            </CardContent>
        </Card>
    );
};

export default P2pAdCard;