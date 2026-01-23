import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TriangleAlert } from 'lucide-react';

const VerificationStatusCard: React.FC = () => {
    return (
        <Card className="bg-gray-800 border-yellow-500 border-l-4">
            <CardContent className="p-4 flex items-center space-x-4">
                <TriangleAlert className="h-8 w-8 text-yellow-500" />
                <div>
                    <h4 className="text-lg font-semibold text-white">Verification Failed</h4>
                    <p className="text-gray-400 text-sm">Please view the reasons and resubmit when you are ready.</p>
                    <Button variant="default" className="mt-2">View Details</Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default VerificationStatusCard;
