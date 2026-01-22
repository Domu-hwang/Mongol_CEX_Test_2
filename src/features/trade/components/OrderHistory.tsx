export const OrderHistory = () => {
    return (
        <div className="h-full flex flex-col">
            <div className="p-2 border-b border-border font-semibold text-xs text-muted-foreground uppercase sticky top-0 bg-card z-10">
                Order History
            </div>
            <div className="flex-1 overflow-y-auto">
                {/* Example Table */}
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="text-muted-foreground">
                            <th className="py-1 px-2">Time</th>
                            <th className="py-1 px-2 text-right">Price (USDT)</th>
                            <th className="py-1 px-2 text-right">Amount (BTC)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: 20 }).map((_, i) => (
                            <tr key={i} className="hover:bg-muted/20">
                                <td className="py-1 px-2">13:0{i}</td>
                                <td className="py-1 px-2 text-right">4215{i}.00</td>
                                <td className="py-1 px-2 text-right">0.0{i}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
