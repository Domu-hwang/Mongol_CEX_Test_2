/**
 * Design System - Typography Tokens
 * Based on shadcn/ui typography scale
 */

export const fontFamily = {
  sans: [
    'Inter',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
  mono: [
    'JetBrains Mono',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'monospace',
  ],
} as const;

// Font size scale with line heights
export const fontSize = {
  xs: ['0.75rem', { lineHeight: '1rem' }],        // 12px
  sm: ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
  base: ['1rem', { lineHeight: '1.5rem' }],       // 16px
  lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
  xl: ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
  '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
  '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
  '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
  '5xl': ['3rem', { lineHeight: '1.1' }],         // 48px
  '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
} as const;

export const fontWeight = {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em',
} as const;

// Typography presets following shadcn/ui patterns
export const typographyPresets = {
  // Headings
  h1: 'scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight',
  h5: 'scroll-m-20 text-lg font-semibold tracking-tight',
  h6: 'scroll-m-20 text-base font-semibold tracking-tight',

  // Body text
  p: 'leading-7 [&:not(:first-child)]:mt-6',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
  subtle: 'text-xs text-muted-foreground',

  // Inline styles
  code: 'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold',
  kbd: 'pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground',
  blockquote: 'mt-6 border-l-2 border-border pl-6 italic',

  // Lists
  ul: 'my-6 ml-6 list-disc [&>li]:mt-2',
  ol: 'my-6 ml-6 list-decimal [&>li]:mt-2',

  // Links
  link: 'font-medium text-primary underline underline-offset-4 hover:text-primary/80',
} as const;

// Trading-specific typography (for CEX applications)
export const tradingTypography = {
  price: 'font-mono tabular-nums tracking-tight',
  priceUp: 'font-mono tabular-nums tracking-tight text-success',
  priceDown: 'font-mono tabular-nums tracking-tight text-destructive',
  volume: 'font-mono tabular-nums text-sm text-muted-foreground',
  percentage: 'font-mono tabular-nums text-sm',
  percentageUp: 'font-mono tabular-nums text-sm text-success',
  percentageDown: 'font-mono tabular-nums text-sm text-destructive',
} as const;

export type TypographyPreset = keyof typeof typographyPresets;
export type TradingTypographyPreset = keyof typeof tradingTypography;
