/**
 * Design System - Main Export
 * Based on shadcn/ui design patterns
 *
 * This design system provides:
 * - Color tokens with CSS variables (OKLCH color space)
 * - Typography scale and presets
 * - Spacing and layout utilities
 * - Component style definitions
 * - Utility functions
 */

// Utility function
export { cn } from './cn';

// Color tokens and theme variables
export {
  darkThemeVariables,
  lightThemeVariables,
  semanticColors,
  type ThemeVariables,
} from './colors';

// Typography tokens
export {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  typographyPresets,
  tradingTypography,
  type TypographyPreset,
  type TradingTypographyPreset,
} from './typography';

// Spacing and layout tokens
export {
  spacing,
  borderRadius,
  containerWidths,
  breakpoints,
  zIndex,
  layoutPatterns,
  animationDurations,
  easings,
  type SpacingToken,
  type BorderRadiusToken,
  type LayoutPattern,
} from './spacing';

// Component style tokens
export {
  buttonStyles,
  cardStyles,
  inputStyles,
  dialogStyles,
  tabsStyles,
  badgeStyles,
  alertStyles,
  tableStyles,
  skeletonStyles,
  separatorStyles,
  scrollAreaStyles,
  type ButtonVariant,
  type ButtonSize,
  type BadgeVariant,
} from './components';
