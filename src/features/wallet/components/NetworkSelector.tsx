import React from 'react';
import { NetworkPolicy } from '@/constants/cryptoPolicy';
import { AlertTriangle } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface NetworkSelectorProps {
    networks: NetworkPolicy[];
    selectedNetwork: string | null;
    onNetworkSelect: (network: string) => void;
    disabled?: boolean;
}

const NetworkSelector: React.FC<NetworkSelectorProps> = ({
    networks,
    selectedNetwork,
    onNetworkSelect,
    disabled = false,
}) => {
    // Find the selected network details
    const selectedNetworkDetails = networks.find(n => n.network === selectedNetwork);

    if (networks.length === 0) {
        return (
            <div className="text-sm text-muted-foreground p-4 text-center border border-dashed rounded-md">
                No networks available for this currency
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <Select
                value={selectedNetwork || ''}
                onValueChange={onNetworkSelect}
                disabled={disabled}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                    {networks.map((network) => (
                        <SelectItem
                            key={network.network}
                            value={network.network}
                            disabled={!network.isActive}
                        >
                            <div className="flex items-center gap-2">
                                <span className="font-medium">{network.networkFullName}</span>
                                <span className="text-xs text-muted-foreground">
                                    ({network.network})
                                </span>
                                {!network.isActive && (
                                    <span className="text-xs text-destructive ml-2">
                                        Unavailable
                                    </span>
                                )}
                            </div>
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Network details when selected */}
            {selectedNetworkDetails && (
                <div className="text-xs text-muted-foreground flex items-center gap-4">
                    <span>Fee: {selectedNetworkDetails.fee}</span>
                    <span>Est. {selectedNetworkDetails.estimatedTime}</span>
                </div>
            )}

            {/* Warning message */}
            <div className="p-3 bg-card-foreground/10 border border-border rounded-md flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                    Please note that only supported networks are shown. If you deposit via another network your assets may be lost.
                </p>
            </div>
        </div>
    );
};

export default NetworkSelector;
