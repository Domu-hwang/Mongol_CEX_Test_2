import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { P2POrder, MerchantInfo } from '@/features/p2p/types';
import p2pApi from '@/features/p2p/api/p2pApi';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea is available
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge'; // Import Badge

const AdminConsolePage: React.FC = () => {
    const [disputes, setDisputes] = useState<P2POrder[]>([]);
    const [merchants, setMerchants] = useState<MerchantInfo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDisputes();
        fetchMerchants();
    }, []);

    const fetchDisputes = async () => {
        setLoading(true);
        setError(null);
        try {
            // Mock disputes
            const mockDisputes: P2POrder[] = [
                {
                    id: 'trade-dispute-1',
                    advertisementId: 'ad-1',
                    buyerId: 'user-456',
                    sellerId: 'merchant-123',
                    asset: 'USDT',
                    fiatCurrency: 'MNT',
                    fiatAmount: 10000,
                    cryptoAmount: 2.9,
                    price: 3450,
                    status: 'Dispute',
                    paymentMethod: 'Khan Bank',
                    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    disputeRaisedAt: new Date().toISOString(),
                    cancellationReason: 'Buyer did not pay',
                },
            ];
            setDisputes(mockDisputes);
        } catch (err) {
            setError('Failed to fetch disputes.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMerchants = async () => {
        setLoading(true);
        setError(null);
        try {
            // Mock merchant applications
            const mockMerchants: MerchantInfo[] = [
                {
                    id: 'merchant-456',
                    userId: 'user-789',
                    nickname: 'NewMerchantApp',
                    kycLevel: 'Level 2',
                    isVerified: false,
                    completedOrders: 0,
                    completionRate: 0,
                    averageReleaseTime: 0,
                    collateralAmount: 500,
                    collateralCurrency: 'USDT',
                    applicationStatus: 'Pending',
                    appliedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                },
            ];
            setMerchants(mockMerchants);
        } catch (err) {
            setError('Failed to fetch merchants.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolveDispute = async (orderId: string, action: 'release' | 'cancel') => {
        setLoading(true);
        try {
            if (action === 'release') {
                await p2pApi.releaseCryptoFromEscrow(orderId);
                alert(`Crypto released for order ${orderId}. Dispute resolved.`);
            } else if (action === 'cancel') {
                await p2pApi.returnCryptoFromEscrow(orderId);
                alert(`Order ${orderId} cancelled, crypto returned. Dispute resolved.`);
            }
            fetchDisputes(); // Refresh disputes
        } catch (err) {
            setError(`Failed to resolve dispute for order ${orderId}.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveMerchant = async (merchantId: string) => {
        setLoading(true);
        try {
            // Simulate API call to approve merchant
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert(`Merchant ${merchantId} approved.`);
            fetchMerchants(); // Refresh merchants
        } catch (err) {
            setError(`Failed to approve merchant ${merchantId}.`);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-6 px-10 bg-background text-foreground space-y-8">
            <h1 className="text-3xl font-bold mb-6">Admin Console</h1>

            <Tabs defaultValue="disputes" className="space-y-4">
                <TabsList className="bg-muted">
                    <TabsTrigger value="disputes" className="text-lg px-6 py-2">Dispute Mediation</TabsTrigger>
                    <TabsTrigger value="merchants" className="text-lg px-6 py-2">Merchant Review</TabsTrigger>
                </TabsList>

                <TabsContent value="disputes" className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Dispute Mediation Dashboard</h2>
                    {loading && <p>Loading disputes...</p>}
                    {error && <p className="text-destructive">{error}</p>}
                    {!loading && !error && disputes.length === 0 && (
                        <p className="text-muted-foreground">No active disputes.</p>
                    )}
                    <div className="space-y-4">
                        {disputes.map((dispute) => (
                            <Card key={dispute.id} className="p-4 border">
                                <CardHeader>
                                    <CardTitle>Trade ID: {dispute.id}</CardTitle>
                                    <CardDescription>Dispute raised by: {dispute.buyerId}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p><strong>Status:</strong> <Badge variant="destructive">{dispute.status}</Badge></p>
                                    <p><strong>Reason:</strong> {dispute.cancellationReason}</p>
                                    <p><strong>Amount:</strong> {dispute.cryptoAmount} {dispute.asset}</p>
                                    <p><strong>Fiat Amount:</strong> {dispute.fiatAmount} {dispute.fiatCurrency}</p>
                                    <p><strong>Raised At:</strong> {new Date(dispute.disputeRaisedAt || '').toLocaleString()}</p>
                                    {/* Placeholder for chat logs and evidence */}
                                    <div className="mt-4 p-3 border rounded-md bg-secondary text-secondary-foreground">
                                        <h3 className="font-semibold">Chat Logs & Evidence (Mock)</h3>
                                        <p>Chat log content goes here...</p>
                                        <p>Evidence: <a href="#" className="text-primary hover:underline">view_payment_proof.jpg</a></p>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <Button onClick={() => handleResolveDispute(dispute.id, 'release')} disabled={loading}>
                                            Release Crypto to Seller
                                        </Button>
                                        <Button variant="outline" onClick={() => handleResolveDispute(dispute.id, 'cancel')} disabled={loading}>
                                            Cancel Order & Return Crypto
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="merchants" className="space-y-4">
                    <h2 className="text-2xl font-bold text-foreground">Merchant Review Tool</h2>
                    {loading && <p>Loading merchant applications...</p>}
                    {error && <p className="text-destructive">{error}</p>}
                    {!loading && !error && merchants.length === 0 && (
                        <p className="text-muted-foreground">No pending merchant applications.</p>
                    )}
                    <div className="space-y-4">
                        {merchants.map((merchant) => (
                            <Card key={merchant.id} className="p-4 border">
                                <CardHeader>
                                    <CardTitle>Merchant: {merchant.nickname}</CardTitle>
                                    <CardDescription>User ID: {merchant.userId}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p><strong>KYC Level:</strong> {merchant.kycLevel}</p>
                                    <p><strong>Application Status:</strong> <Badge variant={merchant.applicationStatus === 'Approved' ? 'success' : 'default'}>{merchant.applicationStatus}</Badge></p>
                                    <p><strong>Collateral:</strong> {merchant.collateralAmount} {merchant.collateralCurrency}</p>
                                    <p><strong>Applied At:</strong> {new Date(merchant.appliedAt).toLocaleString()}</p>
                                    <div className="flex gap-2 mt-4">
                                        <Button onClick={() => handleApproveMerchant(merchant.id)} disabled={loading}>
                                            Approve Merchant
                                        </Button>
                                        {/* <Button variant="destructive" disabled={loading}>Reject Merchant</Button> */}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminConsolePage;