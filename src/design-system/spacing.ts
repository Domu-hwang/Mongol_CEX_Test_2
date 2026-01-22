/**
 * Design System - Spacing & Layout Tokens
 * Based on shadcn/ui spacing scale (4px base unit)
 */

// Spacing scale (in rem, based on 4px increments)
export const spacing = {
  px: '1px',
  0: '0px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px (touch target minimum)
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// Border radius tokens using CSS variable
export const borderRadius = {
  none: '0px',
  sm: 'calc(var(--radius) - 4px)',    // 4px
  DEFAULT: 'var(--radius)',            // 8px
  md: 'calc(var(--radius) - 2px)',     // 6px
  lg: 'var(--radius)',                 // 8px
  xl: 'calc(var(--radius) + 4px)',     // 12px
  '2xl': 'calc(var(--radius) + 8px)',  // 16px
  '3xl': 'calc(var(--radius) + 16px)', // 24px
  full: '9999px',
} as const;

// Container widths
export const containerWidths = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1400px',
  '3xl': '1600px',
} as const;

// Breakpoints (mobile-first)
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Z-index scale
export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',      // Base elevated
  20: '20',      // Sticky elements
  30: '30',      // Fixed headers
  40: '40',      // Overlays
  50: '50',      // Modal/Dialog
  60: '60',      // Dropdown menus
  70: '70',      // Tooltips
  80: '80',      // Popovers
  90: '90',      // Toasts/Notifications
  100: '100',    // Maximum priority
} as const;

// Layout pattern utilities
export const layoutPatterns = {
  // Flexbox patterns
  center: 'flex items-center justify-center',
  centerX: 'flex justify-center',
  centerY: 'flex items-center',
  between: 'flex items-center justify-between',
  start: 'flex items-center justify-start',
  end: 'flex items-center justify-end',

  // Stack (vertical layouts)
  stack: 'flex flex-col',
  stackXs: 'flex flex-col gap-1',
  stackSm: 'flex flex-col gap-2',
  stackMd: 'flex flex-col gap-4',
  stackLg: 'flex flex-col gap-6',
  stackXl: 'flex flex-col gap-8',

  // Row (horizontal layouts)
  row: 'flex flex-row',
  rowXs: 'flex flex-row gap-1',
  rowSm: 'flex flex-row gap-2',
  rowMd: 'flex flex-row gap-4',
  rowLg: 'flex flex-row gap-6',
  rowXl: 'flex flex-row gap-8',

  // Grid patterns
  grid2: 'grid grid-cols-2 gap-4',
  grid3: 'grid grid-cols-3 gap-4',
  grid4: 'grid grid-cols-4 gap-4',
  gridAuto: 'grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4',

  // Container
  container: 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
  containerSm: 'mx-auto w-full max-w-3xl px-4 sm:px-6',
  containerLg: 'mx-auto w-full max-w-screen-2xl px-4 sm:px-6 lg:px-8',

  // Touch target (minimum 44px for accessibility)
  touchTarget: 'min-h-11 min-w-11',

  // Full screen
  fullScreen: 'min-h-screen w-full',
  fullViewport: 'h-dvh w-full',
} as const;

// Animation durations
export const animationDurations = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

// Easing functions
export const easings = {
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export type SpacingToken = keyof typeof spacing;
export type BorderRadiusToken = keyof typeof borderRadius;
export type LayoutPattern = keyof typeof layoutPatterns;
