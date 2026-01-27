/**
 * UI Policy Constants
 * Definitions for colors, layouts, and other UI-related policies to maintain consistency across depths.
 */

export const TRADE_COLORS = {
    BUY: "bg-success hover:bg-success/90",
    SELL: "bg-destructive hover:bg-destructive/90",
    DISABLED: "bg-muted cursor-not-allowed opacity-50",
    TEXT_BUY: "text-success",
    TEXT_SELL: "text-destructive",
} as const;

export const UI_TRANSITIONS = {
    DEFAULT: "transition-all duration-200",
    HOVER_SCALE: "hover:scale-[1.02] active:scale-[0.98]",
} as const;

export const LAYOUT_POLICIES = {
    SIDEBAR_WIDTH: "w-64",
    HEADER_HEIGHT: "h-16",
    CARD_RADIUS: "rounded-xl",
} as const;
