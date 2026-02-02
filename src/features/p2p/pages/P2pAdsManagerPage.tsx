import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { P2PAd } from '../types';
import p2pApi from '../api/p2pApi';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdEditDialogProps {
    isOpen: boolean;
    onClose: () => void;
    ad: P2PAd | null;
    onSave: (ad: P2PAd) => void;
}

const AdEditDialog: React.FC<AdEditDialogProps> = ({ isOpen, onClose, ad, onSave }) => {
    const [editedAd, setEditedAd] = useState<P2PAd | null>(ad);

    useEffect(() => {
        setEditedAd(ad);
    }, [ad]);

    if (!editedAd) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setEditedAd(prev => {
            if (!prev) return null;
            if (id === 'price' || id === 'minLimit' || id === 'maxLimit' || id === 'availableAmount' || id === 'totalAmount' || id === 'floatingRate') {
                return { ...prev, [id]: parseFloat(value) || 0 };
            }
            return { ...prev, [id]: value };
        });
    };

    const handleSwitchChange = (checked: boolean) => {
        setEditedAd(prev => (prev ? { ...prev, status: checked ? 'Active' : 'Inactive' } : null));
    };

    const handlePriceTypeChange = (value: string) => {
        setEditedAd(prev => (prev ? { ...prev, priceType: value as 'Fixed' | 'Floating' } : null));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editedAd) {
            onSave(editedAd);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{ad?.id ? 'Edit Ad' : 'Create New Ad'}</DialogTitle>
                    <DialogDescription>
                        {ad?.id ? `Editing Ad ID: ${ad.id}` : 'Create a new P2P advertisement.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="asset" className="text-right">Asset</Label>
                        <Input id="asset" value={editedAd.asset} onChange={handleChange} className="col-span-3" readOnly={!!editedAd.id} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fiatCurrency" className="text-right">Fiat Currency</Label>
                        <Input id="fiatCurrency" value={editedAd.fiatCurrency} onChange={handleChange} className="col-span-3" readOnly={!!editedAd.id} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="type" className="text-right">Type</Label>
                        <Select value={editedAd.type} onValueChange={(value) => setEditedAd(prev => (prev ? { ...prev, type: value as 'BUY' | 'SELL' } : null))} disabled={!!editedAd.id}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BUY">BUY</SelectItem>
                                <SelectItem value="SELL">SELL</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="price" className="text-right">Price</Label>
                        <Input id="price" type="number" value={editedAd.price} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="priceType" className="text-right">Price Type</Label>
                        <Select value={editedAd.priceType} onValueChange={handlePriceTypeChange}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select price type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Fixed">Fixed</SelectItem>
                                <SelectItem value="Floating">Floating</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    {editedAd.priceType === 'Floating' && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="floatingRate" className="text-right">Floating Rate (%)</Label>
                            <Input id="floatingRate" type="number" value={editedAd.floatingRate || 0} onChange={handleChange} className="col-span-3" />
                        </div>
                    )}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="minLimit" className="text-right">Min Limit</Label>
                        <Input id="minLimit" type="number" value={editedAd.minLimit} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="maxLimit" className="text-right">Max Limit</Label>
                        <Input id="maxLimit" type="number" value={editedAd.maxLimit} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="availableAmount" className="text-right">Available Amount</Label>
                        <Input id="availableAmount" type="number" value={editedAd.availableAmount} onChange={handleChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="terms" className="text-right">Terms</Label>
                        <textarea id="terms" value={editedAd.terms} onChange={handleChange} className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                    </div>
                    <DialogFooter>
                        <Button type="submit">Save Ad</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const P2pAdsManagerPage = () => {
    const [myAds, setMyAds] = useState<P2PAd[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [currentAd, setCurrentAd] = useState<P2PAd | null>(null);

    const mockMerchantId = 'merchant-123'; // Replace with actual merchant ID

    useEffect(() => {
        fetchMyAds();
    }, []);

    const fetchMyAds = async () => {
        setLoading(true);
        setError(null);
        try {
            // In a real application, fetch ads specific to the current merchant
            const fetchedAds = await p2pApi.getAds('BUY'); // Or 'SELL', or both, depending on how ads are managed
            const mockAds: P2PAd[] = [
                {
                    id: 'ad-1',
                    merchantId: mockMerchantId,
                    type: 'BUY',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    price: 3450,
                    minLimit: 10000,
                    maxLimit: 1000000,
                    availableAmount: 500,
                    totalAmount: 1000,
                    paymentMethods: ['Khan Bank', 'TDB'],
                    terms: 'Fast trade. Only verified users.',
                    status: 'Active',
                    priceType: 'Fixed',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
                {
                    id: 'ad-2',
                    merchantId: mockMerchantId,
                    type: 'SELL',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    price: 3460,
                    minLimit: 50000,
                    maxLimit: 2000000,
                    availableAmount: 1000,
                    totalAmount: 2000,
                    paymentMethods: ['State Bank'],
                    terms: 'Instant release.',
                    status: 'Inactive',
                    priceType: 'Floating',
                    floatingRate: 0.01, // 1% above market
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            ];
            setMyAds(mockAds);
        } catch (err) {
            setError('Failed to fetch my ads.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdStatus = async (adId: string, currentStatus: 'Active' | 'Inactive') => {
        setLoading(true);
        try {
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
            await p2pApi.updateAd(adId, { status: newStatus });
            alert(`Ad ${adId} is now ${newStatus}.`);
            fetchMyAds();
        } catch (err) {
            setError('Failed to update ad status.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditAd = (ad: P2PAd) => {
        setCurrentAd(ad);
        setIsEditDialogOpen(true);
    };

    const handleSaveAd = async (updatedAd: P2PAd) => {
        setLoading(true);
        try {
            await p2pApi.updateAd(updatedAd.id, updatedAd);
            alert(`Ad ${updatedAd.id} updated successfully.`);
            setIsEditDialogOpen(false);
            setCurrentAd(null);
            fetchMyAds();
        } catch (err) {
            setError('Failed to save ad.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewAd = () => {
        // Provide a basic structure for a new ad
        setCurrentAd({
            id: '', // Will be assigned by API
            merchantId: mockMerchantId,
            type: 'SELL',
            asset: 'USDT',
            fiatCurrency: 'MNT',
            price: 0,
            minLimit: 0,
            maxLimit: 0,
            availableAmount: 0,
            totalAmount: 0,
            paymentMethods: [],
            terms: '',
            status: 'Active',
            priceType: 'Fixed',
            createdAt: '', // Will be assigned by API
            updatedAt: '', // Will be assigned by API
        });
        setIsEditDialogOpen(true);
    };

    const handleDeleteAd = async (adId: string) => {
        if (!confirm('Are you sure you want to delete this ad?')) return;
        setLoading(true);
        try {
            await p2pApi.deleteAd(adId);
            alert(`Ad ${adId} deleted successfully.`);
            fetchMyAds();
        } catch (err) {
            setError('Failed to delete ad.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6 px-10 bg-background text-foreground space-y-8">
            <h1 className="text-3xl font-bold mb-6">My P2P Ads</h1>
            <Button onClick={handleCreateNewAd} className="mb-4">Create New Ad</Button>

            {loading && <p className="text-center">Loading your ads...</p>}
            {error && <p className="text-center text-destructive">{error}</p>}

            {!loading && !error && myAds.length === 0 && (
                <p className="text-center text-muted-foreground">You have no P2P ads. Create one to get started!</p>
            )}

            <div className="space-y-4">
                {myAds.map((ad) => (
                    <Card key={ad.id} className="p-4 border border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                {ad.type} {ad.asset} at {ad.price} {ad.fiatCurrency}
                            </CardTitle>
                            <Badge variant={ad.status === 'Active' ? 'success' : 'secondary'}>
                                {ad.status}
                            </Badge>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <p>Limit: {ad.minLimit} - {ad.maxLimit} {ad.fiatCurrency}</p>
                            <p>Available: {ad.availableAmount} {ad.asset}</p>
                            <p>Payment Methods: {ad.paymentMethods.join(', ')}</p>
                            <p>Price Type: {ad.priceType} {ad.priceType === 'Floating' && `(${ad.floatingRate}% above/below market)`}</p>
                            <div className="flex items-center space-x-2 mt-4">
                                <Switch
                                    id={`status-switch-${ad.id}`}
                                    checked={ad.status === 'Active'}
                                    onCheckedChange={() => handleToggleAdStatus(ad.id, ad.status)}
                                    disabled={loading}
                                />
                                <Label htmlFor={`status-switch-${ad.id}`}>
                                    {ad.status === 'Active' ? 'Ad is Active' : 'Ad is Inactive'}
                                </Label>
                                <Button variant="outline" size="sm" onClick={() => handleEditAd(ad)} disabled={loading}>
                                    Edit
                                </Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)} disabled={loading}>
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AdEditDialog
                isOpen={isEditDialogOpen}
                onClose={() => setIsEditDialogOpen(false)}
                ad={currentAd}
                onSave={handleSaveAd}
            />
        </div>
    );
};

export default P2pAdsManagerPage;