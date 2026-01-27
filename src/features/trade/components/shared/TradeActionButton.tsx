import React from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { UI_TRANSITIONS } from "@/constants/ui-policy";

interface TradeActionButtonProps extends ButtonProps {
    side: "buy" | "sell";
    label: string;
}

export const TradeActionButton = ({
    side,
    label,
    className,
    ...props
}: TradeActionButtonProps) => {
    return (
        <Button
            variant={side === "buy" ? "buy" : "sell"}
            className={cn(
                "w-full",
                UI_TRANSITIONS.DEFAULT,
                UI_TRANSITIONS.HOVER_SCALE,
                className
            )}
            {...props}
        >
            {label}
        </Button>
    );
};
