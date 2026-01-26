import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { TriangleAlert } from 'lucide-react';

const VerificationStatusCard: React.FC = () => {
    return (
        <Card className="bg-card border-yellow-500 border-l-4">
            <CardContent className="p-4 flex items-center space-x-4">
                <TriangleAlert className="h-8 w-8 text-yellow-500" />
                <div>
                    <h4 className="text-lg font-semibold text-foreground">Verification Failed</h4>
                    <p className="text-muted-foreground text-sm">Please view the reasons and resubmit when you are ready.</p>
                    <Button variant="default" className="mt-2">View Details</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default VerificationStatusCard;
