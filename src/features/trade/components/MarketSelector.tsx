export const MarketSelector = () => {
    return (
        <div className="h-full w-full p-2 text-muted-foreground text-sm flex flex-col justify-center items-center">
            <p>Market Selector content goes here</p>
            {/* Example Market List */}
            <div className="w-full mt-4">
                <div className="grid grid-cols-3 gap-1 text-[10px] text-muted-foreground border-b border-border pb-1 sticky top-0 bg-card">
                    <span className="col-span-1">Pair</span>
                    <span className="col-span-1 text-right">Price</span>
                    <span className="col-span-1 text-right">Change</span>
                </div>
                <div className="overflow-y-auto h-[calc(100%-25px)]"> {/* Adjust height based on header */}
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="grid grid-cols-3 gap-1 py-1 hover:bg-muted/20 cursor-pointer">
                            <span className="col-span-1 text-foreground">BTC/USDT</span>
                            <span className="col-span-1 text-right">4215{i}.00</span>
                            <span className={`col-span-1 text-right ${i % 2 === 0 ? 'text-success' : 'text-destructive'}`}>
                                {i % 2 === 0 ? '+' : '-'}{i}.{i}0%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};