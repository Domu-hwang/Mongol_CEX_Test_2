/**
 * Design System - Component Style Tokens
 * Based on shadcn/ui component patterns using cva (class-variance-authority)
 */

// Button component styles
export const buttonStyles = {
  base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',

  variants: {
    variant: {
      default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90',
      destructive: 'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
      success: 'bg-success text-success-foreground shadow-sm hover:bg-success/90',
      outline: 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    },
    size: {
      default: 'h-9 px-4 py-2',
      xs: 'h-7 rounded px-2 text-xs',
      sm: 'h-8 rounded-md px-3 text-xs',
      lg: 'h-10 rounded-md px-8',
      xl: 'h-12 rounded-md px-10 text-base',
      icon: 'h-9 w-9',
      'icon-xs': 'h-7 w-7',
      'icon-sm': 'h-8 w-8',
      'icon-lg': 'h-10 w-10',
    },
  },

  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
} as const;

// Card component styles
export const cardStyles = {
  root: 'rounded-xl border border-border bg-card text-card-foreground shadow',
  header: 'flex flex-col space-y-1.5 p-6',
  title: 'font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',
  content: 'p-6 pt-0',
  footer: 'flex items-center p-6 pt-0',

  variants: {
    size: {
      default: '',
      sm: '[&_.card-header]:p-4 [&_.card-content]:p-4 [&_.card-footer]:p-4',
    },
  },
} as const;

// Input component styles
export const inputStyles = {
  base: 'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',

  variants: {
    size: {
      default: 'h-9',
      sm: 'h-8 text-xs',
      lg: 'h-11 text-base',
    },
    state: {
      default: '',
      error: 'border-destructive focus-visible:ring-destructive',
      success: 'border-success focus-visible:ring-success',
    },
  },

  label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  description: 'text-sm text-muted-foreground',
  errorMessage: 'text-sm font-medium text-destructive',
} as const;

// Dialog/Modal component styles
export const dialogStyles = {
  overlay: 'fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',

  content: 'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg',

  header: 'flex flex-col space-y-1.5 text-center sm:text-left',
  footer: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
  title: 'text-lg font-semibold leading-none tracking-tight',
  description: 'text-sm text-muted-foreground',

  closeButton: 'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground',
} as const;

// Tabs component styles
export const tabsStyles = {
  list: 'inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground',

  trigger: 'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow',

  content: 'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',

  // Alternative underline style (trading UI style)
  listUnderline: 'inline-flex items-center border-b border-border',
  triggerUnderline: 'inline-flex items-center justify-center whitespace-nowrap px-4 py-2 text-sm font-medium transition-colors border-b-2 border-transparent hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary',
} as const;

// Badge component styles
export const badgeStyles = {
  base: 'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',

  variants: {
    variant: {
      default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
      secondary: 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
      destructive: 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
      success: 'border-transparent bg-success text-success-foreground shadow hover:bg-success/80',
      outline: 'text-foreground',
    },
  },
} as const;

// Alert component styles
export const alertStyles = {
  base: 'relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7',

  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive: 'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
      success: 'border-success/50 text-success [&>svg]:text-success',
      warning: 'border-warning/50 text-warning [&>svg]:text-warning',
    },
  },

  title: 'mb-1 font-medium leading-none tracking-tight',
  description: 'text-sm [&_p]:leading-relaxed',
} as const;

// Table component styles
export const tableStyles = {
  wrapper: 'relative w-full overflow-auto',
  root: 'w-full caption-bottom text-sm',
  header: '[&_tr]:border-b',
  body: '[&_tr:last-child]:border-0',
  footer: 'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
  row: 'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
  head: 'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  cell: 'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
  caption: 'mt-4 text-sm text-muted-foreground',
} as const;

// Skeleton component styles
export const skeletonStyles = {
  base: 'animate-pulse rounded-md bg-primary/10',
} as const;

// Separator component styles
export const separatorStyles = {
  root: 'shrink-0 bg-border',
  horizontal: 'h-[1px] w-full',
  vertical: 'h-full w-[1px]',
} as const;

// ScrollArea component styles
export const scrollAreaStyles = {
  root: 'relative overflow-hidden',
  viewport: 'h-full w-full rounded-[inherit]',
  scrollbar: 'flex touch-none select-none transition-colors',
  scrollbarVertical: 'h-full w-2.5 border-l border-l-transparent p-[1px]',
  scrollbarHorizontal: 'h-2.5 flex-col border-t border-t-transparent p-[1px]',
  thumb: 'relative flex-1 rounded-full bg-border',
} as const;

export type ButtonVariant = keyof typeof buttonStyles.variants.variant;
export type ButtonSize = keyof typeof buttonStyles.variants.size;
export type BadgeVariant = keyof typeof badgeStyles.variants.variant;
