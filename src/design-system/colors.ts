/**
 * Design System - Color Tokens
 * Based on shadcn/ui CSS variable approach with OKLCH color space
 * Customized for CEX/Binance dark theme
 */

// CSS Variable definitions for dark theme (CEX/Binance style)
export const darkThemeVariables = {
  // Base radius
  '--radius': '0.5rem',

  // Core colors
  '--background': 'oklch(0.08 0.01 250)',      // #0b0e11 - Deep dark
  '--foreground': 'oklch(0.92 0.01 250)',      // #eaecef - Light text

  // Card surfaces
  '--card': 'oklch(0.12 0.01 250)',            // #181a20 - Card background
  '--card-foreground': 'oklch(0.92 0.01 250)', // #eaecef

  // Popover surfaces
  '--popover': 'oklch(0.12 0.01 250)',         // #181a20
  '--popover-foreground': 'oklch(0.92 0.01 250)',

  // Primary - Binance Yellow
  '--primary': 'oklch(0.88 0.17 90)',          // #fcd535
  '--primary-foreground': 'oklch(0.12 0.01 250)', // Dark text on yellow

  // Secondary
  '--secondary': 'oklch(0.35 0.02 250)',       // #474d57
  '--secondary-foreground': 'oklch(0.92 0.01 250)',

  // Muted
  '--muted': 'oklch(0.15 0.01 250)',           // #1e2329
  '--muted-foreground': 'oklch(0.55 0.02 250)', // #848e9c

  // Accent
  '--accent': 'oklch(0.15 0.01 250)',          // #1e2329
  '--accent-foreground': 'oklch(0.92 0.01 250)',

  // Destructive - Binance Red
  '--destructive': 'oklch(0.65 0.22 15)',      // #f6465d
  '--destructive-foreground': 'oklch(1 0 0)',  // White

  // Success - Binance Green
  '--success': 'oklch(0.72 0.18 160)',         // #0ecb81
  '--success-foreground': 'oklch(0.12 0.01 250)',

  // Warning
  '--warning': 'oklch(0.88 0.17 90)',          // #fcd535
  '--warning-foreground': 'oklch(0.12 0.01 250)',

  // Border and Input
  '--border': 'oklch(0.25 0.01 250)',          // #2f343c
  '--input': 'oklch(0.25 0.01 250)',           // #2f343c
  '--ring': 'oklch(0.88 0.17 90)',             // #fcd535

  // Chart colors
  '--chart-1': 'oklch(0.72 0.18 160)',         // Green
  '--chart-2': 'oklch(0.65 0.22 15)',          // Red
  '--chart-3': 'oklch(0.88 0.17 90)',          // Yellow
  '--chart-4': 'oklch(0.65 0.15 250)',         // Blue
  '--chart-5': 'oklch(0.70 0.15 300)',         // Purple
} as const;

// Light theme variables (optional, for future use)
export const lightThemeVariables = {
  '--radius': '0.5rem',

  '--background': 'oklch(1 0 0)',
  '--foreground': 'oklch(0.145 0 0)',

  '--card': 'oklch(1 0 0)',
  '--card-foreground': 'oklch(0.145 0 0)',

  '--popover': 'oklch(1 0 0)',
  '--popover-foreground': 'oklch(0.145 0 0)',

  '--primary': 'oklch(0.80 0.17 90)',
  '--primary-foreground': 'oklch(0.145 0 0)',

  '--secondary': 'oklch(0.97 0 0)',
  '--secondary-foreground': 'oklch(0.205 0 0)',

  '--muted': 'oklch(0.97 0 0)',
  '--muted-foreground': 'oklch(0.556 0 0)',

  '--accent': 'oklch(0.97 0 0)',
  '--accent-foreground': 'oklch(0.205 0 0)',

  '--destructive': 'oklch(0.577 0.245 27.325)',
  '--destructive-foreground': 'oklch(0.985 0 0)',

  '--success': 'oklch(0.72 0.18 160)',
  '--success-foreground': 'oklch(0.145 0 0)',

  '--warning': 'oklch(0.80 0.17 90)',
  '--warning-foreground': 'oklch(0.145 0 0)',

  '--border': 'oklch(0.922 0 0)',
  '--input': 'oklch(0.922 0 0)',
  '--ring': 'oklch(0.708 0 0)',

  '--chart-1': 'oklch(0.72 0.18 160)',
  '--chart-2': 'oklch(0.65 0.22 15)',
  '--chart-3': 'oklch(0.80 0.17 90)',
  '--chart-4': 'oklch(0.65 0.15 250)',
  '--chart-5': 'oklch(0.70 0.15 300)',
} as const;

// Semantic color mapping for use in components
export const semanticColors = {
  // Brand
  brand: {
    primary: 'var(--primary)',
    primaryForeground: 'var(--primary-foreground)',
  },

  // Status colors
  status: {
    success: 'var(--success)',
    successForeground: 'var(--success-foreground)',
    destructive: 'var(--destructive)',
    destructiveForeground: 'var(--destructive-foreground)',
    warning: 'var(--warning)',
    warningForeground: 'var(--warning-foreground)',
  },

  // UI surfaces
  surface: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    card: 'var(--card)',
    cardForeground: 'var(--card-foreground)',
    popover: 'var(--popover)',
    popoverForeground: 'var(--popover-foreground)',
    muted: 'var(--muted)',
    mutedForeground: 'var(--muted-foreground)',
  },

  // Interactive
  interactive: {
    accent: 'var(--accent)',
    accentForeground: 'var(--accent-foreground)',
    border: 'var(--border)',
    input: 'var(--input)',
    ring: 'var(--ring)',
  },
} as const;

export type ThemeVariables = typeof darkThemeVariables;
