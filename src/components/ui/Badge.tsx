import React from 'react';
import { cn, badgeStyles } from '@/design-system';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'success' | 'outline';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          badgeStyles.base,
          badgeStyles.variants.variant[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
export default Badge;
