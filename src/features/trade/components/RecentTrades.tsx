export const RecentTrades = () => {
    return (
        <div className="h-full w-full p-2 text-muted-foreground text-sm flex flex-col justify-center items-center">
            <p>Recent Trades content goes here</p>
            {/* Example Table */}
            <table className="w-full text-left text-xs mt-4">
                <thead>
                    <tr className="text-muted-foreground">
                        <th className="py-1">Time</th>
                        <th className="py-1">Price</th>
                        <th className="py-1 text-right">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 10 }).map((_, i) => (
                        <tr key={i} className={`${i % 2 === 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            <td className="py-1">13:0{i}</td>
                            <td className="py-1">4215{i}.00</td>
                            <td className="py-1 text-right">0.0{i} BTC</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
